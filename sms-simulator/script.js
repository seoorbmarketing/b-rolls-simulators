// SMS Simulator JavaScript

// Global state
let messageCounter = 0;
let currentSMSType = 'imessage'; // imessage or sms
let scenarioSteps = [];
let scenarioTimeout = null;
let isScenarioPlaying = false;

// DOM Elements
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const contactName = document.getElementById('contactName');
const contactNumber = document.getElementById('contactNumber');
const contactAvatar = document.getElementById('contactAvatar');
const messageCountBadge = document.getElementById('messageCountBadge');

// Audio notification
const messageAudio = new Audio('message-notification.mp3');

// Play message notification sound
function playMessageSound() {
    messageAudio.currentTime = 0; // Reset audio to beginning
    messageAudio.play().catch(e => {
        // Handle autoplay restrictions silently
        console.log('Audio play failed:', e);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedSettings();
    setupEventListeners();
    
    // Ensure default avatar is shown if no avatar URL is set
    if (!document.getElementById('inputAvatarUrl').value) {
        contactAvatar.classList.add('default');
        contactAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    // Add some default messages to showcase the UI
    addTimestampToChat();
    addMessage('Hey! How are you?', 'sent', true, false);
    addMessage('I\'m good! What about you?', 'received', true, false);
    addMessage('Great! Want to hang out tonight?', 'sent', true, false);
    
    // Initialize saved scenarios
    loadSavedScenarios();
});

// Load saved settings from localStorage
function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem('smsSimulatorSettings')) || {};
    
    document.getElementById('inputContactName').value = settings.contactName || 'Swati';
    document.getElementById('inputContactNumber').value = settings.contactNumber || '1806';
    document.getElementById('inputMessageCount').value = settings.messageCount || '3';
    document.getElementById('inputAvatarUrl').value = settings.avatarUrl || '';
    
    updateContactInfo();
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        contactName: document.getElementById('inputContactName').value,
        contactNumber: document.getElementById('inputContactNumber').value,
        messageCount: document.getElementById('inputMessageCount').value,
        avatarUrl: document.getElementById('inputAvatarUrl').value
    };
    
    localStorage.setItem('smsSimulatorSettings', JSON.stringify(settings));
}

// Setup event listeners
function setupEventListeners() {
    // Send button click
    sendBtn.addEventListener('click', handleSendClick);
    
    // Enter key in message input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendClick();
        }
    });
    
    // Auto-save settings on input change
    ['inputContactName', 'inputContactNumber', 'inputMessageCount', 'inputAvatarUrl'].forEach(id => {
        document.getElementById(id).addEventListener('input', saveSettings);
    });
}

// Handle send button click
function handleSendClick() {
    const text = messageInput.value.trim();
    if (text) {
        addMessage(text, 'sent');
        messageInput.value = '';
    }
}

// Process message text for link formatting
function processMessageText(text) {
    // Escape HTML first
    let processedText = text.replace(/&/g, '&amp;')
                           .replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;')
                           .replace(/"/g, '&quot;')
                           .replace(/'/g, '&#39;');

    // Then process <link> tags
    processedText = processedText.replace(/&lt;link&gt;(.*?)&lt;\/link&gt;/g, '<a href="#" class="message-link">$1</a>');

    return processedText;
}

// Add a message to the chat
function addMessage(text, type = 'sent', showStatus = true, addTimestamp = true) {
    // Add timestamp before message if it's been a while or first message
    const lastMessage = messagesArea.lastElementChild;
    const shouldAddTimestamp = addTimestamp && (!lastMessage || 
        !lastMessage.classList.contains('message-time') && 
        messageCounter % 3 === 1); // Add timestamp every few messages
    
    if (shouldAddTimestamp) {
        addTimestampToChat();
    }
    
    messageCounter++;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    if (currentSMSType === 'sms' && type === 'received') {
        messageDiv.classList.add('sms');
    }
    messageDiv.setAttribute('data-id', messageCounter);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    // Process text for link formatting
    const processedText = processMessageText(text);
    bubbleDiv.innerHTML = processedText;
    
    messageDiv.appendChild(bubbleDiv);
    
    // Add status for sent messages in iMessage mode
    if (type === 'sent' && currentSMSType === 'imessage' && showStatus) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'message-status';
        
        // Show read status if enabled
        if (document.getElementById('showRead').checked) {
            setTimeout(() => {
                statusDiv.textContent = 'Read';
            }, 1000);
            
            messageDiv.appendChild(statusDiv);
        }
    }
    
    messagesArea.appendChild(messageDiv);
    scrollToBottom();
    
    // Play notification sound
    playMessageSound();
    
    return messageDiv;
}

// Send message from control panel
function sendMessage() {
    const text = document.getElementById('messageText').value.trim();
    const type = document.getElementById('messageType').value;
    
    if (text) {
        addMessage(text, type);
        document.getElementById('messageText').value = '';
    }
}

// Update contact information
function updateContactInfo() {
    const name = document.getElementById('inputContactName').value;
    const number = document.getElementById('inputContactNumber').value;
    const messageCount = document.getElementById('inputMessageCount').value;
    const avatarUrl = document.getElementById('inputAvatarUrl').value;
    
    contactName.textContent = name;
    messageCountBadge.textContent = messageCount || '0';
    
    if (avatarUrl) {
        contactAvatar.classList.remove('default');
        contactAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar">`;
    } else {
        contactAvatar.classList.add('default');
        contactAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    saveSettings();
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputAvatarUrl').value = e.target.result;
            updateContactInfo();
        };
        reader.readAsDataURL(file);
    }
}

// Clear all messages
function clearMessages() {
    messagesArea.innerHTML = '';
    messageCounter = 0;
}

