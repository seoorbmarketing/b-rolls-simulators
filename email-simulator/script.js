// Email storage
let emails = [];
let emailIdCounter = 1;

// Initialize with some default emails
function initializeDefaultEmails() {
    const defaultEmails = [
        {
            id: emailIdCounter++,
            sender: 'no_reply',
            senderEmail: 'noreply@teamlogger.com',
            subject: 'TeamLogger Summary Report 08-Sep-2025',
            body: 'Hi, Here are the TeamLogger summary reports of yourself...\n\nDaily Summary:\n- Total time tracked: 8h 23m\n- Productive time: 7h 45m\n- Meetings: 38m\n\nTop Applications:\n1. VS Code - 4h 12m\n2. Chrome - 2h 35m\n3. Slack - 1h 18m',
            preview: 'Hi, Here are the TeamLogger summary reports of yourself...',
            time: '6:19 AM',
            avatar: { type: 'initial', text: 'T', color: '#5f6368' },
            unread: false,
            starred: true,
            category: 'primary'
        },
        {
            id: emailIdCounter++,
            sender: 'BrainXcape NYC',
            senderEmail: 'info@brainxcape.com',
            subject: 'Escape Room — New Google Review',
            body: 'You have a new review from a customer...',
            preview: 'You have a new review from a customer...',
            time: 'Sep 8',
            avatar: { type: 'initial', text: 'B', color: '#5f6368' },
            unread: false,
            starred: false,
            category: 'promotions'
        },
        {
            id: emailIdCounter++,
            sender: 'HighLevel',
            senderEmail: 'support@highlevel.com',
            subject: 'Scale smarter with the Product Track at LevelUp 2025',
            body: 'Get hands-on strategies from product builders, SEO pros...\n\nJoin us at LevelUp 2025 for exclusive insights into scaling your business.',
            preview: 'Get hands-on strategies from product builders, SEO pros...',
            time: '2:03 AM',
            avatar: { type: 'initial', text: 'H', color: '#1DB584' },
            unread: true,
            starred: true,
            category: 'primary'
        },
        {
            id: emailIdCounter++,
            sender: 'Google Gemini',
            senderEmail: 'gemini@google.com',
            subject: 'Hey Sagar, welcome to Gemini',
            body: 'Chat with Gemini to supercharge your creativity and productivity.\n\nGemini can help you:\n• Write better emails\n• Brainstorm ideas\n• Learn new topics\n• Code faster',
            preview: 'Chat with Gemini to supercharge your creativity and produ...',
            time: 'Sep 8',
            avatar: { type: 'initial', text: 'G', color: '#4285F4' },
            unread: false,
            starred: true,
            category: 'primary'
        },
        {
            id: emailIdCounter++,
            sender: 'Google Gemini',
            senderEmail: 'gemini@google.com',
            subject: "You're now using Gemini on web",
            body: 'Learn more about what you can do with Gemini web app...\n\nExplore powerful features:\n• Advanced code generation\n• Document analysis\n• Creative writing\n• And much more!',
            preview: 'Learn more about what you can do with Gemini web app...',
            time: 'Sep 8',
            avatar: { type: 'initial', text: 'G', color: '#4285F4' },
            unread: false,
            starred: true,
            category: 'primary'
        },
        {
            id: emailIdCounter++,
            sender: 'noreply',
            senderEmail: 'noreply@agency.com',
            subject: 'New Client Added to Agency | Automate My Biz LLC',
            body: 'New Client Added - Escape FLA New Client Added Congrat...',
            preview: 'New Client Added - Escape FLA New Client Added Congrat...',
            time: 'Sep 8',
            avatar: { type: 'initial', text: 'N', color: '#6D7DC7' },
            unread: false,
            starred: true,
            category: 'primary'
        }
    ];
    
    emails = defaultEmails;
    renderEmailList();
}

