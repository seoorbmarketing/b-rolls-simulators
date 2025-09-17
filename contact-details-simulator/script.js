// Global variables
let currentAvatarColor = '#FF6B35';
let tags = [];
let isAnimating = false;
let animationTimeouts = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Start with empty fields
    clearAllFields();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Auto-update initials when preset name changes
    document.getElementById('presetName').addEventListener('input', (e) => {
        updateInitialsFromName(e.target.value);
    });
}

// Clear all fields (for initial state and reset)
function clearAllFields() {
    // Clear display fields
    document.getElementById('contactName').textContent = '';
    document.getElementById('emailValue').textContent = '';
    document.getElementById('phoneValue').textContent = '';
    document.getElementById('avatarInitials').textContent = '';

    // Hide avatar initially
    const avatar = document.getElementById('contactAvatar');
    avatar.classList.remove('animated');
    avatar.style.opacity = '0';
    avatar.style.transform = 'scale(0)';

    // Hide contact actions
    document.querySelector('.contact-actions').classList.remove('visible');

    // Clear tags
    tags = [];
    renderTags();

    // Collapse all expandable sections
    document.querySelectorAll('.contact-item.expanded').forEach(item => {
        item.classList.remove('expanded');
    });

    // Hide tags section
    const tagsSection = document.querySelector('.details-section:has(#tagsContainer)');
    if (tagsSection) {
        const content = tagsSection.querySelector('.section-content');
        if (content) content.style.display = 'none';
    }
}

// Start animation
async function startAnimation() {
    if (isAnimating) return;

    // Clear any existing timeouts
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];

    isAnimating = true;

    // Get values from preset fields
    const name = document.getElementById('presetName').value || 'John Smith';
    const email = document.getElementById('presetEmail').value || 'john.smith@company.com';
    const phone = document.getElementById('presetPhone').value || '+1 (555) 123-4567';
    const animationTags = document.getElementById('animationTags').value;
    const useTypewriter = document.getElementById('typewriterEffect').checked;
    const expandSections = document.getElementById('expandSections').checked;
    const addTagsOption = document.getElementById('addTags').checked;
    const speed = document.getElementById('animationSpeed').value;

    // Calculate delays based on speed
    let baseDelay = 500;
    let typeDelay = 50;
    switch(speed) {
        case 'slow':
            baseDelay = 1000;
            typeDelay = 100;
            break;
        case 'fast':
            baseDelay = 250;
            typeDelay = 25;
            break;
    }

    // Clear all fields first
    clearAllFields();

    // Wait a moment before starting
    await delay(baseDelay);

    // Step 1: Animate avatar appearance
    const avatar = document.getElementById('contactAvatar');
    const initials = getInitialsFromName(name);
    document.getElementById('avatarInitials').textContent = initials;
    avatar.classList.add('animated');

    await delay(baseDelay);

    // Step 2: Animate name
    const nameElement = document.getElementById('contactName');
    if (useTypewriter) {
        await typeWriter(nameElement, name, typeDelay);
    } else {
        nameElement.textContent = name;
    }

    await delay(baseDelay);

    // Step 3: Show action buttons
    document.querySelector('.contact-actions').classList.add('visible');

    await delay(baseDelay);

    // Step 4: Expand and fill email section
    if (expandSections) {
        const emailItem = document.querySelector('.contact-item:has(#emailValue)');
        emailItem.classList.add('expanded');
        await delay(baseDelay / 2);
    }

    const emailElement = document.getElementById('emailValue');
    if (useTypewriter) {
        await typeWriter(emailElement, email, typeDelay);
    } else {
        emailElement.textContent = email;
    }

    await delay(baseDelay);

    // Step 5: Expand and fill phone section
    if (expandSections) {
        const phoneItem = document.querySelector('.contact-item:has(#phoneValue)');
        phoneItem.classList.add('expanded');
        await delay(baseDelay / 2);
    }

    const phoneElement = document.getElementById('phoneValue');
    if (useTypewriter) {
        await typeWriter(phoneElement, phone, typeDelay);
    } else {
        phoneElement.textContent = phone;
    }

    await delay(baseDelay);

    // Step 6: Add tags if enabled
    if (addTagsOption && animationTags) {
        const tagsList = animationTags.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (tagsList.length > 0) {
            // Expand tags section
            const tagsSection = document.querySelector('.details-section:has(#tagsContainer)');
            if (tagsSection) {
                const titleElement = tagsSection.querySelector('.section-title');
                const content = tagsSection.querySelector('.section-content');
                if (titleElement) titleElement.classList.add('expanded');
                if (content) content.style.display = 'block';
            }

            // Add tags one by one with animation
            for (const tag of tagsList) {
                tags.push(tag);
                renderTags();
                await delay(baseDelay / 2);
            }
        }
    }

    isAnimating = false;
}

