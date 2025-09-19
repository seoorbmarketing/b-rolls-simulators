// Global state
let messageCounter = 0;
let scenarioSteps = [];
let scenarioTimeout = null;
let isScenarioPlaying = false;
let businessData = {};
let currentBusiness = '';
let tempBusinessImages = {};
let savedScenarios = {};

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const agentName = document.getElementById('agentName');
const agentStatus = document.getElementById('agentStatus');
const agentAvatar = document.getElementById('agentAvatar');
const typingIndicator = document.getElementById('typingIndicator');
const poweredByLink = document.getElementById('poweredByLink');

// Audio notification
const messageAudio = new Audio('message-notification-2.mp3');
const notificationAudio = new Audio('message-notification.mp3');

// Play message notification sound
function playMessageSound() {
    messageAudio.currentTime = 0; // Reset audio to beginning
    messageAudio.play().catch(e => {
        // Handle autoplay restrictions silently
        console.log('Audio play failed:', e);
    });
}

// Play notification sound
function playNotificationSound() {
    notificationAudio.currentTime = 0; // Reset audio to beginning
    notificationAudio.play().catch(e => {
        // Handle autoplay restrictions silently
        console.log('Audio play failed:', e);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedSettings();
    loadBusinessData();
    loadSavedScenarios();
    setupEventListeners();
    initializeBusinessSelector();
    updateStatusColor(); // Initialize status dot color
    restoreSelectedBusiness();
    restoreSelectedScenario();
    // Don't add default messages on initial load - only when chat opens
});

// Toggle chat widget visibility
function toggleChat(skipDefaultMessages = false) {
    const chatWidgetContainer = document.getElementById('chatWidgetContainer');
    const chatbotButton = document.getElementById('chatbotButton');
    const chatOverlay = document.getElementById('chatOverlay');
    
    if (chatWidgetContainer.style.display === 'none') {
        chatWidgetContainer.style.display = 'block';
        chatOverlay.style.display = 'block';
        chatbotButton.classList.add('active');
        chatbotButton.innerHTML = '<i class="fas fa-times"></i>';
        
        // Only add default messages if not skipping (i.e., not from scenario)
        if (!skipDefaultMessages) {
            const messages = chatMessages.querySelectorAll('.message');
            if (messages.length === 0) {
                addDefaultMessages();
            }
        }
    } else {
        chatWidgetContainer.style.display = 'none';
        chatOverlay.style.display = 'none';
        chatbotButton.classList.remove('active');
        chatbotButton.innerHTML = '<i class="fas fa-comments"></i><span class="chatbot-badge live"></span>';
    }
}

// Close chat widget (from X button in header)
function closeChat() {
    const chatWidgetContainer = document.getElementById('chatWidgetContainer');
    const chatbotButton = document.getElementById('chatbotButton');
    const chatOverlay = document.getElementById('chatOverlay');
    
    chatWidgetContainer.style.display = 'none';
    chatOverlay.style.display = 'none';
    chatbotButton.classList.remove('active');
    chatbotButton.innerHTML = '<i class="fas fa-comments"></i><span class="chatbot-badge">1</span>';
}

// Load saved settings from localStorage
function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem('webChatSimulatorSettings')) || {};
    
    document.getElementById('inputAgentName').value = settings.agentName || 'Sarah';
    document.getElementById('inputAgentBadge').value = settings.agentBadge || 'AI Agent';
    document.getElementById('inputAgentStatus').value = settings.agentStatus || 'Online';
    document.getElementById('inputAgentAvatar').value = settings.agentAvatar || '';
    document.getElementById('inputUserAvatar').value = settings.userAvatar || '';
    document.getElementById('poweredByText').value = settings.poweredByText || 'AutomateMyBiz';
    
    // Load page background preference
    const bgTheme = localStorage.getItem('webChatPageBackground') || 'gradient';
    document.getElementById('pageBackground').value = bgTheme;
    updatePageBackground();
    
    // Load chat theme
    if (settings.chatTheme) {
        document.getElementById('chatTheme').value = settings.chatTheme;
        updateChatTheme();
    }
    
    // Load website theme
    if (settings.websiteTheme) {
        document.getElementById('websiteTheme').value = settings.websiteTheme;
        updateWebsiteTheme();
    }
    
    updateAgentInfo();
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        agentName: document.getElementById('inputAgentName').value,
        agentBadge: document.getElementById('inputAgentBadge').value,
        agentStatus: document.getElementById('inputAgentStatus').value,
        agentAvatar: document.getElementById('inputAgentAvatar').value,
        userAvatar: document.getElementById('inputUserAvatar').value,
        poweredByText: document.getElementById('poweredByText').value
    };
    
    localStorage.setItem('webChatSimulatorSettings', JSON.stringify(settings));
}