// Render email list
function renderEmailList() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    emails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.className = `email-item ${email.unread ? 'unread' : ''}`;
        emailItem.onclick = () => openEmail(email.id);
        
        emailItem.innerHTML = `
            <div class="email-avatar" style="background: ${email.avatar.color};">
                ${email.avatar.text}
            </div>
            <div class="email-content-wrapper">
                <div class="email-header-row">
                    <div class="email-sender">${email.sender}</div>
                    <div class="email-time">${email.time}</div>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            </div>
            <i class="fas fa-star email-star ${email.starred ? 'starred' : ''}" onclick="toggleStar(event, ${email.id})"></i>
        `;
        
        emailList.appendChild(emailItem);
    });
}

// Toggle star
function toggleStar(event, emailId) {
    event.stopPropagation();
    const email = emails.find(e => e.id === emailId);
    if (email) {
        email.starred = !email.starred;
        renderEmailList();
    }
}

// Open email detail
function openEmail(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;
    
    // Mark as read
    email.unread = false;
    renderEmailList();
    
    // Show email detail view
    document.getElementById('inboxView').style.display = 'none';
    document.getElementById('emailDetailView').style.display = 'flex';
    
    // Populate email content
    const emailContent = document.getElementById('emailContent');
    emailContent.innerHTML = `
        <div class="email-detail-header">
            <div class="email-detail-subject">${email.subject}</div>
            <div class="email-detail-sender">
                <div class="email-detail-avatar" style="background: ${email.avatar.color};">
                    ${email.avatar.text}
                </div>
                <div class="email-detail-info">
                    <div class="email-detail-name">${email.sender}</div>
                    <div class="email-detail-to">to me</div>
                </div>
                <div class="email-detail-time">${email.time}</div>
            </div>
        </div>
        <div class="email-detail-body">${email.body}</div>
        
        <!-- Reply Actions Bar -->
        <div class="reply-actions-bar">
            <button class="reply-btn">
                <i class="fas fa-reply"></i>
                <span>Reply</span>
            </button>
            <button class="reply-btn">
                <i class="fas fa-reply-all"></i>
                <span>Reply all</span>
            </button>
            <button class="reply-btn">
                <i class="fas fa-arrow-right"></i>
                <span>Forward</span>
            </button>
            <button class="reply-btn">
                <i class="far fa-smile"></i>
            </button>
        </div>
    `;
}

// Back to inbox
function backToInbox() {
    document.getElementById('emailDetailView').style.display = 'none';
    document.getElementById('inboxView').style.display = 'block';
}

// Open compose
function openCompose() {
    document.getElementById('composeView').style.display = 'flex';
}

