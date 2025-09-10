// Message Management
let messages = [];
let messageIdCounter = 0;

// Scenario Management
let scenarioSteps = [];
let currentScenario = null;
let isPlaying = false;
let playbackTimeout = null;

// Preset Messages
let presetMessages = [
    'Hey! How are you?',
    'Sure, sounds good!',
    'Can we talk later?',
    '😂😂😂'
];

// DOM Elements
const messagesArea = document.getElementById('messagesArea');
const typingIndicator = document.getElementById('typingIndicator');
const messageInput = document.getElementById('messageInput');

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
    // Load saved user data from localStorage
    loadUserData();
    
    // Load preset messages
    loadPresetMessages();
    
    // Load saved scenarios
    loadSavedScenarios();
    
    
    // Ensure Instagram screen is active initially
    const instagramScreen = document.getElementById('instagramScreen');
    if (instagramScreen) {
        instagramScreen.classList.add('active');
    }
    
    // Add initial welcome message
    addMessage('Hey! Welcome to Instagram chat simulator 👋', 'incoming');
    
    // Handle enter key in message input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && messageInput.value.trim()) {
            addMessage(messageInput.value, 'outgoing');
            messageInput.value = '';
        }
    });
});

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageText = document.createElement('div');
    messageText.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(messageTime);
    
    // Insert before typing indicator
    messagesArea.insertBefore(messageDiv, typingIndicator);
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Play notification sound
    playMessageSound();
    
    // Store message
    messages.push({
        id: messageIdCounter++,
        text: text,
        type: type,
        time: new Date()
    });
}

// Send message from control panel
function sendMessage() {
    const messageType = document.getElementById('messageType').value;
    const messageText = document.getElementById('messageText').value.trim();
    
    if (messageText) {
        addMessage(messageText, messageType);
        document.getElementById('messageText').value = '';
    }
}

// Send preset message
function sendPreset(text) {
    const messageType = document.getElementById('messageType').value;
    addMessage(text, messageType);
}

// Update user info
function updateUserInfo() {
    const userName = document.getElementById('userName').value;
    const userStatus = document.getElementById('userStatus').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    
    // Update header
    document.querySelector('.user-name').textContent = userName;
    document.querySelector('.user-status').textContent = userStatus;
    document.querySelector('.user-avatar').src = avatarUrl;
    
    // Save to localStorage
    saveUserData(userName, userStatus, avatarUrl);
}

// Handle avatar file upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarUrl = e.target.result;
            document.getElementById('avatarUrl').value = avatarUrl;
            document.querySelector('.user-avatar').src = avatarUrl;
            
            
            // Save to localStorage
            const userName = document.getElementById('userName').value;
            const userStatus = document.getElementById('userStatus').value;
            saveUserData(userName, userStatus, avatarUrl);
        };
        reader.readAsDataURL(file);
    }
}

// Save user data to localStorage
function saveUserData(userName, userStatus, avatarUrl) {
    const userData = {
        userName: userName,
        userStatus: userStatus,
        avatarUrl: avatarUrl
    };
    localStorage.setItem('instagramChatUser', JSON.stringify(userData));
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('instagramChatUser');
    if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Update input fields
        document.getElementById('userName').value = userData.userName || 'john_doe';
        document.getElementById('userStatus').value = userData.userStatus || 'Active now';
        document.getElementById('avatarUrl').value = userData.avatarUrl || 'https://via.placeholder.com/40';
        
        // Update display
        document.querySelector('.user-name').textContent = userData.userName || 'john_doe';
        document.querySelector('.user-status').textContent = userData.userStatus || 'Active now';
        document.querySelector('.user-avatar').src = userData.avatarUrl || 'https://via.placeholder.com/40';
    }
}

// Show typing indicator
function showTyping() {
    typingIndicator.style.display = 'block';
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Clear chat
function clearChat() {
    const messageDivs = messagesArea.querySelectorAll('.message');
    messageDivs.forEach(div => div.remove());
    messages = [];
    messageIdCounter = 0;
}


// Get current time
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
}

// Simulate incoming message with delay
function simulateIncomingMessage(text, delay = 500) {
    showTyping();
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        addMessage(text, 'incoming');
    }, delay);
}