// Setup event listeners
function setupEventListeners() {
    // Send button click
    sendButton.addEventListener('click', handleSendClick);
    
    // Enter key in chat input
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendClick();
        }
    });
    
    // Auto-save settings on input change
    ['inputAgentName', 'inputAgentStatus', 'inputAgentAvatar', 'poweredByText'].forEach(id => {
        document.getElementById(id).addEventListener('input', saveSettings);
    });
    
    // Toggle message type fields
    document.getElementById('messageType').addEventListener('change', function() {
        const messageText = document.getElementById('messageText');
        const notificationText = document.getElementById('notificationText');
        
        if (this.value === 'notification') {
            messageText.style.display = 'none';
            notificationText.style.display = 'block';
        } else {
            messageText.style.display = 'block';
            notificationText.style.display = 'none';
        }
    });
    
    // Toggle scenario action type fields
    document.getElementById('scenarioActionType').addEventListener('change', function() {
        const scenarioContent = document.getElementById('scenarioContent');
        const scenarioNotification = document.getElementById('scenarioNotification');
        
        if (this.value === 'notification') {
            scenarioContent.style.display = 'none';
            scenarioNotification.style.display = 'block';
        } else {
            scenarioContent.style.display = 'block';
            scenarioNotification.style.display = 'none';
        }
    });
}

// Handle send button click
function handleSendClick() {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatInput.value = '';
    }
}

// Add a message to the chat
function addMessage(text, type = 'user', showTime = true, playSound = true) {
    messageCounter++;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.setAttribute('data-id', messageCounter);
    
    // Create message avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (type === 'agent') {
        const avatarUrl = document.getElementById('inputAgentAvatar').value;
        if (avatarUrl) {
            avatarDiv.innerHTML = `<img src="${avatarUrl}" alt="Agent">`;
        } else {
            avatarDiv.classList.add('default');
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        }
    } else {
        // User message avatar
        const userAvatarUrl = document.getElementById('inputUserAvatar').value;
        if (userAvatarUrl) {
            avatarDiv.innerHTML = `<img src="${userAvatarUrl}" alt="User">`;
        } else {
            avatarDiv.classList.add('default');
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
            avatarDiv.style.background = '#666';
        }
    }
    
    // Create message content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    bubbleDiv.appendChild(textDiv);
    contentDiv.appendChild(bubbleDiv);
    
    // Add timestamp if requested
    if (showTime) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentTime();
        contentDiv.appendChild(timeDiv);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    // Insert before typing indicator
    chatMessages.insertBefore(messageDiv, typingIndicator);
    
    // Scroll to bottom
    scrollToBottom();
    
    // Play notification sound only if requested
    if (playSound) {
        playMessageSound();
    }
    
    return messageDiv;
}

// Send message from control panel
function sendMessage() {
    const messageType = document.getElementById('messageType').value;
    
    if (messageType === 'notification') {
        const notificationText = document.getElementById('notificationText').value.trim();
        if (notificationText) {
            addNotification(notificationText);
            document.getElementById('notificationText').value = '';
        }
    } else if (messageType === 'user') {
        // For user messages, simulate typing first
        const messageText = document.getElementById('messageText').value.trim();
        if (messageText) {
            simulateUserTyping(messageText, () => {
                addMessage(messageText, 'user');
                document.getElementById('messageText').value = '';
            });
        }
    } else {
        // Agent messages appear directly
        const messageText = document.getElementById('messageText').value.trim();
        if (messageText) {
            addMessage(messageText, messageType);
            document.getElementById('messageText').value = '';
        }
    }
}

