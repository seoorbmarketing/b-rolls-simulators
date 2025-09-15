// Conversation Simulator JavaScript
let currentConversation = null;
let messageIdCounter = 1;
let conversations = {};

// Initialize the conversation simulator
document.addEventListener('DOMContentLoaded', function() {
    initializeConversations();
    setupEventListeners();
    selectFirstConversation();
});

// Initialize sample conversations
function initializeConversations() {
    // Sample conversation data
    const sampleConversations = [
        {
            id: 'conv-1',
            name: 'Robert Paulus',
            initials: 'RP',
            lastMessage: 'Hi Robert, Piyush here from Mass',
            time: 'Aug 20',
            unread: 1,
            messages: []
        },
        {
            id: 'conv-2',
            name: 'Julien Fonteyne',
            initials: 'JF',
            lastMessage: 'Hi Julien, Piyush here from Massi',
            time: 'Aug 20',
            unread: 6,
            messages: []
        },
        {
            id: 'conv-3',
            name: 'Jamie Smith',
            initials: 'JS',
            lastMessage: 'Hi Jamie, Piyush here from Mass',
            time: 'Aug 20',
            unread: 1,
            messages: [
                {
                    id: 'msg-1',
                    type: 'outgoing',
                    sender: 'AutomateMyBiz.pro',
                    text: "Recon'25 starts tomorrow, are you coming?",
                    subtext: '- Hey Jamie,...',
                    date: '18th Aug, 2025',
                    time: 'Aug 18, 2025, 7:00 PM'
                },
                {
                    id: 'msg-2',
                    type: 'outgoing',
                    sender: 'AutomateMyBiz.pro',
                    text: "A common pain I found amongst people at RECON'25",
                    subtext: '- H...',
                    date: '20th Aug, 2025',
                    time: 'Aug 20, 2025, 7:13 PM'
                }
            ]
        },
        {
            id: 'conv-4',
            name: 'Phil Harris',
            initials: 'PH',
            lastMessage: 'Hi Phil, Piyush here from Massive',
            time: 'Aug 20',
            unread: 3,
            messages: []
        },
        {
            id: 'conv-5',
            name: 'Lex Hubert',
            initials: 'LH',
            lastMessage: 'Hey Lex, Quick heads up - RECON',
            time: 'Aug 16',
            unread: 7,
            messages: []
        }
    ];

    // Store conversations
    sampleConversations.forEach(conv => {
        conversations[conv.id] = conv;
    });
}

// Setup event listeners
function setupEventListeners() {
    // List tabs
    document.querySelectorAll('.list-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.list-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Message tabs
    document.querySelectorAll('.message-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.textContent !== '-') {
                document.querySelectorAll('.message-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Conversation items click
    document.querySelectorAll('.conversation-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            selectConversation(index);
        });
    });

    // Send button
    document.querySelector('.send-btn').addEventListener('click', sendMessage);

    // Clear button
    document.querySelector('.clear-btn').addEventListener('click', clearMessageInput);

    // Message input character count
    const messageInput = document.querySelector('.message-input');
    messageInput.addEventListener('input', updateCharCount);

    // Control panel buttons
    setupControlPanelButtons();
}

// Select a conversation
function selectConversation(index) {
    // Update active states
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.conversation-item .avatar').forEach(avatar => {
        avatar.classList.remove('selected');
    });

    const selectedItem = document.querySelectorAll('.conversation-item')[index];
    if (selectedItem) {
        selectedItem.classList.add('active');
        selectedItem.querySelector('.avatar').classList.add('selected');

        // Update current conversation
        const convId = Object.keys(conversations)[index];
        currentConversation = conversations[convId];

        // Update chat header
        updateChatHeader();

        // Load messages
        loadMessages();

        // Update contact details
        updateContactDetails();

        // Mark as read
        if (currentConversation && currentConversation.unread > 0) {
            currentConversation.unread = 0;
            updateUnreadCount(selectedItem);
        }
    }
}

// Select first conversation on load
function selectFirstConversation() {
    selectConversation(2); // Select Jamie Smith by default
}

// Update chat header
function updateChatHeader() {
    if (!currentConversation) return;

    const contactInfo = document.querySelector('.chat-contact-info');
    contactInfo.querySelector('h2').textContent = currentConversation.name;
    // Use current date and time instead of hardcoded value
    const now = new Date();
    contactInfo.querySelector('.last-message-time').textContent = formatTime(now);
}

