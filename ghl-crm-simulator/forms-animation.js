// ============================================
// FORMS ANIMATION SIMULATOR FUNCTIONS
// ============================================

// Toggle between random and manual submission types
function toggleSubmissionType(type) {
    const randomOptions = document.getElementById('randomDataOptions');
    const manualOptions = document.getElementById('manualFieldsOptions');

    if (type === 'random') {
        randomOptions.style.display = 'block';
        manualOptions.style.display = 'none';
    } else {
        randomOptions.style.display = 'none';
        manualOptions.style.display = 'block';
    }
}

// Random name generator for US names
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
                    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const timezones = {
    'us-east': ['America/New_York', 'America/Detroit', 'America/Indiana/Indianapolis'],
    'us-west': ['America/Los_Angeles', 'America/Phoenix', 'America/Anchorage'],
    'us-central': ['America/Chicago', 'America/Denver'],
    'us-south': ['America/Chicago', 'America/Phoenix', 'America/New_York']
};

// Generate random submission data
function generateRandomSubmission() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = firstName + ' ' + lastName;
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const email = firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@' + domains[Math.floor(Math.random() * 4)];

    // Always use New York timezone
    const timezone = 'America/New_York';
    const tzDisplay = 'New York (GMT-05:00)';

    return {
        fullName: fullName,
        email: email,
        timezone: tzDisplay,
        initials: firstName[0] + lastName[0],
        avatarColor: getRandomAvatarColor()
    };
}

// Get timezone offset
function getTimezoneOffset(tz) {
    const offsets = {
        'America/New_York': '-05:00',
        'America/Chicago': '-06:00',
        'America/Denver': '-07:00',
        'America/Los_Angeles': '-08:00',
        'America/Phoenix': '-07:00',
        'America/Detroit': '-05:00',
        'America/Indiana/Indianapolis': '-05:00',
        'America/Anchorage': '-09:00'
    };
    return offsets[tz] || '-05:00';
}

// Get random avatar color
function getRandomAvatarColor() {
    const colors = ['#34c759', '#af52de', '#5856d6', '#ff3b30', '#ff9500', '#007aff', '#5ac8fa', '#4cd964', '#ffcc00', '#ff2d55'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Animate random submission
function animateRandomSubmission() {
    const data = generateRandomSubmission();
    const speed = document.getElementById('formsAnimationSpeed').value;
    animateNewSubmission(data, speed);
}

// Animate manual submission
function animateManualSubmission() {
    const fullName = document.getElementById('manualName').value.trim();
    const email = document.getElementById('manualEmail').value.trim();

    if (!fullName || !email) {
        alert('Please fill in all fields');
        return;
    }

    const names = fullName.split(' ');
    const initials = names.map(n => n[0]).join('').toUpperCase().substr(0, 2);

    const data = {
        fullName: fullName,
        email: email,
        timezone: 'New York (GMT-05:00)',
        initials: initials,
        avatarColor: getRandomAvatarColor()
    };

    animateNewSubmission(data, 'normal');
}

// Main animation function
function animateNewSubmission(data, speed = 'normal') {
    const tbody = document.getElementById('submissionsTableBody');
    if (!tbody) return;

    const speeds = { slow: 800, normal: 400, fast: 200 };
    const duration = speeds[speed];

    // Create new row
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const newRow = document.createElement('tr');
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-10px)';
    newRow.style.transition = 'opacity ' + duration + 'ms ease, transform ' + duration + 'ms ease';

    newRow.innerHTML = '<td><span class="submission-date">' + timeStr + '</span></td>' +
        '<td><div class="contact-avatar" style="background: ' + data.avatarColor + ';">' + data.initials + '</div></td>' +
        '<td>' + data.fullName + '</td>' +
        '<td>' + data.fullName + '</td>' +
        '<td><a href="mailto:' + data.email + '">' + data.email + '</a></td>' +
        '<td>' + data.timezone + '</td>';

    // Insert at the top
    tbody.insertBefore(newRow, tbody.firstChild);

    // Trigger animation immediately
    requestAnimationFrame(() => {
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';

        // Auto scroll
        if (document.getElementById('autoScroll').checked) {
            const tableContainer = document.querySelector('#forms-screen .submissions-table-container');
            if (tableContainer) {
                tableContainer.scrollTop = 0;
            }
        }

        // Play sound
        if (document.getElementById('playSound').checked) {
            const audio = document.getElementById('messageNotification');
            if (audio) audio.play().catch(e => console.log('Audio play failed'));
        }

        // Update count
        updateSubmissionCount();
    }, 50);
}

// Show notification popup
function showFormNotification(name) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'form-notification';
    notification.innerHTML = '<i class="fas fa-bell"></i>' +
        '<span>New submission from ' + name + '</span>';

    notification.style.cssText = 'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'background: #10b981;' +
        'color: white;' +
        'padding: 12px 20px;' +
        'border-radius: 8px;' +
        'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
        'display: flex;' +
        'align-items: center;' +
        'gap: 10px;' +
        'font-size: 14px;' +
        'z-index: 10000;' +
        'animation: slideIn 0.3s ease;';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update submission count
function updateSubmissionCount() {
    const countElement = document.querySelector('#forms-screen .submission-count');
    if (countElement) {
        const current = parseInt(countElement.textContent) || 34;
        countElement.textContent = (current + 1) + ' Submissions';
    }
}

// Simulate bulk submissions
function simulateBulkSubmissions() {
    let count = 0;
    const interval = setInterval(() => {
        animateRandomSubmission();
        count++;
        if (count >= 5) clearInterval(interval);
    }, 1500);
}

// Clear all submissions
function clearAllSubmissions() {
    const tbody = document.getElementById('submissionsTableBody');
    if (tbody) {
        tbody.innerHTML = '';
        const countElement = document.querySelector('#forms-screen .submission-count');
        if (countElement) {
            countElement.textContent = '0 Submissions';
        }
    }
}

// Reset to default
function resetToDefault() {
    window.location.reload();
}

// Add CSS animation keyframes
const formsAnimationStyle = document.createElement('style');
formsAnimationStyle.textContent = '@keyframes slideIn {' +
    'from { transform: translateX(100%); opacity: 0; }' +
    'to { transform: translateX(0); opacity: 1; }' +
    '}' +
    '@keyframes slideOut {' +
    'from { transform: translateX(0); opacity: 1; }' +
    'to { transform: translateX(100%); opacity: 0; }' +
    '}';
document.head.appendChild(formsAnimationStyle);