// Simulate user typing in the input field
function simulateUserTyping(text, callback) {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatWidgetContainer = document.getElementById('chatWidgetContainer');
    
    // Ensure chat is open
    if (chatWidgetContainer.style.display === 'none') {
        toggleChat(true);
    }
    
    chatInput.value = '';
    chatInput.focus();
    
    let index = 0;
    const typingSpeed = 50; // milliseconds per character
    
    const typeChar = () => {
        if (index < text.length) {
            chatInput.value += text[index];
            index++;
            // Keep the input field scrolled to the end to show the latest typed character
            chatInput.scrollLeft = chatInput.scrollWidth;
            // Also ensure the caret position is at the end
            chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
            setTimeout(typeChar, typingSpeed);
        } else {
            // After typing is complete, simulate clicking send button
            setTimeout(() => {
                // Add clicking effect to send button
                sendButton.classList.add('clicking');
                
                // Play click sound
                const clickSound = new Audio('mouse-click.mp3');
                clickSound.volume = 0.3;
                clickSound.play().catch(err => console.log('Could not play click sound:', err));
                
                // Clear input and send message after animation
                setTimeout(() => {
                    sendButton.classList.remove('clicking');
                    chatInput.value = '';
                    callback();
                }, 300);
            }, 200);
        }
    };
    
    // Start typing after a short delay
    setTimeout(typeChar, 200);
}

// Add notification to chat
function addNotification(text) {
    messageCounter++;
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification-message';
    notificationDiv.setAttribute('data-id', messageCounter);
    
    // Add tick icon
    const tickDiv = document.createElement('div');
    tickDiv.className = 'notification-tick';
    tickDiv.innerHTML = '<i class="fas fa-check"></i>';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'notification-bubble';
    bubbleDiv.textContent = text;
    
    notificationDiv.appendChild(tickDiv);
    notificationDiv.appendChild(bubbleDiv);
    
    // Insert before typing indicator
    chatMessages.insertBefore(notificationDiv, typingIndicator);
    
    // Scroll to bottom
    scrollToBottom();
    
    // Play notification sound (use different sound for notifications)
    playNotificationSound();
    
    return notificationDiv;
}

// Update status color
function updateStatusColor() {
    const selectedColor = document.querySelector('input[name="statusColor"]:checked').value;
    const statusDot = document.getElementById('statusDot');
    
    // Remove all color classes
    statusDot.classList.remove('green', 'red', 'yellow');
    
    // Add selected color class
    statusDot.classList.add(selectedColor);
}

// Update agent information
function updateAgentInfo() {
    const name = document.getElementById('inputAgentName').value;
    const badge = document.getElementById('inputAgentBadge').value;
    const status = document.getElementById('inputAgentStatus').value;
    const avatarUrl = document.getElementById('inputAgentAvatar').value;
    
    agentName.textContent = name;
    document.getElementById('agentBadge').textContent = badge;
    document.getElementById('statusText').textContent = status;
    
    // Update status color
    updateStatusColor();
    
    if (avatarUrl) {
        agentAvatar.classList.remove('default');
        agentAvatar.innerHTML = `<img src="${avatarUrl}" alt="Agent Avatar">`;
    } else {
        agentAvatar.classList.add('default');
        agentAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    // Update all agent message avatars in chat
    const agentMessageAvatars = chatMessages.querySelectorAll('.agent-message .message-avatar');
    agentMessageAvatars.forEach(avatar => {
        if (avatarUrl) {
            avatar.classList.remove('default');
            avatar.innerHTML = `<img src="${avatarUrl}" alt="Agent">`;
        } else {
            avatar.classList.add('default');
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
    });
    
    // Update typing indicator avatar
    const typingAvatar = typingIndicator.querySelector('.message-avatar');
    if (avatarUrl) {
        typingAvatar.classList.remove('default');
        typingAvatar.innerHTML = `<img src="${avatarUrl}" alt="Agent">`;
    } else {
        typingAvatar.classList.add('default');
        typingAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    saveSettings();
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputAgentAvatar').value = e.target.result;
            updateAgentInfo();
        };
        reader.readAsDataURL(file);
    }
}

// Handle user avatar upload
function handleUserAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputUserAvatar').value = e.target.result;
            updateUserAvatar();
        };
        reader.readAsDataURL(file);
    }
}