// Export/Import chat functionality
function exportChat() {
    const chatData = {
        messages: messages,
        userInfo: {
            name: document.getElementById('userName').value,
            status: document.getElementById('userStatus').value,
            avatar: document.getElementById('avatarUrl').value
        }
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instagram-chat-export.json';
    link.click();
}

function importChat(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const chatData = JSON.parse(e.target.result);
            
            // Clear existing chat
            clearChat();
            
            // Load user info
            if (chatData.userInfo) {
                document.getElementById('userName').value = chatData.userInfo.name;
                document.getElementById('userStatus').value = chatData.userInfo.status;
                document.getElementById('avatarUrl').value = chatData.userInfo.avatar;
                updateUserInfo();
            }
            
            // Load messages
            if (chatData.messages) {
                chatData.messages.forEach(msg => {
                    addMessage(msg.text, msg.type);
                });
            }
        } catch (error) {
            alert('Error loading chat file');
        }
    };
    reader.readAsText(file);
}

// Scenario Builder Functions
function addScenarioStep() {
    const actionType = document.getElementById('actionType').value;
    const actionContent = document.getElementById('actionContent').value.trim();
    
    if ((actionType === 'incoming' || actionType === 'outgoing') && !actionContent) {
        alert('Please enter message text');
        return;
    }
    
    if (actionType === 'delay' && (!actionContent || isNaN(actionContent))) {
        alert('Please enter a valid delay in milliseconds');
        return;
    }
    
    const step = {
        id: Date.now(),
        type: actionType,
        content: actionContent || '',
        delay: actionType === 'delay' ? parseInt(actionContent) : 1000
    };
    
    scenarioSteps.push(step);
    renderScenarioList();
    
    // Clear input
    document.getElementById('actionContent').value = '';
}

function renderScenarioList() {
    const listElement = document.getElementById('scenarioList');
    
    if (scenarioSteps.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #8E8E8E; padding: 20px;">No steps added yet</div>';
        return;
    }
    
    listElement.innerHTML = scenarioSteps.map((step, index) => {
        let displayText = '';
        switch(step.type) {
            case 'incoming':
                displayText = `📥 IN: ${step.content}`;
                break;
            case 'outgoing':
                displayText = `📤 OUT: ${step.content}`;
                break;
            case 'typing':
                displayText = '⌨️ Show Typing';
                break;
            case 'delay':
                displayText = `⏱️ Wait ${step.content}ms`;
                break;
        }
        
        return `
            <div class="scenario-step">
                <div class="step-info">
                    <span class="step-number">${index + 1}.</span>
                    <span class="step-content">${displayText}</span>
                </div>
                <div class="step-actions">
                    <button onclick="moveStep(${index}, -1)">↑</button>
                    <button onclick="moveStep(${index}, 1)">↓</button>
                    <button onclick="removeStep(${index})">×</button>
                </div>
            </div>
        `;
    }).join('');
}

function removeStep(index) {
    scenarioSteps.splice(index, 1);
    renderScenarioList();
}

function moveStep(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < scenarioSteps.length) {
        const temp = scenarioSteps[index];
        scenarioSteps[index] = scenarioSteps[newIndex];
        scenarioSteps[newIndex] = temp;
        renderScenarioList();
    }
}

function clearScenario() {
    if (isPlaying) {
        stopScenario();
    }
    scenarioSteps = [];
    renderScenarioList();
}

// Get speed multiplier based on selected speed
function getSpeedMultiplier() {
    const speed = document.getElementById('playbackSpeed').value;
    switch(speed) {
        case 'slow':
            return 1.5; // 50% slower
        case 'fast':
            return 0.5; // 50% faster
        case 'medium':
        default:
            return 1; // Normal speed
    }
}

