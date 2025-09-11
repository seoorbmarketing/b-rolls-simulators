// Update current time
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('currentTime').textContent = timeString;
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();

// Notification counter for unique IDs
let notificationCounter = 0;

// Selected icon tracking
let selectedIcon = 'fas fa-comment';
let selectedColor = '#34C759';

// Icon selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const iconOptions = document.querySelectorAll('.icon-option');
    iconOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active from all
            iconOptions.forEach(opt => opt.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            // Store selected icon and color
            selectedIcon = this.dataset.icon;
            selectedColor = this.dataset.color;
            
            // Update app name based on icon
            const appNames = {
                'fas fa-comment': 'Messages',
                'fas fa-envelope': 'Mail',
                'fas fa-calendar': 'Calendar',
                'fas fa-bell': 'Notification',
                'fab fa-instagram': 'Instagram',
                'fab fa-twitter': 'Twitter',
                'fab fa-whatsapp': 'WhatsApp',
                'fab fa-slack': 'Slack',
                'fab fa-facebook': 'Facebook',
                'fab fa-linkedin': 'LinkedIn',
                'fas fa-phone': 'Phone',
                'fas fa-video': 'FaceTime'
            };
            
            const appNameInput = document.getElementById('notificationApp');
            if (appNames[selectedIcon]) {
                appNameInput.value = appNames[selectedIcon];
            }
        });
    });
});