// Update user avatar in messages
function updateUserAvatar() {
    const userAvatarUrl = document.getElementById('inputUserAvatar').value;
    
    // Update all existing user message avatars
    const userMessageAvatars = chatMessages.querySelectorAll('.user-message .message-avatar');
    userMessageAvatars.forEach(avatar => {
        if (userAvatarUrl) {
            avatar.classList.remove('default');
            avatar.innerHTML = `<img src="${userAvatarUrl}" alt="User">`;
            avatar.style.background = 'transparent';
        } else {
            avatar.classList.add('default');
            avatar.innerHTML = '<i class="fas fa-user"></i>';
            avatar.style.background = '#666';
        }
    });
    
    // Save to localStorage
    saveSettings();
}

// Update powered by text
function updatePoweredBy() {
    const poweredByText = document.getElementById('poweredByText').value;
    poweredByLink.textContent = poweredByText;
    saveSettings();
}

// Show typing indicator
function showTyping() {
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Hide typing indicator
function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Clear all messages
function clearChat() {
    // Refresh the page
    window.location.reload();
}

// Add default welcome messages
function addDefaultMessages() {
    const agentAvatar = document.getElementById('inputAgentAvatar').value;
    
    // First message (no sound)
    const message1 = addMessage('Have a question?', 'agent', false, false);
    
    // Second message with time (no sound)
    const message2 = addMessage('Enter your question below and a representative will get right back to you.', 'agent', true, false);
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en', { month: 'short' });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month}, ${hours}:${displayMinutes}`;
}

// Utility functions
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Scenario Builder Functions
function addScenarioStep() {
    const actionType = document.getElementById('scenarioActionType').value;
    let content = '';
    
    if (actionType === 'notification') {
        content = document.getElementById('scenarioNotification').value.trim();
        if (!content) return;
        document.getElementById('scenarioNotification').value = '';
    } else {
        content = document.getElementById('scenarioContent').value.trim();
        if (!content) return;
        document.getElementById('scenarioContent').value = '';
    }
    
    const step = {
        id: Date.now(),
        type: actionType,
        content: content
    };
    
    scenarioSteps.push(step);
    renderScenarioList();
}

function renderScenarioList() {
    const scenarioList = document.getElementById('scenarioList');
    scenarioList.innerHTML = '';
    
    scenarioSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'scenario-step';
        
        const typeLabel = step.type.charAt(0).toUpperCase() + step.type.slice(1);
        
        stepDiv.innerHTML = `
            <div class="step-content">
                <strong>${typeLabel}:</strong> <span id="step-text-${step.id}">${step.content}</span>
            </div>
            <div class="step-actions">
                <button class="step-btn" onclick="moveScenarioStep(${step.id}, -1)" ${index === 0 ? 'disabled' : ''} title="Move Up">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <button class="step-btn" onclick="moveScenarioStep(${step.id}, 1)" ${index === scenarioSteps.length - 1 ? 'disabled' : ''} title="Move Down">
                    <i class="fas fa-chevron-down"></i>
                </button>
                <button class="step-btn edit" onclick="editScenarioStep(${step.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="step-btn remove" onclick="deleteScenarioStep(${step.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        scenarioList.appendChild(stepDiv);
    });
}

function moveScenarioStep(stepId, direction) {
    const index = scenarioSteps.findIndex(step => step.id === stepId);
    if (index === -1) return;
    
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= scenarioSteps.length) return;
    
    // Swap steps
    [scenarioSteps[index], scenarioSteps[newIndex]] = [scenarioSteps[newIndex], scenarioSteps[index]];
    renderScenarioList();
}

function deleteScenarioStep(stepId) {
    scenarioSteps = scenarioSteps.filter(step => step.id !== stepId);
    renderScenarioList();
}

function editScenarioStep(stepId) {
    const step = scenarioSteps.find(s => s.id === stepId);
    if (!step) return;
    
    const newContent = prompt(`Edit ${step.type} message:`, step.content);
    if (newContent !== null && newContent.trim() !== '') {
        step.content = newContent.trim();
        renderScenarioList();
    }
}

function clearScenario() {
    scenarioSteps = [];
    renderScenarioList();
    stopScenario();
}

function playScenario() {
    if (isScenarioPlaying) return;
    
    // Check if chat widget is closed
    const chatWidgetContainer = document.getElementById('chatWidgetContainer');
    if (chatWidgetContainer.style.display === 'none') {
        // Show hand cursor animation first
        animateHandClick(() => {
            // After hand animation, start the scenario
            startScenarioPlayback();
        });
    } else {
        // Chat already open, start immediately
        startScenarioPlayback();
    }
}

function animateHandClick(callback) {
    const handCursor = document.getElementById('handCursor');
    const chatbotButton = document.getElementById('chatbotButton');
    const browserContent = document.querySelector('.browser-content');
    
    // Clear any existing messages before animation starts
    const messages = chatMessages.querySelectorAll('.message, .notification-message');
    messages.forEach(message => {
        message.remove();
    });
    messageCounter = 0;
    
    // Get button position relative to browser content
    const buttonRect = chatbotButton.getBoundingClientRect();
    const contentRect = browserContent.getBoundingClientRect();
    
    // Calculate position relative to browser content
    const buttonBottom = contentRect.bottom - buttonRect.bottom;
    const buttonRight = contentRect.right - buttonRect.right;
    
    // Position hand cursor starting from bottom right
    handCursor.style.display = 'block';
    handCursor.style.bottom = '-50px';
    handCursor.style.right = '-50px';
    
    // Animate hand moving to button center
    setTimeout(() => {
        // Position hand at button center (button is 50px wide/tall, positioned 20px from edges)
        handCursor.style.bottom = (buttonBottom - 10) + 'px';  // Shifted upward
        handCursor.style.right = (buttonRight + 5) + 'px';     // Shifted more right
    }, 100);
    
    // Click effect after hand reaches button
    setTimeout(() => {
        handCursor.classList.add('clicking');
        chatbotButton.classList.add('clicking');
        
        // Play click sound
        const clickSound = new Audio('mouse-click.mp3');
        clickSound.volume = 0.5;
        clickSound.play().catch(err => console.log('Could not play click sound:', err));
        
        // Hide hand and open chat
        setTimeout(() => {
            handCursor.style.display = 'none';
            handCursor.classList.remove('clicking');
            chatbotButton.classList.remove('clicking');
            toggleChat(true);  // Pass true to skip default messages
            
            // Wait for chat animation to complete
            setTimeout(callback, 500);
        }, 300);
    }, 1000);
}

function startScenarioPlayback() {
    // Clear all messages except typing indicator
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach(message => {
        message.remove();
    });
    messageCounter = 0;
    
    isScenarioPlaying = true;
    const speed = document.getElementById('playbackSpeed').value;
    const delays = {
        slow: 3000,
        medium: 2000,
        fast: 1000
    };
    
    let currentStep = 0;
    
    function executeStep() {
        if (currentStep >= scenarioSteps.length) {
            isScenarioPlaying = false;
            return;
        }
        
        const step = scenarioSteps[currentStep];
        let stepDuration = 0;
        
        switch (step.type) {
            case 'user':
                // Calculate duration for user typing (50ms per char + delays + send button animation)
                stepDuration = (step.content.length * 50) + 700; // typing time + send button click + send delay
                simulateUserTyping(step.content, () => {
                    addMessage(step.content, 'user');
                });
                break;
            case 'agent':
                // Show typing indicator briefly before agent message
                stepDuration = 600; // typing indicator duration
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    addMessage(step.content, 'agent');
                }, 600);
                break;
            case 'notification':
                stepDuration = 100; // minimal delay for notification
                addNotification(step.content);
                break;
            case 'delay':
                // Custom delay
                const customDelay = parseInt(step.content) || 1000;
                setTimeout(() => {
                    currentStep++;
                    executeStep();
                }, customDelay);
                return;
        }
        
        currentStep++;
        
        // Wait for current step to complete plus the speed delay before next step
        if (currentStep < scenarioSteps.length) {
            const totalDelay = stepDuration + delays[speed];
            scenarioTimeout = setTimeout(executeStep, totalDelay);
        } else {
            // Mark scenario as finished after last step completes
            setTimeout(() => {
                isScenarioPlaying = false;
            }, stepDuration);
        }
    }
    
    executeStep();
}

function stopScenario() {
    isScenarioPlaying = false;
    if (scenarioTimeout) {
        clearTimeout(scenarioTimeout);
        scenarioTimeout = null;
    }
    hideTyping();
}

// Auto-scroll to bottom when new messages are added
const observer = new MutationObserver(() => {
    scrollToBottom();
});

observer.observe(chatMessages, { childList: true });

// Business Management Functions
function loadBusinessData() {
    const saved = localStorage.getItem('webChatBusinessData');
    if (saved) {
        businessData = JSON.parse(saved);
    }
}

function saveBusinessData() {
    const selector = document.getElementById('businessSelector');
    const businessId = selector.value;
    
    if (!businessId || businessId === '') {
        alert('Please select a business slot first');
        return;
    }
    
    const business = {
        name: document.getElementById('businessName').value,
        logo: document.getElementById('businessLogo').value,
        url: document.getElementById('businessUrl').value,
        buttonText: document.getElementById('businessButtonText').value,
        description: document.getElementById('businessDescription').value,
        images: tempBusinessImages[businessId] || businessData[businessId]?.images || {}
    };
    
    businessData[businessId] = business;
    localStorage.setItem('webChatBusinessData', JSON.stringify(businessData));
    
    // Update the selector option text
    const option = selector.querySelector(`option[value="${businessId}"]`);
    if (option && business.name) {
        option.textContent = business.name;
    }
    
    alert('Business saved successfully!');
    
    // If this is the current business, update the display
    if (businessId === currentBusiness) {
        displayBusiness(businessId);
    }
}

function switchBusiness() {
    const selector = document.getElementById('businessSelector');
    const businessId = selector.value;
    currentBusiness = businessId;
    
    // Save selected business to localStorage
    localStorage.setItem('webChatSelectedBusiness', businessId);
    
    const skeletonWebsite = document.getElementById('skeletonWebsite');
    const businessWebsite = document.getElementById('businessWebsite');
    const businessEditor = document.getElementById('businessEditor');
    
    if (!businessId || businessId === '') {
        // Show skeleton
        skeletonWebsite.style.display = 'block';
        businessWebsite.style.display = 'none';
        businessEditor.style.display = 'none';
        updateBrowserUrl('www.example-business.com');
    } else {
        // Show business website
        businessEditor.style.display = 'block';
        loadBusinessToEditor(businessId);
        displayBusiness(businessId);
    }
}

function loadBusinessToEditor(businessId) {
    const business = businessData[businessId] || {};
    document.getElementById('businessName').value = business.name || '';
    document.getElementById('businessLogo').value = business.logo || '';
    document.getElementById('businessUrl').value = business.url || '';
    document.getElementById('businessButtonText').value = business.buttonText || 'Get Started';
    document.getElementById('businessDescription').value = business.description || '';
    
    // Reset temp images for this business
    tempBusinessImages[businessId] = business.images || {};
}

function displayBusiness(businessId) {
    const business = businessData[businessId];
    const skeletonWebsite = document.getElementById('skeletonWebsite');
    const businessWebsite = document.getElementById('businessWebsite');
    
    if (!business || !business.name) {
        skeletonWebsite.style.display = 'block';
        businessWebsite.style.display = 'none';
        updateBrowserUrl('www.example-business.com');
        return;
    }
    
    skeletonWebsite.style.display = 'none';
    businessWebsite.style.display = 'block';
    
    // Update browser URL
    updateBrowserUrl(business.url || 'www.example-business.com');
    
    // Update website content
    document.getElementById('heroTitle').textContent = business.name || 'Welcome to Our Business';
    document.getElementById('heroDescription').textContent = business.description || 'We provide excellent services to help your business grow.';
    document.getElementById('heroCTA').textContent = business.buttonText || 'Get Started';
    
    // Update logo text
    const logoText = document.querySelector('#websiteLogo .logo-text');
    if (logoText) {
        logoText.textContent = business.logo || business.name || 'YourLogo';
    }
    
    // Update background image
    const images = tempBusinessImages[businessId] || business.images || {};
    const heroBackground = document.getElementById('heroBackground');
    
    if (images.background) {
        heroBackground.style.backgroundImage = `url(${images.background})`;
    } else {
        // Default gradient if no image
        heroBackground.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

function handleBusinessImage(event, imageType) {
    const file = event.target.files[0];
    const selector = document.getElementById('businessSelector');
    const businessId = selector.value;
    
    if (!businessId || businessId === '') {
        alert('Please select a business slot first');
        event.target.value = '';
        return;
    }
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (!tempBusinessImages[businessId]) {
                tempBusinessImages[businessId] = {};
            }
            tempBusinessImages[businessId][imageType] = e.target.result;
            
            // If this is the current business, update display immediately
            if (businessId === currentBusiness) {
                displayBusiness(businessId);
            }
        };
        reader.readAsDataURL(file);
    }
}

function updateBrowserUrl(url) {
    const addressBar = document.querySelector('.browser-address-bar span');
    if (addressBar) {
        addressBar.textContent = url;
    }
}

function initializeBusinessSelector() {
    // Update selector options with saved business names
    const selector = document.getElementById('businessSelector');
    Object.keys(businessData).forEach(businessId => {
        const option = selector.querySelector(`option[value="${businessId}"]`);
        if (option && businessData[businessId].name) {
            option.textContent = businessData[businessId].name;
        }
    });
}

// Chat Theme Functions
function updatePageBackground() {
    const bgTheme = document.getElementById('pageBackground').value;
    
    if (bgTheme === 'white') {
        document.body.classList.add('white-background');
    } else {
        document.body.classList.remove('white-background');
    }
    
    // Save preference
    localStorage.setItem('webChatPageBackground', bgTheme);
}

function updateChatTheme() {
    const theme = document.getElementById('chatTheme').value;
    const chatWidget = document.querySelector('.chat-widget');
    const chatButton = document.getElementById('chatbotButton');
    
    // Remove all theme classes
    const themes = ['theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red', 'theme-teal', 'theme-pink'];
    themes.forEach(t => {
        chatWidget.classList.remove(t);
        chatButton.classList.remove(t);
    });
    
    // Add new theme class (blue is default, so no class needed)
    if (theme !== 'blue') {
        chatWidget.classList.add(`theme-${theme}`);
        chatButton.classList.add(`theme-${theme}`);
    }
    
    // Save theme preference
    const settings = JSON.parse(localStorage.getItem('webChatSimulatorSettings')) || {};
    settings.chatTheme = theme;
    localStorage.setItem('webChatSimulatorSettings', JSON.stringify(settings));
}

// Load saved theme on initialization
function loadSavedTheme() {
    const settings = JSON.parse(localStorage.getItem('webChatSimulatorSettings')) || {};
    if (settings.chatTheme) {
        document.getElementById('chatTheme').value = settings.chatTheme;
        updateChatTheme();
    }
}

// Restore previously selected business
function restoreSelectedBusiness() {
    const savedBusiness = localStorage.getItem('webChatSelectedBusiness');
    if (savedBusiness) {
        const selector = document.getElementById('businessSelector');
        selector.value = savedBusiness;
        switchBusiness();
    }
}

// Update website theme
function updateWebsiteTheme() {
    const theme = document.getElementById('websiteTheme').value;
    const businessWebsite = document.getElementById('businessWebsite');
    
    // Remove all website theme classes
    const themes = ['web-theme-blue', 'web-theme-green', 'web-theme-purple', 'web-theme-orange', 
                   'web-theme-red', 'web-theme-teal', 'web-theme-pink', 'web-theme-dark'];
    themes.forEach(t => {
        businessWebsite.classList.remove(t);
    });
    
    // Add new theme class (blue is default, so no class needed)
    if (theme !== 'blue') {
        businessWebsite.classList.add(`web-theme-${theme}`);
    }
    
    // Save theme preference
    const settings = JSON.parse(localStorage.getItem('webChatSimulatorSettings')) || {};
    settings.websiteTheme = theme;
    localStorage.setItem('webChatSimulatorSettings', JSON.stringify(settings));
}

// Restore previously selected scenario
function restoreSelectedScenario() {
    const savedScenario = localStorage.getItem('webChatSelectedScenario');
    if (savedScenario && savedScenarios[savedScenario]) {
        const dropdown = document.getElementById('savedScenarios');
        dropdown.value = savedScenario;
        loadSelectedScenario();
    }
}

// Scenario Management Functions
function loadSavedScenarios() {
    const saved = localStorage.getItem('webChatSavedScenarios');
    if (saved) {
        savedScenarios = JSON.parse(saved);
        updateScenarioDropdown();
    }
}

function updateScenarioDropdown() {
    const dropdown = document.getElementById('savedScenarios');
    dropdown.innerHTML = '<option value="">-- Select Scenario --</option>';
    
    Object.keys(savedScenarios).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
}

function saveScenario() {
    const name = document.getElementById('scenarioName').value.trim();
    
    if (!name) {
        alert('Please enter a scenario name');
        return;
    }
    
    if (scenarioSteps.length === 0) {
        alert('Please add at least one step to the scenario');
        return;
    }
    
    savedScenarios[name] = [...scenarioSteps];
    localStorage.setItem('webChatSavedScenarios', JSON.stringify(savedScenarios));
    
    document.getElementById('scenarioName').value = '';
    updateScenarioDropdown();
    
    // Select the newly saved scenario
    document.getElementById('savedScenarios').value = name;
    
    alert(`Scenario "${name}" saved successfully!`);
}

function loadSelectedScenario() {
    const dropdown = document.getElementById('savedScenarios');
    const selectedName = dropdown.value;
    
    // Save selected scenario to localStorage
    localStorage.setItem('webChatSelectedScenario', selectedName);
    
    if (!selectedName) {
        return;
    }
    
    const scenario = savedScenarios[selectedName];
    if (scenario) {
        scenarioSteps = [...scenario];
        renderScenarioList();
        document.getElementById('scenarioName').value = selectedName;
    }
}

function deleteSelectedScenario() {
    const dropdown = document.getElementById('savedScenarios');
    const selectedName = dropdown.value;
    
    if (!selectedName) {
        alert('Please select a scenario to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the scenario "${selectedName}"?`)) {
        delete savedScenarios[selectedName];
        localStorage.setItem('webChatSavedScenarios', JSON.stringify(savedScenarios));
        updateScenarioDropdown();
        
        // Clear the current scenario if it was the deleted one
        if (document.getElementById('scenarioName').value === selectedName) {
            clearScenario();
        }
    }
}

function duplicateSelectedScenario() {
    const dropdown = document.getElementById('savedScenarios');
    const selectedName = dropdown.value;
    
    if (!selectedName) {
        alert('Please select a scenario to duplicate');
        return;
    }
    
    const scenario = savedScenarios[selectedName];
    if (!scenario) {
        alert('Selected scenario not found');
        return;
    }
    
    // Generate a new name for the duplicate
    let newName = selectedName + ' - Copy';
    let counter = 1;
    
    // Check if the name already exists and increment counter
    while (savedScenarios[newName]) {
        counter++;
        newName = selectedName + ` - Copy ${counter}`;
    }
    
    // Create and save the duplicate automatically
    savedScenarios[newName] = [...scenario];
    localStorage.setItem('webChatSavedScenarios', JSON.stringify(savedScenarios));
    
    // Update the dropdown and select the new scenario
    updateScenarioDropdown();
    dropdown.value = newName;
    
    // Load the duplicated scenario
    scenarioSteps = [...scenario];
    renderScenarioList();
    document.getElementById('scenarioName').value = newName;
    
    // Show success message
    alert(`Scenario duplicated as "${newName}"`);
}