// Typewriter effect
function typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                const timeout = setTimeout(type, speed);
                animationTimeouts.push(timeout);
            } else {
                resolve();
            }
        }

        type();
    });
}

// Delay helper
function delay(ms) {
    return new Promise(resolve => {
        const timeout = setTimeout(resolve, ms);
        animationTimeouts.push(timeout);
    });
}

// Get initials from name
function getInitialsFromName(name) {
    const nameParts = name.trim().split(' ');
    let initials = '';

    if (nameParts.length >= 2) {
        initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
    } else if (nameParts.length === 1 && nameParts[0]) {
        initials = nameParts[0][0];
        if (nameParts[0].length > 1) {
            initials += nameParts[0][1];
        }
    }

    return initials.toUpperCase();
}

// Update initials preview (not used in main display during animation)
function updateInitialsFromName(name) {
    // This is just for preview purposes, not affecting the actual animation
}

// Toggle expand/collapse for contact items
function toggleExpand(element) {
    const contactItem = element.closest('.contact-item');
    contactItem.classList.toggle('expanded');
}

// Toggle section expand/collapse
function toggleSection(element) {
    const section = element.closest('.details-section');
    const content = section.querySelector('.section-content');
    element.classList.toggle('expanded');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

// Select avatar color
function selectAvatarColor(color) {
    currentAvatarColor = color;

    // Update avatar background
    document.getElementById('contactAvatar').style.background = color;

    // Update active state
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

// Remove tag
function removeTag(tagText) {
    tags = tags.filter(tag => tag !== tagText);
    renderTags();
}

// Render tags
function renderTags() {
    const container = document.getElementById('tagsContainer');

    // Render tags in contact card with staggered animation
    container.innerHTML = tags.map((tag, index) => `
        <div class="tag" style="animation-delay: ${index * 0.1}s">
            ${tag}
            <i class="fas fa-times" onclick="removeTag('${tag}')"></i>
        </div>
    `).join('');
}

// Load template
function loadTemplate(type) {
    switch(type) {
        case 'customer':
            document.getElementById('presetName').value = 'Sarah Johnson';
            document.getElementById('presetEmail').value = 'sarah.johnson@email.com';
            document.getElementById('presetPhone').value = '+1 (555) 123-4567';
            document.getElementById('animationTags').value = 'Customer, Premium, Active';
            selectAvatarColor('#4ECDC4');
            break;

        case 'lead':
            document.getElementById('presetName').value = 'Michael Chen';
            document.getElementById('presetEmail').value = 'm.chen@techcorp.io';
            document.getElementById('presetPhone').value = '+1 (555) 987-6543';
            document.getElementById('animationTags').value = 'Lead, Hot, Enterprise';
            selectAvatarColor('#F38181');
            break;

        case 'vip':
            document.getElementById('presetName').value = 'Alexandra Martinez';
            document.getElementById('presetEmail').value = 'alex@vipcompany.com';
            document.getElementById('presetPhone').value = '+1 (555) 555-0100';
            document.getElementById('animationTags').value = 'VIP, Priority, Gold';
            selectAvatarColor('#AA96DA');
            break;

        case 'support':
            document.getElementById('presetName').value = 'David Wilson';
            document.getElementById('presetEmail').value = 'd.wilson@support.net';
            document.getElementById('presetPhone').value = '+1 (555) 111-2222';
            document.getElementById('animationTags').value = 'Support, Ticket #1234, Urgent';
            selectAvatarColor('#556270');
            break;
    }
}

// Reset simulator
function resetSimulator() {
    // Stop any ongoing animations
    isAnimating = false;
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];

    // Clear all fields
    clearAllFields();

    // Reset preset fields to defaults
    document.getElementById('presetName').value = 'John Smith';
    document.getElementById('presetEmail').value = 'john.smith@company.com';
    document.getElementById('presetPhone').value = '+1 (555) 123-4567';
    document.getElementById('animationTags').value = 'New Lead, Hot, Priority';

    // Reset checkboxes
    document.getElementById('typewriterEffect').checked = true;
    document.getElementById('expandSections').checked = true;
    document.getElementById('addTags').checked = true;

    // Reset speed
    document.getElementById('animationSpeed').value = 'medium';

    // Reset avatar color
    selectAvatarColor('#FF6B35');
}