// Playback Functions
async function playScenario() {
    if (scenarioSteps.length === 0) {
        alert('Please add steps to the scenario first');
        return;
    }
    
    if (isPlaying) {
        alert('Scenario is already playing');
        return;
    }
    
    isPlaying = true;
    clearChat();
    
    // Ensure typing indicator is hidden at start
    typingIndicator.style.display = 'none';
    
    const playBtn = document.querySelector('.play-btn');
    playBtn.innerHTML = '⏸️ Playing...';
    playBtn.disabled = true;
    
    const speedMultiplier = getSpeedMultiplier();
    
    for (let i = 0; i < scenarioSteps.length; i++) {
        if (!isPlaying) break;
        
        const step = scenarioSteps[i];
        
        switch(step.type) {
            case 'incoming':
                // Ensure typing indicator is hidden first, then show it
                typingIndicator.style.display = 'none';
                await wait(50); // Brief pause to ensure clean state
                showTyping();
                await wait(500 * speedMultiplier);
                typingIndicator.style.display = 'none';
                addMessage(step.content, 'incoming');
                break;
                
            case 'outgoing':
                addMessage(step.content, 'outgoing');
                break;
                
            case 'delay':
                await wait((step.delay || parseInt(step.content)) * speedMultiplier);
                break;
        }
        
        // Default delay between steps
        if (step.type !== 'delay' && i < scenarioSteps.length - 1) {
            await wait((step.delay || 300) * speedMultiplier);
        }
    }
    
    isPlaying = false;
    playBtn.innerHTML = '▶️ Play Scenario';
    playBtn.disabled = false;
}

function stopScenario() {
    isPlaying = false;
    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }
    typingIndicator.style.display = 'none';
    
    const playBtn = document.querySelector('.play-btn');
    playBtn.innerHTML = '▶️ Play Scenario';
    playBtn.disabled = false;
}

function wait(ms) {
    return new Promise(resolve => {
        playbackTimeout = setTimeout(resolve, ms);
    });
}

// Preset Scenarios
function loadPresetScenario(type) {
    scenarioSteps = [];
    
    switch(type) {
        case 'greeting':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'Hey! 👋', delay: 1000 },
                { id: 2, type: 'delay', content: '2000', delay: 2000 },
                { id: 3, type: 'outgoing', content: 'Hi there!', delay: 1000 },
                { id: 4, type: 'incoming', content: 'How are you doing?', delay: 1500 },
                { id: 5, type: 'outgoing', content: "I'm good, thanks! How about you?", delay: 1000 }
            ];
            break;
            
        case 'missed':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'Are you there?', delay: 1000 },
                { id: 2, type: 'delay', content: '3000', delay: 3000 },
                { id: 3, type: 'incoming', content: 'Hello??', delay: 1000 },
                { id: 4, type: 'delay', content: '2000', delay: 2000 },
                { id: 5, type: 'incoming', content: 'I guess you\'re busy...', delay: 1000 },
                { id: 6, type: 'delay', content: '4000', delay: 4000 },
                { id: 7, type: 'outgoing', content: 'Sorry! Just saw your messages', delay: 1000 },
                { id: 8, type: 'incoming', content: 'No worries! 😊', delay: 1000 }
            ];
            break;
            
        case 'conversation':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'Did you see the news today?', delay: 1000 },
                { id: 2, type: 'outgoing', content: 'No, what happened?', delay: 1500 },
                { id: 3, type: 'incoming', content: 'They announced the new iPhone!', delay: 1000 },
                { id: 4, type: 'incoming', content: 'It looks amazing 🔥', delay: 1200 },
                { id: 5, type: 'outgoing', content: 'Wow, really?', delay: 1000 },
                { id: 6, type: 'outgoing', content: 'What are the new features?', delay: 800 },
                { id: 7, type: 'incoming', content: 'Better camera, new design, and AI features!', delay: 1000 },
                { id: 8, type: 'outgoing', content: 'Sounds expensive 😅', delay: 1500 },
                { id: 9, type: 'incoming', content: 'Haha yeah, probably!', delay: 1000 }
            ];
            break;
    }
    
    renderScenarioList();
    alert(`Loaded "${type}" scenario. Click Play to start!`);
}

// Preset Messages Management
function loadPresetMessages() {
    const saved = localStorage.getItem('instagramPresetMessages');
    if (saved) {
        presetMessages = JSON.parse(saved);
    }
    renderPresetMessages();
}

