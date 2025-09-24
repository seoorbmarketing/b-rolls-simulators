// Navigation Fix - Ensure all navigation works properly
// This runs after script.js to fix any navigation issues
(function() {
    console.log('Navigation fix loading...');

    // Wait for the main script to finish
    function fixNavigation() {
        // Get all navigation items
        const navItems = document.querySelectorAll('.nav-item[data-screen]');
        const screenSwitchBtns = document.querySelectorAll('.screen-switch-btn');

        console.log('Navigation fix - Found nav items:', navItems.length);
        console.log('Navigation fix - Found screen switch buttons:', screenSwitchBtns.length);

        // Re-attach click handlers to navigation items
        navItems.forEach(item => {
            // Clone and replace to remove all existing listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });

        // Get the newly cloned items
        const newNavItems = document.querySelectorAll('.nav-item[data-screen]');

        // Add fresh click handlers
        newNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const screen = this.getAttribute('data-screen');
                console.log('Navigation fix - Nav clicked, switching to:', screen);

                // Use the global switchToScreen function
                if (typeof window.switchToScreen === 'function') {
                    window.switchToScreen(screen);
                } else {
                    console.error('Navigation fix - switchToScreen function not found');
                }
            });
        });

        // Fix control panel buttons
        screenSwitchBtns.forEach(btn => {
            // Clone and replace to remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Get newly cloned buttons
        const newScreenSwitchBtns = document.querySelectorAll('.screen-switch-btn');

        // Add fresh click handlers
        newScreenSwitchBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const panel = this.getAttribute('data-panel');
                console.log('Navigation fix - Control panel button clicked:', panel);

                // Update button states
                newScreenSwitchBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Map panel names to screen names
                const screenMap = {
                    'calendar': 'calendar',
                    'conversation': 'conversations',
                    'opportunities': 'opportunities',
                    'automation': 'automation',
                    'forms': 'forms'
                };

                const screenName = screenMap[panel];
                if (screenName && typeof window.switchToScreen === 'function') {
                    window.switchToScreen(screenName);
                }

                // Also handle control panel visibility
                const calendarControls = document.getElementById('calendar-controls');
                const conversationControls = document.getElementById('conversation-controls');
                const opportunitiesControls = document.getElementById('opportunities-controls');
                const automationControls = document.getElementById('automation-controls');
                const formsControls = document.getElementById('forms-controls');

                // Hide all control panels
                if (calendarControls) calendarControls.style.display = 'none';
                if (conversationControls) conversationControls.style.display = 'none';
                if (opportunitiesControls) opportunitiesControls.style.display = 'none';
                if (automationControls) automationControls.style.display = 'none';
                if (formsControls) formsControls.style.display = 'none';

                // Show the appropriate control panel
                switch(panel) {
                    case 'calendar':
                        if (calendarControls) calendarControls.style.display = 'block';
                        break;
                    case 'conversation':
                        if (conversationControls) conversationControls.style.display = 'block';
                        break;
                    case 'opportunities':
                        if (opportunitiesControls) opportunitiesControls.style.display = 'block';
                        break;
                    case 'automation':
                        if (automationControls) automationControls.style.display = 'block';
                        break;
                    case 'forms':
                        if (formsControls) formsControls.style.display = 'block';
                        break;
                }
            });
        });

        console.log('Navigation fix applied successfully');
    }

    // Try to fix navigation immediately if DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Small delay to ensure script.js has finished
        setTimeout(fixNavigation, 200);
    } else {
        // Otherwise wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixNavigation, 200);
        });
    }
})();