// Scenario Builder Functions
function addScenarioStep() {
    const actionType = document.getElementById('scenarioActionType').value;
    const content = document.getElementById('scenarioContent').value.trim();
    
    if (!content) return;
    
    const step = {
        id: Date.now(),
        type: actionType,
        content: content
    };
    
    scenarioSteps.push(step);
    renderScenarioList();
    document.getElementById('scenarioContent').value = '';
}

function renderScenarioList() {
    const scenarioList = document.getElementById('scenarioList');
    scenarioList.innerHTML = '';
    
    scenarioSteps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'scenario-step';
        stepDiv.innerHTML = `
            <div class="step-content">
                <strong>${step.type}:</strong> ${step.content}
            </div>
            <button class="step-remove" onclick="removeScenarioStep(${step.id})">×</button>
        `;
        scenarioList.appendChild(stepDiv);
    });
}

function removeScenarioStep(stepId) {
    scenarioSteps = scenarioSteps.filter(step => step.id !== stepId);
    renderScenarioList();
}

function clearScenario() {
    scenarioSteps = [];
    renderScenarioList();
    stopScenario();
}

function playScenario() {
    if (isScenarioPlaying) return;
    
    isScenarioPlaying = true;
    const speed = document.getElementById('playbackSpeed').value;
    const delays = {
        slow: 2000,
        medium: 1000,
        fast: 500
    };
    
    let currentStep = 0;
    
    function executeStep() {
        if (currentStep >= scenarioSteps.length) {
            isScenarioPlaying = false;
            return;
        }
        
        const step = scenarioSteps[currentStep];
        
        switch (step.type) {
            case 'sent':
                addMessage(step.content, 'sent');
                break;
            case 'received':
                // Add received message directly without typing indicator
                addMessage(step.content, 'received');
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
        
        if (currentStep < scenarioSteps.length) {
            scenarioTimeout = setTimeout(executeStep, delays[speed]);
        } else {
            isScenarioPlaying = false;
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
    // Remove any lingering typing indicator when stopping
    hideTypingIndicator();
}

// Typing indicator functions
function showTypingIndicator() {
    // Remove existing typing indicator
    hideTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesArea.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Utility functions
function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Add timestamp to chat
function addTimestampToChat() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = now.toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'});
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = `${dateString} ${timeString}`;
    
    messagesArea.appendChild(timeDiv);
}

// Auto-scroll to bottom when new messages are added
const observer = new MutationObserver(() => {
    scrollToBottom();
});

observer.observe(messagesArea, { childList: true });

// Scenario Save/Load Functions
function saveCustomScenario() {
    const scenarioNameInput = document.getElementById('scenarioName');
    const name = scenarioNameInput.value.trim();
    
    if (!name) {
        alert('Please enter a scenario name');
        return;
    }
    
    if (scenarioSteps.length === 0) {
        alert('No steps to save! Add some steps first.');
        return;
    }
    
    // Get existing scenarios from localStorage
    const savedScenarios = JSON.parse(localStorage.getItem('smsSimulatorScenarios')) || {};
    
    // Save the current scenario
    savedScenarios[name] = {
        name: name,
        steps: scenarioSteps,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('smsSimulatorScenarios', JSON.stringify(savedScenarios));
    
    // Clear the name input
    scenarioNameInput.value = '';
    
    // Refresh the saved scenarios list
    loadSavedScenarios();
    
    alert(`Scenario "${name}" saved successfully!`);
}

function loadSavedScenarios() {
    const savedScenarios = JSON.parse(localStorage.getItem('smsSimulatorScenarios')) || {};
    const savedScenariosList = document.getElementById('savedScenariosList');
    
    // Clear existing list
    savedScenariosList.innerHTML = '';
    
    // Check if there are any saved scenarios
    if (Object.keys(savedScenarios).length === 0) {
        savedScenariosList.innerHTML = '<p style="color: #999; font-size: 12px;">No saved scenarios yet</p>';
        return;
    }
    
    // Display each saved scenario
    Object.keys(savedScenarios).forEach(key => {
        const scenario = savedScenarios[key];
        const scenarioDiv = document.createElement('div');
        scenarioDiv.className = 'saved-scenario-item';
        scenarioDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f5f5f5; border-radius: 5px; margin-bottom: 5px;';
        
        scenarioDiv.innerHTML = `
            <span style="flex: 1; font-size: 14px;">${scenario.name}</span>
            <button onclick="loadScenario('${key}')" style="padding: 4px 8px; font-size: 12px; margin-right: 5px;">Load</button>
            <button onclick="deleteScenario('${key}')" style="padding: 4px 8px; font-size: 12px; background: #ff4444; color: white; border: none; border-radius: 3px;">Delete</button>
        `;
        
        savedScenariosList.appendChild(scenarioDiv);
    });
}

function loadScenario(name) {
    const savedScenarios = JSON.parse(localStorage.getItem('smsSimulatorScenarios')) || {};
    
    if (!savedScenarios[name]) {
        alert('Scenario not found!');
        return;
    }
    
    // Load the scenario steps
    scenarioSteps = savedScenarios[name].steps;
    
    // Render the scenario list
    renderScenarioList();
    
    alert(`Loaded scenario: ${name}`);
}

function deleteScenario(name) {
    if (!confirm(`Are you sure you want to delete the scenario "${name}"?`)) {
        return;
    }
    
    const savedScenarios = JSON.parse(localStorage.getItem('smsSimulatorScenarios')) || {};
    delete savedScenarios[name];
    localStorage.setItem('smsSimulatorScenarios', JSON.stringify(savedScenarios));
    
    loadSavedScenarios();
}