// Close compose
function closeCompose() {
    document.getElementById('composeView').style.display = 'none';
    // Clear compose fields
    document.getElementById('composeTo').value = '';
    document.getElementById('composeSubject').value = '';
    document.getElementById('composeBody').value = '';
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

// Add new email
function addEmail() {
    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;
    const time = document.getElementById('emailTime').value || 'Just now';
    const avatarType = document.getElementById('avatarType').value;
    const avatarInitial = document.getElementById('avatarInitial').value || senderName.charAt(0).toUpperCase();
    const avatarColor = document.getElementById('avatarColor').value;
    
    if (!senderName || !subject) {
        alert('Please enter sender name and subject');
        return;
    }
    
    const newEmail = {
        id: emailIdCounter++,
        sender: senderName,
        senderEmail: senderEmail || `${senderName.toLowerCase().replace(/\s/g, '')}@email.com`,
        subject: subject,
        body: body || 'No content',
        preview: body ? body.split('\n')[0].substring(0, 60) + '...' : 'No content',
        time: time,
        avatar: {
            type: avatarType,
            text: avatarInitial,
            color: avatarColor
        },
        unread: document.getElementById('showUnreadBadge').checked,
        starred: document.getElementById('starEmails').checked,
        category: 'primary'
    };
    
    // Add to beginning of array for newest first
    emails.unshift(newEmail);
    renderEmailList();
    
    // Clear form
    document.getElementById('senderName').value = '';
    document.getElementById('senderEmail').value = '';
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailBody').value = '';
    document.getElementById('emailTime').value = '';
    document.getElementById('avatarInitial').value = '';
}

// Load email template
function loadTemplate(type) {
    switch(type) {
        case 'promotion':
            document.getElementById('senderName').value = 'Amazon';
            document.getElementById('emailSubject').value = '🎉 Your order has been delivered!';
            document.getElementById('emailBody').value = 'Your package has been delivered to your address.\n\nOrder #123-4567890\nDelivered to: Front door\n\nThank you for shopping with Amazon!';
            document.getElementById('emailTime').value = '10:30 AM';
            document.getElementById('avatarInitial').value = 'A';
            document.getElementById('avatarColor').value = '#FF9900';
            break;
            
        case 'notification':
            document.getElementById('senderName').value = 'GitHub';
            document.getElementById('emailSubject').value = '[GitHub] You have a new pull request';
            document.getElementById('emailBody').value = 'A new pull request has been opened in your repository.\n\nPR #42: Fix responsive design issues\nOpened by: contributor123\n\nView pull request on GitHub';
            document.getElementById('emailTime').value = 'Yesterday';
            document.getElementById('avatarInitial').value = 'G';
            document.getElementById('avatarColor').value = '#24292E';
            break;
            
        case 'personal':
            document.getElementById('senderName').value = 'Sarah Johnson';
            document.getElementById('emailSubject').value = 'Meeting tomorrow?';
            document.getElementById('emailBody').value = "Hey!\n\nAre we still on for our coffee meeting tomorrow at 2 PM?\n\nLet me know if you need to reschedule.\n\nBest,\nSarah";
            document.getElementById('emailTime').value = '3:45 PM';
            document.getElementById('avatarInitial').value = 'SJ';
            document.getElementById('avatarColor').value = '#9C27B0';
            break;
            
        case 'work':
            document.getElementById('senderName').value = 'Project Manager';
            document.getElementById('emailSubject').value = 'Q4 Planning Meeting - Action Items';
            document.getElementById('emailBody').value = 'Team,\n\nFollowing up on our Q4 planning meeting. Here are the action items:\n\n1. Review budget allocations\n2. Update project timelines\n3. Schedule stakeholder meetings\n\nDeadline: End of week\n\nThanks!';
            document.getElementById('emailTime').value = '11:00 AM';
            document.getElementById('avatarInitial').value = 'PM';
            document.getElementById('avatarColor').value = '#00897B';
            break;
            
        case 'lead':
            document.getElementById('senderName').value = 'Marketing Team';
            document.getElementById('emailSubject').value = 'New Lead: Enterprise Client Interested in Your Services';
            document.getElementById('emailBody').value = "Great news! A new lead has come through our website.\n\nLead Details:\n• Company: TechCorp Solutions\n• Contact: Michael Chen, CTO\n• Budget: $50,000+\n• Timeline: Q1 2025\n\nThey're interested in our premium package and requested a demo.\n\nPriority: HIGH\nNext Step: Schedule call within 24 hours";
            document.getElementById('emailTime').value = 'Just now';
            document.getElementById('avatarInitial').value = 'MT';
            document.getElementById('avatarColor').value = '#EA4335';
            break;
            
        case 'invoice':
            document.getElementById('senderName').value = 'QuickBooks';
            document.getElementById('emailSubject').value = 'Invoice #INV-2024-1547 - Payment Due';
            document.getElementById('emailBody').value = "Invoice from ABC Services Inc.\n\nInvoice Number: INV-2024-1547\nDate: December 15, 2024\nDue Date: December 30, 2024\n\nServices Rendered:\n• HVAC System Repair - $450.00\n• Parts & Materials - $185.00\n• Emergency Service Fee - $75.00\n\nSubtotal: $710.00\nTax (8%): $56.80\nTotal Due: $766.80\n\nPayment Methods:\n• Online: Pay via QuickBooks\n• Check: Mail to 123 Business St.\n• Wire Transfer: Contact accounting\n\nThank you for your business!";
            document.getElementById('emailTime').value = '9:15 AM';
            document.getElementById('avatarInitial').value = 'QB';
            document.getElementById('avatarColor').value = '#2CA01C';
            break;
            
        case 'quotation':
            document.getElementById('senderName').value = 'Sales Team';
            document.getElementById('emailSubject').value = 'Quote #Q-2024-3892 - Your Custom Solution Package';
            document.getElementById('emailBody').value = "Thank you for your interest in our services!\n\nQuote Number: Q-2024-3892\nValid Until: January 15, 2025\n\nProposed Services:\n• Complete Kitchen Remodel\n  - Cabinet Installation: $8,500\n  - Countertop (Granite): $3,200\n  - Plumbing Updates: $2,100\n  - Electrical Work: $1,800\n  - Labor: $4,400\n\nTotal Estimate: $20,000\n\nPayment Terms:\n• 30% deposit upon acceptance\n• 40% at project midpoint\n• 30% upon completion\n\nThis quote includes:\n✓ All materials and labor\n✓ 2-year warranty\n✓ Project management\n✓ Cleanup and disposal\n\nReady to proceed? Reply to accept this quote.";
            document.getElementById('emailTime').value = '2:30 PM';
            document.getElementById('avatarInitial').value = 'ST';
            document.getElementById('avatarColor').value = '#4285F4';
            break;
    }
}

// Clear all emails
function clearAllEmails() {
    if (confirm('Are you sure you want to clear all emails?')) {
        emails = [];
        renderEmailList();
    }
}

// Select color for avatar
function selectColor(color) {
    // Update hidden input
    document.getElementById('avatarColor').value = color;
    
    // Update active state
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

// User Avatar Functions
function updateUserAvatarType(type) {
    if (type === 'initial') {
        document.getElementById('userInitialOptions').style.display = 'block';
        document.getElementById('userUploadOptions').style.display = 'none';
        updateUserAvatar();
    } else {
        document.getElementById('userInitialOptions').style.display = 'none';
        document.getElementById('userUploadOptions').style.display = 'block';
    }
}

function updateUserAvatar() {
    const initial = document.getElementById('userInitial').value || 'S';
    const color = document.getElementById('userAvatarColor').value;
    const avatarHtml = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='${color}'/><text x='50' y='67' font-size='50' text-anchor='middle' fill='white' font-family='Arial'>${initial.toUpperCase()}</text></svg>`;
    const avatarUrl = `data:image/svg+xml,${encodeURIComponent(avatarHtml)}`;
    
    document.querySelector('.profile-avatar img').src = avatarUrl;
    
    // Save to localStorage
    localStorage.setItem('userAvatar', JSON.stringify({
        type: 'initial',
        initial: initial,
        color: color
    }));
}

function selectUserColor(color) {
    document.getElementById('userAvatarColor').value = color;
    
    // Update active state for user color selector
    document.querySelectorAll('#userInitialOptions .color-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
    
    updateUserAvatar();
}

function handleUserAvatarUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.querySelector('.profile-avatar img').src = imageUrl;
            document.getElementById('removeUserAvatar').style.display = 'block';
            
            // Save to localStorage
            localStorage.setItem('userAvatar', JSON.stringify({
                type: 'upload',
                image: imageUrl
            }));
        };
        reader.readAsDataURL(file);
    }
}

function removeUserAvatar() {
    document.getElementById('userAvatarUpload').value = '';
    document.getElementById('removeUserAvatar').style.display = 'none';
    document.querySelector('input[value="initial"]').checked = true;
    updateUserAvatarType('initial');
}

// Load user avatar on page load
function loadUserAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        if (avatar.type === 'initial') {
            document.getElementById('userInitial').value = avatar.initial || 'S';
            document.getElementById('userAvatarColor').value = avatar.color || '#34A853';
            selectUserColor(avatar.color || '#34A853');
            updateUserAvatar();
        } else if (avatar.type === 'upload' && avatar.image) {
            document.querySelector('.profile-avatar img').src = avatar.image;
            document.querySelector('input[value="upload"]').checked = true;
            updateUserAvatarType('upload');
            document.getElementById('removeUserAvatar').style.display = 'block';
        }
    }
}

// Reset simulator
function resetSimulator() {
    initializeDefaultEmails();
    closeCompose();
    backToInbox();
    closeSidebar();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultEmails();
    loadUserAvatar();
});