// Create notification element
function createNotification(app, title, message, icon, color = '#007AFF', actions = null) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.id = `notification-${notificationCounter++}`;
    
    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    }).toLowerCase();
    
    let notificationHTML = `
        <div class="notification-header">
            <div class="notification-icon" style="background: ${color}">
                <i class="${icon}"></i>
            </div>
            <div class="notification-app">${app}</div>
            <div class="notification-time">now</div>
        </div>
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add actions if provided
    if (actions) {
        notificationHTML += '<div class="notification-actions">';
        actions.forEach(action => {
            notificationHTML += `
                <button class="notification-action ${action.type}" onclick="${action.onclick}">
                    ${action.text}
                </button>
            `;
        });
        notificationHTML += '</div>';
    }
    
    notification.innerHTML = notificationHTML;
    
    // Add click to dismiss
    notification.addEventListener('click', function(e) {
        if (!e.target.classList.contains('notification-action')) {
            dismissNotification(this.id);
        }
    });
    
    // Add to container
    if (document.getElementById('stackNotifications').checked) {
        container.appendChild(notification);
    } else {
        container.innerHTML = '';
        container.appendChild(notification);
    }
    
    // Play sound if enabled
    if (document.getElementById('soundEnabled').checked) {
        playNotificationSound();
    }
    
    // Vibrate effect if enabled
    if (document.getElementById('vibrationEnabled').checked) {
        document.querySelector('.phone-frame').classList.add('vibrating');
        setTimeout(() => {
            document.querySelector('.phone-frame').classList.remove('vibrating');
        }, 300);
    }
    
    // Auto dismiss after 5 seconds if enabled
    if (document.getElementById('autoClearEnabled').checked) {
        setTimeout(() => {
            dismissNotification(notification.id);
        }, 5000);
    }
}

// Create incoming call notification
function createCallNotification(name, number) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification call';
    notification.id = `notification-${notificationCounter++}`;
    
    notification.innerHTML = `
        <div class="call-header">
            <div class="call-label">Incoming call</div>
            <div class="call-name">${name}</div>
            <div class="call-number">${number}</div>
        </div>
        <div class="call-actions">
            <button class="call-button decline" onclick="dismissNotification('${notification.id}')">
                <i class="fas fa-phone-slash"></i>
            </button>
            <button class="call-button accept" onclick="dismissNotification('${notification.id}')">
                <i class="fas fa-phone"></i>
            </button>
        </div>
    `;
    
    // Clear previous notifications for call
    container.innerHTML = '';
    container.appendChild(notification);
    
    // Play ringtone if enabled
    if (document.getElementById('soundEnabled').checked) {
        playRingtone();
    }
    
    // Continuous vibration for call
    if (document.getElementById('vibrationEnabled').checked) {
        const vibrateInterval = setInterval(() => {
            document.querySelector('.phone-frame').classList.add('vibrating');
            setTimeout(() => {
                document.querySelector('.phone-frame').classList.remove('vibrating');
            }, 300);
        }, 400);
        
        // Stop vibration when call is dismissed (if auto-clear enabled)
        if (document.getElementById('autoClearEnabled').checked) {
            setTimeout(() => {
                clearInterval(vibrateInterval);
                dismissNotification(notification.id);
            }, 5000);
        } else {
            // Just store the interval ID on the notification element for manual clearing
            notification.dataset.vibrateInterval = vibrateInterval;
        }
    }
}

// Dismiss notification
function dismissNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        // Clear vibration interval if it exists
        if (notification.dataset.vibrateInterval) {
            clearInterval(notification.dataset.vibrateInterval);
        }
        
        notification.classList.add('removing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Play notification sound
function playNotificationSound() {
    const audio = new Audio('notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Notification sound play failed:', e));
}

// Play ringtone (using notification sound with higher volume for calls)
function playRingtone() {
    const audio = new Audio('notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Ringtone play failed:', e));
}

// Clear all notifications
function clearAllNotifications() {
    const container = document.getElementById('notificationContainer');
    const notifications = container.querySelectorAll('.notification');
    
    notifications.forEach((notification, index) => {
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, index * 100);
    });
}

// Main notification sender
function sendNotification() {
    const app = document.getElementById('notificationApp').value || 'App';
    const title = document.getElementById('notificationTitle').value || 'Notification';
    const message = document.getElementById('notificationMessage').value || 'This is a notification';
    
    createNotification(
        app,
        title,
        message,
        selectedIcon,
        selectedColor
    );
}

// Incoming call sender
function sendIncomingCall() {
    const name = document.getElementById('callerName').value || 'Unknown';
    const number = document.getElementById('callerNumber').value || 'No Number';
    
    createCallNotification(name, number);
}

// Scenario functions
function sendBusyMorning() {
    const notifications = [
        { app: 'Mail', title: 'Team Update', message: 'Morning standup notes are ready', icon: 'fas fa-envelope', color: '#007AFF' },
        { app: 'Calendar', title: 'Meeting in 15 min', message: 'Team Standup • Zoom Room 1', icon: 'fas fa-calendar', color: '#FF3B30' },
        { app: 'Messages', title: 'Sarah Johnson', message: 'Running 5 minutes late!', icon: 'fas fa-comment', color: '#34C759' },
        { app: 'Slack', title: 'New message', message: '#general: Coffee machine is fixed! ☕', icon: 'fab fa-slack', color: '#4A154B' },
        { app: 'Mail', title: 'Client Proposal', message: 'Feedback received on project proposal', icon: 'fas fa-envelope', color: '#007AFF' }
    ];
    
    notifications.forEach((notif, index) => {
        setTimeout(() => {
            createNotification(notif.app, notif.title, notif.message, notif.icon, notif.color);
        }, index * 500);
    });
}

function sendMissedOpportunities() {
    const opportunities = [
        { app: "Phone", title: "3 Missed Calls", message: "From: Potential Client (2), Office (1)" },
        { app: "Messages", title: "5 Unread Messages", message: "Important: Quote request from new customer" },
        { app: "Email", title: "Urgent: Contract Expiring", message: "Client contract needs renewal by EOD" },
        { app: "Calendar", title: "Meeting Started", message: "Sales pitch with ABC Corp - Started 5 min ago" }
    ];
    
    opportunities.forEach((opp, index) => {
        setTimeout(() => {
            createNotification(
                opp.app,
                opp.title,
                opp.message,
                'fas fa-exclamation-triangle',
                '#FF9500'
            );
        }, index * 500);
    });
}

function sendClientMessages() {
    const clients = [
        { name: "ABC Corporation", message: "We'd like to schedule a follow-up meeting" },
        { name: "XYZ Industries", message: "Can you send us the updated proposal?" },
        { name: "Smith & Associates", message: "Great work on the project! When can we start phase 2?" },
        { name: "Johnson LLC", message: "We need support with the system urgently" }
    ];
    
    clients.forEach((client, index) => {
        setTimeout(() => {
            createNotification(
                'Client Portal',
                client.name,
                client.message,
                'fas fa-briefcase',
                '#FF6B6B'
            );
        }, index * 600);
    });
}

// Toggle between skeleton and real iOS UI
function toggleUIStyle(style) {
    const skeletonUI = document.getElementById('homescreenSkeleton');
    const realUI = document.getElementById('homescreenReal');
    
    if (style === 'skeleton') {
        skeletonUI.style.display = 'block';
        realUI.style.display = 'none';
    } else if (style === 'real') {
        skeletonUI.style.display = 'none';
        realUI.style.display = 'flex';
    }
}