function savePresetMessages() {
    localStorage.setItem('instagramPresetMessages', JSON.stringify(presetMessages));
}

function renderPresetMessages() {
    const container = document.getElementById('presetMessagesList');
    if (!container) return;
    
    container.innerHTML = presetMessages.map((msg, index) => `
        <div class="preset-message-item" id="preset-${index}">
            <span class="preset-text">${msg}</span>
            <input type="text" class="preset-edit-input" style="display:none" value="${msg}">
            <div class="preset-actions">
                <button class="send-btn" onclick="sendPreset('${msg.replace(/'/g, "\\'")}')">Send</button>
                <button onclick="editPresetMessage(${index})">Edit</button>
                <button class="delete-btn" onclick="deletePresetMessage(${index})">×</button>
            </div>
        </div>
    `).join('');
}

function addPresetMessage() {
    const input = document.getElementById('newPresetText');
    const text = input.value.trim();
    
    if (text) {
        presetMessages.push(text);
        savePresetMessages();
        renderPresetMessages();
        input.value = '';
    }
}

function editPresetMessage(index) {
    const item = document.getElementById(`preset-${index}`);
    const textSpan = item.querySelector('.preset-text');
    const editInput = item.querySelector('.preset-edit-input');
    const buttons = item.querySelector('.preset-actions').children;
    
    if (editInput.style.display === 'none') {
        // Enter edit mode
        textSpan.style.display = 'none';
        editInput.style.display = 'block';
        editInput.focus();
        buttons[1].textContent = 'Save';
        item.classList.add('editing');
        
        editInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                saveEditedPreset(index);
            }
        };
    } else {
        // Save changes
        saveEditedPreset(index);
    }
}

function saveEditedPreset(index) {
    const item = document.getElementById(`preset-${index}`);
    const editInput = item.querySelector('.preset-edit-input');
    const newText = editInput.value.trim();
    
    if (newText) {
        presetMessages[index] = newText;
        savePresetMessages();
        renderPresetMessages();
    }
}

function deletePresetMessage(index) {
    presetMessages.splice(index, 1);
    savePresetMessages();
    renderPresetMessages();
}

// Custom Scenarios Management
function saveCustomScenario() {
    const nameInput = document.getElementById('scenarioName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter a scenario name');
        return;
    }
    
    if (scenarioSteps.length === 0) {
        alert('Please add steps to the scenario first');
        return;
    }
    
    let savedScenarios = JSON.parse(localStorage.getItem('instagramScenarios') || '{}');
    savedScenarios[name] = {
        name: name,
        steps: scenarioSteps,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('instagramScenarios', JSON.stringify(savedScenarios));
    nameInput.value = '';
    loadSavedScenarios();
    alert(`Scenario "${name}" saved successfully!`);
}

function loadSavedScenarios() {
    const savedScenarios = JSON.parse(localStorage.getItem('instagramScenarios') || '{}');
    const container = document.getElementById('savedScenariosList');
    
    if (!container) return;
    
    const scenarios = Object.values(savedScenarios);
    if (scenarios.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #8E8E8E; padding: 10px; font-size: 12px;">No saved scenarios yet</div>';
        return;
    }
    
    container.innerHTML = scenarios.map(scenario => `
        <div class="saved-scenario-item">
            <span>${scenario.name}</span>
            <div>
                <button onclick="loadCustomScenario('${scenario.name}')">Load</button>
                <button onclick="deleteCustomScenario('${scenario.name}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadCustomScenario(name) {
    const savedScenarios = JSON.parse(localStorage.getItem('instagramScenarios') || '{}');
    const scenario = savedScenarios[name];
    
    if (scenario) {
        scenarioSteps = scenario.steps;
        renderScenarioList();
        alert(`Loaded scenario "${name}"`);
    }
}

function deleteCustomScenario(name) {
    if (confirm(`Delete scenario "${name}"?`)) {
        const savedScenarios = JSON.parse(localStorage.getItem('instagramScenarios') || '{}');
        delete savedScenarios[name];
        localStorage.setItem('instagramScenarios', JSON.stringify(savedScenarios));
        loadSavedScenarios();
    }
}