// Load messages for current conversation
function loadMessages() {
    if (!currentConversation) return;

    const messagesArea = document.querySelector('.messages-area');
    messagesArea.innerHTML = '';

    if (currentConversation.messages.length === 0) {
        messagesArea.innerHTML = '<div style="text-align: center; color: #999; padding: 50px;">No messages yet</div>';
        return;
    }

    let currentDate = null;
    currentConversation.messages.forEach(msg => {
        // Add date divider if needed
        if (msg.date !== currentDate) {
            currentDate = msg.date;
            const dateDivider = document.createElement('div');
            dateDivider.className = 'date-divider';
            dateDivider.innerHTML = `<span>${currentDate}</span>`;
            messagesArea.appendChild(dateDivider);
        }

        // Add message
        const messageGroup = createMessageElement(msg);
        messagesArea.appendChild(messageGroup);
    });

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Create message element
function createMessageElement(message) {
    const messageGroup = document.createElement('div');
    messageGroup.className = `message-group ${message.type}`;

    if (message.type === 'outgoing') {
        messageGroup.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <span class="label">${message.sender}</span>
                    <span class="message-text">${message.text}</span>
                    ${message.subtext ? `<span class="subtext">${message.subtext}</span>` : ''}
                </div>
                <div class="message-time">${message.time}</div>
            </div>
            <div class="avatar-small">AM</div>
        `;
    } else {
        messageGroup.innerHTML = `
            <div class="avatar-small">${currentConversation.initials}</div>
            <div class="message-bubble">
                <div class="message-header">
                    <span class="message-text">${message.text}</span>
                </div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
    }

    return messageGroup;
}

// Update contact details panel
function updateContactDetails() {
    if (!currentConversation) return;

    document.querySelector('.contact-avatar').textContent = currentConversation.initials;
    document.querySelector('.contact-details-panel h3').textContent = currentConversation.name;
}

// Send message
function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const messageText = messageInput.value.trim();

    if (!messageText || !currentConversation) return;

    // Create new message
    const now = new Date();
    const newMessage = {
        id: `msg-${messageIdCounter++}`,
        type: 'outgoing',
        sender: 'AutomateMyBiz.pro',
        text: messageText,
        date: formatDate(now),
        time: formatTime(now)
    };

    // Add to conversation
    currentConversation.messages.push(newMessage);

    // Reload messages
    loadMessages();

    // Clear input
    clearMessageInput();

    // Update last message in conversation list
    updateConversationPreview();
}

// Clear message input
function clearMessageInput() {
    document.querySelector('.message-input').value = '';
    updateCharCount();
}

// Update character count
function updateCharCount() {
    const messageInput = document.querySelector('.message-input');
    const charCount = messageInput.value.length;
    const segments = Math.ceil(charCount / 160) || 0;
    document.querySelector('.char-count').textContent = `Chars: ${charCount}, Segs: ${segments}`;
}

// Update conversation preview in list
function updateConversationPreview() {
    if (!currentConversation) return;

    const index = Object.keys(conversations).indexOf(Object.keys(conversations).find(key => conversations[key] === currentConversation));
    const conversationItem = document.querySelectorAll('.conversation-item')[index];
    
    if (conversationItem && currentConversation.messages.length > 0) {
        const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
        const preview = conversationItem.querySelector('.conversation-preview .sender');
        if (preview) {
            preview.textContent = lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '');
        }
    }
}

// Update unread count
function updateUnreadCount(conversationItem) {
    const unreadElement = conversationItem.querySelector('.unread-count');
    if (unreadElement) {
        if (currentConversation.unread > 0) {
            unreadElement.textContent = currentConversation.unread;
            unreadElement.style.display = 'flex';
        } else {
            unreadElement.style.display = 'none';
        }
    }
}

// Format date
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}${getOrdinalSuffix(date.getDate())} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

// Format time
function formatTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${hours}:${minutesStr} ${ampm}`;
}

// Get ordinal suffix
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Setup control panel buttons
function setupControlPanelButtons() {
    // Send Incoming Message
    document.querySelectorAll('.control-btn')[0].addEventListener('click', function() {
        sendIncomingMessage();
    });

    // Send Outgoing Message
    document.querySelectorAll('.control-btn')[1].addEventListener('click', function() {
        sendOutgoingMessage();
    });

    // Mark as Read
    document.querySelectorAll('.control-btn')[2].addEventListener('click', function() {
        markAsRead();
    });

    // Mark as Unread
    document.querySelectorAll('.control-btn')[3].addEventListener('click', function() {
        markAsUnread();
    });

    // Change Contact
    document.querySelectorAll('.control-btn')[4].addEventListener('click', function() {
        changeContact();
    });

    // Update Status
    document.querySelectorAll('.control-btn')[5].addEventListener('click', function() {
        updateStatus();
    });

    // Add Tag
    document.querySelectorAll('.control-btn')[6].addEventListener('click', function() {
        addTag();
    });

    // Toggle DND
    document.querySelectorAll('.control-btn')[7].addEventListener('click', function() {
        toggleDND();
    });

    // Load Sample Conversation
    document.querySelectorAll('.control-btn')[8].addEventListener('click', function() {
        loadSampleConversation();
    });

    // Clear Messages
    document.querySelectorAll('.control-btn')[9].addEventListener('click', function() {
        clearMessages();
    });

    // Reset All
    document.querySelectorAll('.control-btn')[10].addEventListener('click', function() {
        resetAll();
    });
}

// Control panel functions
function sendIncomingMessage() {
    if (!currentConversation) return;

    const sampleMessages = [
        "Thanks for reaching out! When can we schedule a call?",
        "I'm interested in learning more about your services.",
        "Can you send me more information?",
        "What's the pricing for this?",
        "I'll get back to you soon."
    ];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const now = new Date();

    const newMessage = {
        id: `msg-${messageIdCounter++}`,
        type: 'incoming',
        text: randomMessage,
        date: formatDate(now),
        time: formatTime(now)
    };

    currentConversation.messages.push(newMessage);
    loadMessages();

    // Update unread count
    currentConversation.unread++;
    const index = Object.keys(conversations).indexOf(Object.keys(conversations).find(key => conversations[key] === currentConversation));
    const conversationItem = document.querySelectorAll('.conversation-item')[index];
    updateUnreadCount(conversationItem);
}

function sendOutgoingMessage() {
    if (!currentConversation) return;

    const sampleMessages = [
        "Thank you for your interest in our services!",
        "I'd be happy to schedule a call with you.",
        "Here's the information you requested.",
        "Our pricing starts at $299/month.",
        "Looking forward to hearing from you!"
    ];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const now = new Date();

    const newMessage = {
        id: `msg-${messageIdCounter++}`,
        type: 'outgoing',
        sender: 'AutomateMyBiz.pro',
        text: randomMessage,
        date: formatDate(now),
        time: formatTime(now)
    };

    currentConversation.messages.push(newMessage);
    loadMessages();
    updateConversationPreview();
}

function markAsRead() {
    document.querySelectorAll('.conversation-item').forEach((item, index) => {
        const convId = Object.keys(conversations)[index];
        conversations[convId].unread = 0;
        updateUnreadCount(item);
    });
}

function markAsUnread() {
    if (!currentConversation) return;

    currentConversation.unread = Math.floor(Math.random() * 5) + 1;
    const index = Object.keys(conversations).indexOf(Object.keys(conversations).find(key => conversations[key] === currentConversation));
    const conversationItem = document.querySelectorAll('.conversation-item')[index];
    updateUnreadCount(conversationItem);
}

function changeContact() {
    const names = ['Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'Chris Brown', 'Jessica Martinez'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const initials = randomName.split(' ').map(n => n[0]).join('');

    if (currentConversation) {
        currentConversation.name = randomName;
        currentConversation.initials = initials;
        updateChatHeader();
        updateContactDetails();

        // Update in conversation list
        const index = Object.keys(conversations).indexOf(Object.keys(conversations).find(key => conversations[key] === currentConversation));
        const conversationItem = document.querySelectorAll('.conversation-item')[index];
        if (conversationItem) {
            conversationItem.querySelector('.avatar').textContent = initials;
            conversationItem.querySelector('.contact-name').textContent = randomName;
        }
    }
}

function updateStatus() {
    alert('Status updated successfully!');
}

function addTag() {
    const tags = ['VIP', 'Hot Lead', 'Follow Up', 'Qualified', 'Nurture'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    alert(`Tag "${randomTag}" added to contact!`);
}

function toggleDND() {
    const dndToggle = document.querySelector('.toggle-switch span');
    if (dndToggle.textContent === 'OFF') {
        dndToggle.textContent = 'ON';
        dndToggle.style.color = '#5e72e4';
    } else {
        dndToggle.textContent = 'OFF';
        dndToggle.style.color = '#666';
    }
}

function loadSampleConversation() {
    if (!currentConversation) return;

    const sampleConversation = [
        {
            type: 'outgoing',
            sender: 'AutomateMyBiz.pro',
            text: 'Hi! Thanks for signing up for our webinar.',
            date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
            time: formatTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
        },
        {
            type: 'incoming',
            text: "Yes, I'm excited to attend!",
            date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
            time: formatTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000))
        },
        {
            type: 'outgoing',
            sender: 'AutomateMyBiz.pro',
            text: 'Great! The webinar is tomorrow at 2 PM EST.',
            date: formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
            time: formatTime(new Date(Date.now() - 24 * 60 * 60 * 1000))
        },
        {
            type: 'incoming',
            text: 'Perfect, see you there!',
            date: formatDate(new Date()),
            time: formatTime(new Date())
        }
    ];

    sampleConversation.forEach(msg => {
        msg.id = `msg-${messageIdCounter++}`;
    });

    currentConversation.messages = sampleConversation;
    loadMessages();
}

function clearMessages() {
    if (!currentConversation) return;
    
    currentConversation.messages = [];
    loadMessages();
}

function resetAll() {
    // Reset all conversations
    Object.keys(conversations).forEach(convId => {
        conversations[convId].messages = [];
        conversations[convId].unread = 0;
    });

    // Reset UI
    document.querySelectorAll('.unread-count').forEach(el => {
        el.style.display = 'none';
    });

    // Reload current conversation
    if (currentConversation) {
        loadMessages();
    }

    // Reset message input
    clearMessageInput();

    alert('All conversations have been reset!');
}