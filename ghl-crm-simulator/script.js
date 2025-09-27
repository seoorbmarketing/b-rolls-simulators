// Calendar functionality

// Global function to switch screens - defined before DOMContentLoaded
function switchToScreen(screenName) {
    console.log("switchToScreen called with:", screenName);

    // Get all necessary elements
    const calendarScreen = document.getElementById("calendar-screen");
    const conversationsScreen = document.getElementById("conversations-screen");
    const opportunitiesScreen = document.getElementById("opportunities-screen");
    const automationScreen = document.getElementById("automation-screen");
    const formsScreen = document.getElementById("forms-screen");
    const rightPanel = document.querySelector(".right-panel");
    const navItems = document.querySelectorAll(".nav-item[data-screen]");
    const screenSwitchBtns = document.querySelectorAll(".screen-switch-btn");
    const browserUrl = document.getElementById("browserUrl");

    // Hide all screens
    if (calendarScreen) calendarScreen.style.display = "none";
    if (conversationsScreen) conversationsScreen.style.display = "none";
    if (opportunitiesScreen) opportunitiesScreen.style.display = "none";
    if (automationScreen) automationScreen.style.display = "none";
    if (formsScreen) formsScreen.style.display = "none";
    const paymentsScreen = document.getElementById("payments-screen");
    if (paymentsScreen) paymentsScreen.style.display = "none";

    // Update nav items
    navItems.forEach(nav => nav.classList.remove("active"));

    // Update control panel button states
    screenSwitchBtns.forEach(btn => btn.classList.remove("active"));

    // Get navigation elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainWrapper = document.querySelector('.main-wrapper');
    const topNav = document.querySelector('.top-nav');

    // Switch to the requested screen and update URL
    if (screenName === "calendar") {
        // Show sidebar and top nav for calendar
        if (sidebar) sidebar.style.display = "block";
        if (sidebarToggle) sidebarToggle.style.display = "block";
        if (topNav) topNav.style.display = "flex";
        if (mainWrapper && !sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = "180px";
        }

        if (calendarScreen) calendarScreen.style.display = "block";
        if (rightPanel) rightPanel.style.display = "block";

        // Show calendar panel content
        const calendarPanelContent = document.getElementById('calendar-panel-content');
        if (calendarPanelContent) calendarPanelContent.style.display = 'block';

        // Hide all control panels first
        document.querySelectorAll('.control-panel-screen').forEach(panel => {
            panel.style.display = 'none';
        });
        // Show calendar controls
        const calendarControls = document.getElementById('calendar-controls');
        if (calendarControls) calendarControls.style.display = 'block';

        const calendarNav = document.querySelector('.nav-item[data-screen="calendar"]');
        if (calendarNav) calendarNav.classList.add("active");
        const calendarBtn = document.querySelector('.screen-switch-btn[data-panel="calendar"]');
        if (calendarBtn) calendarBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/calendar";
    } else if (screenName === "conversations") {
        // Show sidebar and top nav for conversations
        if (sidebar) sidebar.style.display = "block";
        if (sidebarToggle) sidebarToggle.style.display = "block";
        if (topNav) topNav.style.display = "flex";
        if (mainWrapper && !sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = "180px";
        }

        if (conversationsScreen) conversationsScreen.style.display = "block";
        if (rightPanel) rightPanel.style.display = "none";

        // Hide calendar panel content
        const calendarPanelContent = document.getElementById('calendar-panel-content');
        if (calendarPanelContent) calendarPanelContent.style.display = 'none';
        const conversationNav = document.querySelector('.nav-item[data-screen="conversations"]');
        if (conversationNav) conversationNav.classList.add("active");
        const conversationBtn = document.querySelector('.screen-switch-btn[data-panel="conversation"]');
        if (conversationBtn) conversationBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/conversations";
        // Initialize if needed
        if (!window.conversationsInitialized) {
            if (typeof initializeConversations === "function") {
                initializeConversations();
                window.conversationsInitialized = true;
            }
        }
    } else if (screenName === "opportunities") {
        // Show sidebar and top nav for opportunities
        if (sidebar) sidebar.style.display = "block";
        if (sidebarToggle) sidebarToggle.style.display = "block";
        if (topNav) topNav.style.display = "flex";
        if (mainWrapper && !sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = "180px";
        }

        if (opportunitiesScreen) opportunitiesScreen.style.display = "block";
        if (rightPanel) rightPanel.style.display = "none";

        // Hide calendar panel content
        const calendarPanelContent = document.getElementById('calendar-panel-content');
        if (calendarPanelContent) calendarPanelContent.style.display = 'none';
        const opportunitiesNav = document.querySelector('.nav-item[data-screen="opportunities"]');
        if (opportunitiesNav) opportunitiesNav.classList.add("active");
        const opportunitiesBtn = document.querySelector('.screen-switch-btn[data-panel="opportunities"]');
        if (opportunitiesBtn) opportunitiesBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/opportunities";
        // Initialize if needed
        if (!window.opportunitiesInitialized) {
            if (typeof initializeOpportunities === "function") {
                initializeOpportunities();
                window.opportunitiesInitialized = true;
            }
        }
    } else if (screenName === "automation") {
        // Hide sidebar and top nav for automation screen
        if (sidebar) sidebar.style.display = "none";
        if (sidebarToggle) sidebarToggle.style.display = "none";
        if (topNav) topNav.style.display = "none";
        if (mainWrapper) mainWrapper.style.marginLeft = "0";

        if (automationScreen) automationScreen.style.display = "block";
        if (rightPanel) rightPanel.style.display = "none";
        const automationNav = document.querySelector('.nav-item[data-screen="automation"]');
        if (automationNav) automationNav.classList.add("active");
        const automationBtn = document.querySelector('.screen-switch-btn[data-panel="automation"]');
        if (automationBtn) automationBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/automation";

        // Initialize scenario list when switching to automation
        setTimeout(() => {
            updateAutomationScenarioList();
            // Reset zoom when switching to automation
            resetZoom();
        }, 100);
    } else if (screenName === "payments") {
        // Show sidebar and top nav for payments
        if (sidebar) sidebar.style.display = "block";
        if (sidebarToggle) sidebarToggle.style.display = "block";
        if (topNav) topNav.style.display = "none"; // Hide top nav for payments
        if (mainWrapper && !sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = "180px";
        }

        // Show payments screen
        const paymentsScreen = document.getElementById("payments-screen");
        if (paymentsScreen) paymentsScreen.style.display = "flex";
        // Don't show the right panel for payments
        if (rightPanel) rightPanel.style.display = "none";

        // Show payments controls
        document.querySelectorAll('.control-panel-screen').forEach(panel => {
            panel.style.display = 'none';
        });
        const paymentsControls = document.getElementById('payments-controls');
        if (paymentsControls) paymentsControls.style.display = 'block';

        // Update active state
        const paymentsNav = document.querySelector('.nav-item[data-screen="payments"]');
        if (paymentsNav) paymentsNav.classList.add("active");
        const paymentsBtn = document.querySelector('.screen-switch-btn[data-panel="payments"]');
        if (paymentsBtn) paymentsBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/payments/invoices";
    } else if (screenName === "forms") {
        // Show sidebar and top nav for forms
        if (sidebar) sidebar.style.display = "block";
        if (sidebarToggle) sidebarToggle.style.display = "block";
        if (topNav) topNav.style.display = "flex";
        if (mainWrapper && !sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = "180px";
        }

        if (formsScreen) formsScreen.style.display = "block";
        if (rightPanel) rightPanel.style.display = "none";

        // Hide calendar panel content
        const calendarPanelContent = document.getElementById('calendar-panel-content');
        if (calendarPanelContent) calendarPanelContent.style.display = 'none';
        const formsNav = document.querySelector('.nav-item[data-screen="forms"]');
        if (formsNav) formsNav.classList.add("active");
        const formsBtn = document.querySelector('.screen-switch-btn[data-panel="forms"]');
        if (formsBtn) formsBtn.classList.add("active");
        if (browserUrl) browserUrl.textContent = "app.automatemybiz.pro/forms";
    }

    // Update control panels - hide all first, then show the active one
    const calendarControls = document.getElementById("calendar-controls");
    const conversationControls = document.getElementById("conversation-controls");
    const opportunitiesControls = document.getElementById("opportunities-controls");
    const automationControls = document.getElementById("automation-controls");
    const formsControls = document.getElementById("forms-controls");

    // Hide all control panels first
    if (calendarControls) calendarControls.style.display = "none";
    if (conversationControls) conversationControls.style.display = "none";
    if (opportunitiesControls) opportunitiesControls.style.display = "none";
    if (automationControls) automationControls.style.display = "none";
    if (formsControls) formsControls.style.display = "none";

    // Show the appropriate control panel
    if (screenName === "calendar" && calendarControls) {
        calendarControls.style.display = "block";
    } else if (screenName === "conversations" && conversationControls) {
        conversationControls.style.display = "block";
    } else if (screenName === "opportunities" && opportunitiesControls) {
        opportunitiesControls.style.display = "block";
    } else if (screenName === "automation" && automationControls) {
        automationControls.style.display = "block";
    } else if (screenName === "forms" && formsControls) {
        formsControls.style.display = "block";
    }

    // Update control panel buttons
    screenSwitchBtns.forEach((btn, index) => {
        if (screenName === "calendar" && index === 0) btn.classList.add("active");
        else if (screenName === "conversations" && index === 1) btn.classList.add("active");
        else if (screenName === "opportunities" && index === 2) btn.classList.add("active");
        else if (screenName === "automation" && index === 3) btn.classList.add("active");
        else if (screenName === "forms" && index === 4) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

// Workflow Animation Functions
window.workflowNodes = [];
let currentNodeIndex = 0;
let animationSpeed = 'normal';

const nodeTypes = {
    wait: { icon: 'fas fa-clock', color: 'purple', label: 'Wait' },
    call: { icon: 'fas fa-phone', color: 'green', label: 'Call' },
    sms: { icon: 'fas fa-comment-dots', color: 'blue', label: 'SMS' },
    email: { icon: 'fas fa-envelope', color: 'orange', label: 'Email' },
    user: { icon: 'fas fa-user-check', color: 'teal', label: 'Assign User' },
    webhook: { icon: 'fas fa-link', color: 'indigo', label: 'Webhook' },
    condition: { icon: 'fas fa-code-branch', color: 'yellow', label: 'If/Else' },
    tag: { icon: 'fas fa-tag', color: 'pink', label: 'Add Tag' }
};

function startWorkflowAnimation() {
    const speedSelect = document.getElementById('animationSpeed');
    animationSpeed = speedSelect ? speedSelect.value : 'normal';

    // Toggle button visibility
    const startBtn = document.getElementById('startAnimationBtn');
    const stopBtn = document.getElementById('stopAnimationBtn');
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'block';

    // Reset workflow
    resetWorkflow();

    // Start animation sequence
    animateNextNode();
}

function resetWorkflow() {
    console.log('Resetting workflow canvas, keeping scenario nodes:', window.workflowNodes);

    // Remove all nodes except trigger
    const workflowBuilder = document.querySelector('.workflow-builder');
    if (!workflowBuilder) return;

    // Remove all dynamically added nodes
    const dynamicNodes = workflowBuilder.querySelectorAll('.dynamic-node');
    dynamicNodes.forEach(node => {
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });

    // Keep original structure intact
    const firstAddBtn = document.getElementById('addNode1');
    if (firstAddBtn) {
        firstAddBtn.style.display = 'flex';
        // Remove any nodes after the first add button
        let nextSibling = firstAddBtn.nextSibling;
        while (nextSibling) {
            let toRemove = nextSibling;
            nextSibling = nextSibling.nextSibling;
            if (toRemove.nodeType === 1) { // Element node
                toRemove.parentNode.removeChild(toRemove);
            }
        }
    }

    // Reset the animation index to start from the beginning
    currentNodeIndex = 0;

    console.log('Canvas reset complete. Ready to animate', window.workflowNodes.length, 'nodes');
}

function animateNextNode() {
    console.log(`Animating node ${currentNodeIndex} of ${window.workflowNodes.length}`);

    if (currentNodeIndex >= window.workflowNodes.length) {
        console.log('All nodes animated, adding END node');
        // Add end node
        window.animationTimeout = setTimeout(() => {
            addEndNode();
            // Reset buttons when animation completes
            const startBtn = document.getElementById('startAnimationBtn');
            const stopBtn = document.getElementById('stopAnimationBtn');
            if (startBtn) startBtn.style.display = 'block';
            if (stopBtn) stopBtn.style.display = 'none';
        }, getAnimationDelay());
        return;
    }

    const node = window.workflowNodes[currentNodeIndex];
    console.log(`Animating node:`, node);

    window.animationTimeout = setTimeout(() => {
        addWorkflowNode(node);
        currentNodeIndex++;
        animateNextNode();
    }, getAnimationDelay());
}

function getAnimationDelay() {
    const delays = {
        fast: 500,
        normal: 1000,
        slow: 1500
    };
    return delays[animationSpeed] || 1000;
}

function addWorkflowNode(nodeData) {
    const workflowBuilder = document.querySelector('.workflow-builder');
    if (!workflowBuilder) return;

    const nodeType = nodeTypes[nodeData.type] || nodeTypes.user;

    // Create node element
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'workflow-node action-node dynamic-node';
    nodeDiv.style.opacity = '0';
    nodeDiv.innerHTML = `
        <div class="node-header ${nodeData.type}">
            <i class="${nodeType.icon}"></i>
            <span>${nodeData.label || nodeType.label}</span>
            <button class="node-menu">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
    `;

    // Add connection line
    const connectionLine = document.createElement('div');
    connectionLine.className = 'connection-line vertical dynamic-node';
    connectionLine.style.opacity = '0';

    // Add next add button
    const addBtn = document.createElement('div');
    addBtn.className = 'add-node-btn dynamic-node';
    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addBtn.style.opacity = '0';

    // Find where to insert - after the last visible add button or at the end
    const allAddBtns = workflowBuilder.querySelectorAll('.add-node-btn');
    let insertPoint = null;

    // Find the last visible add button
    for (let i = allAddBtns.length - 1; i >= 0; i--) {
        if (allAddBtns[i].style.display !== 'none') {
            insertPoint = allAddBtns[i];
            break;
        }
    }

    if (insertPoint) {
        insertPoint.style.display = 'none';
        insertPoint.parentNode.insertBefore(nodeDiv, insertPoint.nextSibling);
        nodeDiv.parentNode.insertBefore(connectionLine, nodeDiv.nextSibling);
        connectionLine.parentNode.insertBefore(addBtn, connectionLine.nextSibling);
    } else {
        // Fallback: append to workflow builder
        workflowBuilder.appendChild(nodeDiv);
        workflowBuilder.appendChild(connectionLine);
        workflowBuilder.appendChild(addBtn);
    }

    // Animate in with sound
    setTimeout(() => {
        // Play click sound when node appears
        const clickSound = document.getElementById('clickSound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Sound play failed:', e));
        }

        nodeDiv.style.transition = 'opacity 0.3s';
        nodeDiv.style.opacity = '1';
        connectionLine.style.transition = 'opacity 0.3s';
        connectionLine.style.opacity = '1';
        addBtn.style.transition = 'opacity 0.3s';
        addBtn.style.opacity = '1';
    }, 100);
}

function addEndNode() {
    const workflowBuilder = document.querySelector('.workflow-builder');
    if (!workflowBuilder) return;

    // Hide all add buttons
    const allAddBtns = workflowBuilder.querySelectorAll('.add-node-btn');
    allAddBtns.forEach(btn => btn.style.display = 'none');

    // Add final connection and end node
    const connectionLine = document.createElement('div');
    connectionLine.className = 'connection-line vertical dynamic-node';
    connectionLine.style.opacity = '0';

    const endNode = document.createElement('div');
    endNode.className = 'workflow-node end-node dynamic-node';
    endNode.style.opacity = '0';
    endNode.innerHTML = '<div class="node-content"><span>END</span></div>';

    workflowBuilder.appendChild(connectionLine);
    workflowBuilder.appendChild(endNode);

    setTimeout(() => {
        // Play click sound when END node appears
        const clickSound = document.getElementById('clickSound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Sound play failed:', e));
        }

        connectionLine.style.transition = 'opacity 0.3s';
        connectionLine.style.opacity = '1';
        endNode.style.transition = 'opacity 0.3s';
        endNode.style.opacity = '1';
    }, 100);
}

// Removed template loading function

function addNodeToScenario() {
    console.log('=== addNodeToScenario called ===');

    try {
        // Debug: Check if we're on the right screen
        const automationControls = document.getElementById('automation-controls');
        console.log('Automation controls visible:', automationControls && automationControls.style.display !== 'none');

        const typeSelect = document.getElementById('nodeTypeSelect');
        const labelInput = document.getElementById('nodeLabel');

        console.log('Type select found:', !!typeSelect);
        console.log('Label input found:', !!labelInput);

        if (!typeSelect || !labelInput) {
            console.error('ERROR: Required elements not found!');
            console.log('typeSelect:', typeSelect);
            console.log('labelInput:', labelInput);
            alert('Error: Cannot find required form elements. Please refresh the page.');
            return;
        }

        const type = typeSelect.value;
        const label = labelInput.value.trim() || nodeTypes[type].label;

        console.log('Node type:', type);
        console.log('Node label:', label);
        console.log('Current workflow nodes before adding:', JSON.stringify(window.workflowNodes));
        console.log('Array length before push:', window.workflowNodes.length);

        // Create the new node
        const newNode = { type, label };
        console.log('Creating new node:', JSON.stringify(newNode));

        // Add the node to the array
        const newLength = window.workflowNodes.push(newNode);
        console.log('Push returned new length:', newLength);

        console.log('Array length after push:', window.workflowNodes.length);
        console.log('Current workflow nodes after adding:', JSON.stringify(window.workflowNodes));

        // Clear the input field
        labelInput.value = '';

        console.log('About to call updateScenarioList...');
        console.log('typeof updateScenarioList:', typeof updateScenarioList);
        console.log('typeof window.updateScenarioList:', typeof window.updateScenarioList);

        // Call the automation-specific update function
        console.log('Calling updateAutomationScenarioList()...');
        updateAutomationScenarioList();
        console.log('updateScenarioList call completed');
    } catch (error) {
        console.error('ERROR in addNodeToScenario:', error);
        alert('Error adding node: ' + error.message);
    }
}

function updateAutomationScenarioList() {
    console.log('=== updateAutomationScenarioList called ===');
    console.log('Nodes to display:', window.workflowNodes);

    const scenarioList = document.getElementById('scenarioList');
    console.log('Scenario list element found:', !!scenarioList);

    if (!scenarioList) {
        console.error('ERROR: scenarioList element not found!');
        // Try to find it with a different method
        const allScenarioLists = document.querySelectorAll('#scenarioList');
        console.log('Found scenario lists with querySelectorAll:', allScenarioLists.length);
        return;
    }

    console.log('Clearing scenario list...');
    scenarioList.innerHTML = '';

    if (window.workflowNodes.length === 0) {
        scenarioList.innerHTML = '<div style="text-align: center; color: #999; padding: 10px; font-size: 11px;">No actions added yet</div>';
        return;
    }

    window.workflowNodes.forEach((node, index) => {
        console.log(`Adding node ${index}:`, node);
        const nodeType = nodeTypes[node.type] || nodeTypes.user;
        const item = document.createElement('div');
        item.style.cssText = 'padding: 5px; margin: 2px 0; background: #f3f4f6; border-radius: 4px; font-size: 11px; display: flex; align-items: center; gap: 5px;';
        item.innerHTML = `
            <i class="${nodeType.icon}" style="color: ${getNodeColor(node.type)}; font-size: 10px;"></i>
            <span style="flex: 1;">${node.label}</span>
            <button onclick="removeNodeFromScenario(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 2px;">
                <i class="fas fa-times" style="font-size: 10px;"></i>
            </button>
        `;
        scenarioList.appendChild(item);
    });
    console.log(`Scenario list updated successfully with ${window.workflowNodes.length} items`);
}

function removeNodeFromScenario(index) {
    window.workflowNodes.splice(index, 1);
    updateAutomationScenarioList();
}

function clearScenario() {
    window.workflowNodes = [];
    updateAutomationScenarioList();
}

function stopWorkflowAnimation() {
    if (window.animationTimeout) {
        clearTimeout(window.animationTimeout);
        window.animationTimeout = null;
    }

    // Toggle button visibility
    const startBtn = document.getElementById('startAnimationBtn');
    const stopBtn = document.getElementById('stopAnimationBtn');
    if (startBtn) startBtn.style.display = 'block';
    if (stopBtn) stopBtn.style.display = 'none';
}

// Removed second template loading function

function getNodeColor(type) {
    const colors = {
        wait: '#6d28d9',
        call: '#059669',
        sms: '#1e40af',
        email: '#c2410c',
        user: '#0f766e',
        webhook: '#4338ca',
        condition: '#a16207',
        tag: '#be185d'
    };
    return colors[type] || '#374151';
}

// Make functions globally available
window.switchToScreen = switchToScreen;
window.renderOpportunityCards = renderOpportunityCards;
window.updateStageCounters = updateStageCounters;
window.initializeOpportunities = initializeOpportunities;
window.startAnimatedMove = startAnimatedMove;
window.startWorkflowAnimation = startWorkflowAnimation;
window.resetWorkflow = resetWorkflow;
window.addNodeToScenario = addNodeToScenario;
window.updateAutomationScenarioList = updateAutomationScenarioList;
window.removeNodeFromScenario = removeNodeFromScenario;
window.clearScenario = clearScenario;
window.playScenario = playScenario;
window.stopScenario = stopScenario;
window.saveCustomScenario = saveCustomScenario;
window.loadSavedScenarios = loadSavedScenarios;
window.loadScenario = loadScenario;
window.deleteScenario = deleteScenario;
window.updateScenarioList = updateScenarioList;
window.renderScenarioList = renderScenarioList;
// window.removeScenarioStep = removeScenarioStep; // Will be defined later
window.removeStep = removeStep;
window.moveStep = moveStep;
window.clearConversations = clearConversations;

// Update trigger function
window.updateTrigger = function() {
    const triggerName = document.getElementById('triggerName');

    if (!triggerName) return;

    // Find the trigger node
    const triggerNode = document.querySelector('.trigger-node');
    if (triggerNode) {
        const titleElement = triggerNode.querySelector('.node-title');

        if (titleElement) {
            titleElement.textContent = triggerName.value || 'Contact Created';
        }
    }

    console.log('Trigger updated:', triggerName.value);
};

// Test function to verify scenario builder is working
window.testScenarioBuilder = function() {
    console.log('=== Testing Scenario Builder ===');

    // Add a test node
    window.workflowNodes.push({ type: 'email', label: 'Test Email Action' });

    // Update the list
    updateAutomationScenarioList();

    console.log('Test complete. Check if "Test Email Action" appears in the scenario list.');
};

// Zoom functionality for workflow canvas
let currentZoom = 100;
const ZOOM_STEP = 10;
const MIN_ZOOM = 50;
const MAX_ZOOM = 150;

function updateZoomLevel(newZoom) {
    // Clamp zoom level between min and max
    currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    // Update zoom level display
    const zoomLevelElement = document.querySelector('.zoom-level');
    if (zoomLevelElement) {
        zoomLevelElement.textContent = currentZoom + '%';
    }

    // Apply zoom to workflow builder
    const workflowBuilder = document.querySelector('.workflow-builder');
    if (workflowBuilder) {
        const scale = currentZoom / 100;
        workflowBuilder.style.transform = `scale(${scale})`;
        workflowBuilder.style.transformOrigin = 'top center';
    }

    console.log('Zoom updated to:', currentZoom + '%');
}

window.zoomIn = function() {
    updateZoomLevel(currentZoom + ZOOM_STEP);
};

window.zoomOut = function() {
    updateZoomLevel(currentZoom - ZOOM_STEP);
};

window.resetZoom = function() {
    updateZoomLevel(100);
};

document.addEventListener('DOMContentLoaded', function() {
    // Load saved stage names on page load
    loadSavedStageNames();
    // Load saved pipeline name on page load
    loadSavedPipelineName();

    // Get common elements
    const calendarScreen = document.getElementById('calendar-screen');
    const conversationsScreen = document.getElementById('conversations-screen');
    const rightPanel = document.querySelector('.right-panel');
    const navItems = document.querySelectorAll('.nav-item[data-screen]');
    
    // Control Panel Screen Switching
    const screenSwitchBtns = document.querySelectorAll('.screen-switch-btn');
    const calendarControls = document.getElementById('calendar-controls');
    const conversationControls = document.getElementById('conversation-controls');
    const opportunitiesControls = document.getElementById('opportunities-controls');
    const opportunitiesScreen = document.getElementById('opportunities-screen');
    
    screenSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.getAttribute('data-panel');

            // Update button states
            screenSwitchBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Switch control panels
            if (panel === 'calendar') {
                calendarControls.style.display = 'block';
                conversationControls.style.display = 'none';
                if (opportunitiesControls) opportunitiesControls.style.display = 'none';

                // Use global switchToScreen function which handles URL update
                switchToScreen('calendar');

            } else if (panel === 'conversation') {
                calendarControls.style.display = 'none';
                conversationControls.style.display = 'block';
                if (opportunitiesControls) opportunitiesControls.style.display = 'none';

                // Use global switchToScreen function which handles URL update
                switchToScreen('conversations');

            } else if (panel === 'opportunities') {
                calendarControls.style.display = 'none';
                conversationControls.style.display = 'none';
                if (opportunitiesControls) opportunitiesControls.style.display = 'block';

                // Use global switchToScreen function which handles URL update
                switchToScreen('opportunities');
            } else if (panel === 'automation') {
                calendarControls.style.display = 'none';
                conversationControls.style.display = 'none';
                if (opportunitiesControls) opportunitiesControls.style.display = 'none';
                const formsControls = document.getElementById('forms-controls');
                if (formsControls) formsControls.style.display = 'none';
                const automationControls = document.getElementById('automation-controls');
                if (automationControls) automationControls.style.display = 'block';

                // Use global switchToScreen function which handles URL update
                switchToScreen('automation');
            } else if (panel === 'forms') {
                calendarControls.style.display = 'none';
                conversationControls.style.display = 'none';
                if (opportunitiesControls) opportunitiesControls.style.display = 'none';
                const automationControls = document.getElementById('automation-controls');
                if (automationControls) automationControls.style.display = 'none';
                const formsControls = document.getElementById('forms-controls');
                if (formsControls) formsControls.style.display = 'block';

                // Use global switchToScreen function which handles URL update
                switchToScreen('forms');
            }
        });
    });

    // Initialize automation screen if we're on it
    if (document.getElementById('automation-screen') && document.getElementById('automation-screen').style.display !== 'none') {
        console.log('Automation screen is visible, functions ready');
    }
    
    // Screen switching functionality
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                const screen = this.getAttribute('data-screen');
                console.log('Nav click - Switching to screen:', screen);

                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                // Hide all screens first
                if (calendarScreen) calendarScreen.style.display = 'none';
                if (conversationsScreen) conversationsScreen.style.display = 'none';
                if (opportunitiesScreen) opportunitiesScreen.style.display = 'none';
                const automationScreen = document.getElementById('automation-screen');
                if (automationScreen) automationScreen.style.display = 'none';
                const formsScreen = document.getElementById('forms-screen');
                if (formsScreen) formsScreen.style.display = 'none';
                const paymentsScreen = document.getElementById('payments-screen');
                if (paymentsScreen) paymentsScreen.style.display = 'none';

                // Switch screens
                if (screen === 'calendar') {
                    console.log('Showing calendar screen');
                    if (calendarScreen) calendarScreen.style.display = 'block';
                    if (rightPanel) rightPanel.style.display = 'block';

                    // Switch control panel too
                    if (screenSwitchBtns && screenSwitchBtns[0]) {
                        screenSwitchBtns[0].click();
                    }
                } else if (screen === 'conversations') {
                    console.log('Showing conversations screen');
                    if (conversationsScreen) conversationsScreen.style.display = 'block';
                    if (rightPanel) rightPanel.style.display = 'none';

                    // Initialize conversation functionality if not already done
                    if (!window.conversationsInitialized) {
                        console.log('Initializing conversations');
                        initializeConversations();
                        window.conversationsInitialized = true;
                    }

                    // Switch control panel too
                    if (screenSwitchBtns && screenSwitchBtns[1]) {
                        screenSwitchBtns[1].click();
                    }
                } else if (screen === 'opportunities') {
                    console.log('Showing opportunities screen');
                    if (opportunitiesScreen) opportunitiesScreen.style.display = 'block';
                    if (rightPanel) rightPanel.style.display = 'none';

                    // Initialize opportunities functionality if not already done
                    if (!window.opportunitiesInitialized) {
                        console.log('Initializing opportunities');
                        initializeOpportunities();
                        window.opportunitiesInitialized = true;
                    }

                    // Switch control panel too
                    if (screenSwitchBtns && screenSwitchBtns[2]) {
                        screenSwitchBtns[2].click();
                    }
                } else if (screen === 'automation') {
                    console.log('Showing automation screen');
                    const automationScreen = document.getElementById('automation-screen');
                    if (automationScreen) automationScreen.style.display = 'block';
                    if (rightPanel) rightPanel.style.display = 'none';

                    // Switch control panel too
                    if (screenSwitchBtns && screenSwitchBtns[3]) {
                        screenSwitchBtns[3].click();
                    }
                } else if (screen === 'forms') {
                    console.log('Showing forms screen');
                    const formsScreen = document.getElementById('forms-screen');
                    if (formsScreen) formsScreen.style.display = 'block';
                    if (rightPanel) rightPanel.style.display = 'none';

                    // Switch control panel if button exists
                    if (screenSwitchBtns && screenSwitchBtns[4]) {
                        screenSwitchBtns[4].click();
                    }
                } else if (screen === 'payments') {
                    console.log('Showing payments screen');
                    if (window.switchToScreen) {
                        window.switchToScreen('payments');
                    }
                }
            } catch (error) {
                console.error('Error switching screens:', error);
            }
        });
    });
    
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainWrapper = document.querySelector('.main-wrapper');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                mainWrapper.style.marginLeft = '0';
                sidebarToggle.style.left = '5px';
                sidebarToggle.querySelector('i').style.transform = 'rotate(180deg)';
            } else {
                mainWrapper.style.marginLeft = '180px';
                sidebarToggle.style.left = '155px';
                sidebarToggle.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
    }
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Panel tab switching
    const panelTabs = document.querySelectorAll('.panel-tab');
    panelTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            panelTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // View buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // User selection
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
    
    // Add click handlers for hour slots
    setupHourSlotClickHandlers();

    // Prevent checkbox click from triggering item click
    const checkboxes = document.querySelectorAll('.user-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.user-item');
            if (this.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    });

    // Calendar navigation
    const prevBtn = document.querySelector('.nav-arrow:first-child');
    const nextBtn = document.querySelector('.nav-arrow:last-child');
    const todayBtn = document.querySelector('.today-btn');
    const dateRange = document.querySelector('.date-range');
    
    let currentWeek = new Date();
    
    function updateDateRange() {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        const startStr = startOfWeek.toLocaleDateString('en-US', options);
        const endStr = endOfWeek.toLocaleDateString('en-US', options);
        const year = endOfWeek.getFullYear();
        
        dateRange.textContent = `${startStr} - ${endStr}, ${year}`;
        
        // Update day headers
        const dayHeaders = document.querySelectorAll('.day-header');
        dayHeaders.forEach((header, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            
            const dayNumber = header.querySelector('.day-number');
            const dayName = header.querySelector('.day-name');
            
            if (dayNumber) {
                dayNumber.textContent = date.getDate().toString().padStart(2, '0');
            }
            
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            if (dayName) {
                dayName.textContent = dayNames[date.getDay()];
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentWeek.setDate(currentWeek.getDate() - 7);
            updateDateRange();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentWeek.setDate(currentWeek.getDate() + 7);
            updateDateRange();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            currentWeek = new Date();
            updateDateRange();
        });
    }
    
    // Initialize date range
    updateDateRange();

    // Initialize conversation chat header time with current time
    const chatTimeSpan = document.querySelector('.last-message-time');
    if (chatTimeSpan) {
        // Set initial time display to current time
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        chatTimeSpan.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}, ${hours}:${minutesStr} ${ampm}`;
    }

    // Initialize conversation sample data immediately to get correct dates
    if (!window.conversationsInitialized) {
        initializeSampleConversations();
        // Don't set conversationsInitialized to true here, let the normal flow handle that
    }

    // New appointment button
    const newBtn = document.querySelector('.new-btn');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            alert('New appointment functionality would open here');
        });
    }

    // Chat widget
    const chatWidget = document.querySelector('.chat-widget');
    if (chatWidget) {
        chatWidget.addEventListener('click', function() {
            alert('Chat support would open here');
        });
    }

    // Initialize card animation controls for opportunities if function exists
    if (typeof initializeCardAnimationControls === 'function') {
        initializeCardAnimationControls();
    }

    // Add Enter key listener for automation node label input
    const nodeLabelInput = document.getElementById('nodeLabel');
    if (nodeLabelInput) {
        nodeLabelInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNodeToScenario();
            }
        });
    }

    // Add keyboard shortcuts for zoom (Ctrl/Cmd + Plus/Minus)
    document.addEventListener('keydown', function(e) {
        // Only work when automation screen is active
        const automationScreen = document.getElementById('automation-screen');
        if (!automationScreen || automationScreen.style.display === 'none') return;

        if ((e.ctrlKey || e.metaKey)) {
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Searching for:', this.value);
        }
    });
}

// User search functionality
const userSearchInput = document.querySelector('.search-users input');
if (userSearchInput) {
    userSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const userItems = document.querySelectorAll('.user-item');
        
        userItems.forEach(item => {
            const userName = item.querySelector('span').textContent.toLowerCase();
            if (userName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Control Panel Functions

// Update company info in sidebar
function updateCompanyInfo() {
    const companyName = document.getElementById('companyName').value;
    const companyAddress = document.getElementById('companyAddress').value;
    
    // Update sidebar display
    document.getElementById('sidebarCompanyName').textContent = companyName || 'Company Name';
    document.getElementById('sidebarCompanyAddress').textContent = companyAddress || 'Company Address';
}

function startBookingAnimation() {
    // Show animated cursor
    const cursor = document.getElementById('animatedCursor');
    cursor.style.display = 'block';
    
    // Parse the selected date/time to find the correct slot
    const dateTimeValue = document.getElementById('animDateTime').value;
    let targetSlot = null;
    
    if (dateTimeValue && dateTimeValue.includes(' at ')) {
        const [datePart, timePart] = dateTimeValue.split(' at ');
        const dayMatch = datePart.match(/\d+/);
        const dayNumber = dayMatch ? dayMatch[0] : null;
        
        // Find the day column with matching day number
        const dayColumns = document.querySelectorAll('.day-column');
        
        dayColumns.forEach(dayCol => {
            const dayHeader = dayCol.querySelector('.day-header');
            const dayNum = dayHeader.querySelector('.day-number').textContent;
            if (dayNum === dayNumber || dayNum === dayNumber?.padStart(2, '0')) {
                // Calculate slot index from time
                let slotIndex = 0;
                const timeHour = parseInt(timePart);
                
                // Parse time and calculate the correct slot index
                // Calendar starts at 11AM (index 0) and goes to 7PM (index 8)
                if (timePart === '11AM') {
                    slotIndex = 0;
                } else if (timePart === '12PM') {
                    slotIndex = 1;
                } else if (timePart.includes('PM')) {
                    // PM times (1PM-7PM)
                    // 1PM = index 2, 2PM = index 3, 3PM = index 4, etc.
                    slotIndex = timeHour + 1; // This works for 1PM-7PM
                    if (timeHour > 7) {
                        // For times beyond 7PM, cap at last available slot
                        slotIndex = 8; // Use the last slot (7PM)
                    }
                }
                
                // Get the specific slot
                const hourSlots = dayCol.querySelectorAll('.hour-slot');
                if (hourSlots[slotIndex]) {
                    targetSlot = hourSlots[slotIndex];
                }
            }
        });
    }
    
    // If no slot selected or found, use a random one
    if (!targetSlot) {
        const dayColumns = document.querySelectorAll('.day-column');
        const randomDayIndex = Math.floor(Math.random() * 5) + 1; // Skip weekend
        const randomDay = dayColumns[randomDayIndex];
        const hourSlots = randomDay.querySelectorAll('.hour-slot');
        const randomSlotIndex = Math.floor(Math.random() * 6) + 2; // Middle of the day
        targetSlot = hourSlots[randomSlotIndex];
    }
    
    // Don't scroll - assume the slot is already in view
    // Just proceed with the animation immediately
    
    // Get position of the target slot
    const rect = targetSlot.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    // Start cursor from center and animate to the slot
    cursor.style.left = '50%';
    cursor.style.top = '50%';
    
    setTimeout(() => {
        cursor.style.left = targetX + 'px';
        cursor.style.top = targetY + 'px';
    }, 100);
    
    // Click animation with sound
    setTimeout(() => {
        cursor.style.transform = 'scale(0.8)';
        playSound('clickSound');
        
        // Add click ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${targetX}px;
            top: ${targetY}px;
            width: 20px;
            height: 20px;
            border: 2px solid #ff6900;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 3001;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        
        setTimeout(() => {
            cursor.style.transform = 'scale(1)';
        }, 200);
    }, 1500);
    
    // Show modal after click
    setTimeout(() => {
        cursor.style.display = 'none';
        showBookingModal();
        
        // Start auto-filling animation
        setTimeout(() => {
            autoFillBookingForm(targetSlot);
        }, 500);
    }, 2000);
}

function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'flex';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    
    // Reset form
    document.getElementById('contactSearch').value = '';
    document.getElementById('appointmentTitle').value = '';
    document.getElementById('appointmentDesc').value = '';
}

// Smooth scroll function for human-like scrolling
function smoothScrollTo(element, targetPosition, duration) {
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function scroll() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeInOutCubic(progress);
        element.scrollTop = startPosition + (distance * easedProgress);
        
        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }
    
    requestAnimationFrame(scroll);
}

function autoFillBookingForm(targetSlot) {
    // Get values from control panel or use defaults
    const calendarName = document.getElementById('animCalendarName').value || 'Main Calendar';
    const contactName = document.getElementById('animContactName').value || getRandomContact();
    const appointmentTitle = document.getElementById('animAppTitle').value || getRandomTitle();
    const description = document.getElementById('animDescription').value || getRandomDescription();
    const teamMember = document.getElementById('animTeamMember').value;
    
    // Parse date/time from combined field
    const dateTimeValue = document.getElementById('animDateTime').value;
    let dateValue, startTime;
    
    if (dateTimeValue && dateTimeValue.includes(' at ')) {
        const [datePart, timePart] = dateTimeValue.split(' at ');
        dateValue = datePart;
        startTime = timePart;
    } else {
        dateValue = getDefaultDate();
        startTime = '2:00 PM';
    }
    
    const duration = document.getElementById('animDuration').value || '30';
    const status = document.getElementById('animStatus').value || 'Confirmed';
    
    // Get modal for scrolling
    const modal = document.querySelector('.booking-modal');
    
    // Set calendar name
    const calendarSelect = document.getElementById('calendarSelect');
    if (calendarSelect) {
        calendarSelect.innerHTML = `<option>${calendarName}</option>`;
    }
    
    // Clear date/time fields initially
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    
    // Simulate typing effect for contact search
    const contactInput = document.getElementById('contactSearch');
    typeText(contactInput, contactName, 50);
    
    // Fill appointment title after a delay
    setTimeout(() => {
        const titleInput = document.getElementById('appointmentTitle');
        typeText(titleInput, appointmentTitle, 50);
    }, 1500);
    
    // Fill description and scroll smoothly
    setTimeout(() => {
        const descInput = document.getElementById('appointmentDesc');
        
        // Smooth scroll to description field before typing
        if (modal && descInput) {
            smoothScrollTo(modal, descInput.offsetTop - 150, 800);
        }
        
        // Start typing after scroll begins
        setTimeout(() => {
            typeText(descInput, description, 30);
        }, 400);
    }, 3000);
    
    // Select team member with smooth scroll
    setTimeout(() => {
        const teamSelect = document.getElementById('teamMember');
        
        // Smooth scroll to team member field
        if (modal && teamSelect) {
            smoothScrollTo(modal, teamSelect.offsetTop - 150, 1000);
        }
        
        // Select after scroll starts
        setTimeout(() => {
            if (teamMember && teamMember !== '') {
                // Find and select the specific team member
                for (let i = 0; i < teamSelect.options.length; i++) {
                    if (teamSelect.options[i].text === teamMember) {
                        teamSelect.selectedIndex = i;
                        break;
                    }
                }
            } else {
                // Random selection
                teamSelect.selectedIndex = Math.floor(Math.random() * 3);
            }
            
            // Highlight the selection
            teamSelect.style.borderColor = '#ff6900';
            setTimeout(() => {
                teamSelect.style.borderColor = '#d0d0d0';
            }, 500);
        }, 500);
    }, 4500);
    
    // Update time with typing effect and smooth scroll
    setTimeout(() => {
        const startTimeInput = document.getElementById('startTime');
        const endTimeInput = document.getElementById('endTime');
        
        // Calculate end time based on duration
        const durationMinutes = parseInt(duration);
        
        // Create properly formatted time values
        const startTimeValue = `${dateValue} at ${startTime}`;
        const endTimeValue = calculateEndTime(startTimeValue, durationMinutes);
        
        // Smooth scroll to time fields first
        if (modal && startTimeInput) {
            smoothScrollTo(modal, startTimeInput.offsetTop - 150, 1200);
        }
        
        // Type start time after scroll begins
        setTimeout(() => {
            typeText(startTimeInput, startTimeValue, 40);
            
            // Type end time after start time
            setTimeout(() => {
                typeText(endTimeInput, endTimeValue, 40);
            }, 800);
        }, 600);
    }, 5500);
    
    // Select status with smooth scroll
    setTimeout(() => {
        const statusSelect = document.getElementById('appointmentStatus');
        
        // Smooth scroll to status field
        if (modal && statusSelect) {
            smoothScrollTo(modal, statusSelect.offsetTop - 150, 1000);
        }
        
        // Select status after scroll starts
        setTimeout(() => {
            // Find and select the status
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].text === status) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
            statusSelect.style.borderColor = '#ff6900';
            setTimeout(() => {
                statusSelect.style.borderColor = '#d0d0d0';
            }, 500);
        }, 500);
    }, 6500);
    
    // Click Book button with smooth scroll
    setTimeout(() => {
        const bookBtn = document.querySelector('.btn-book');
        
        // Smooth scroll to button first
        if (modal && bookBtn) {
            smoothScrollTo(modal, bookBtn.offsetTop - 200, 800);
        }
        
        // Then animate the click after scroll
        setTimeout(() => {
            // Get button position for click animation
            const btnRect = bookBtn.getBoundingClientRect();
            const btnX = btnRect.left + btnRect.width / 2;
            const btnY = btnRect.top + btnRect.height / 2;
            
            // Show cursor moving to button
            const cursor = document.getElementById('animatedCursor');
            cursor.style.display = 'block';
            cursor.style.left = btnX + 'px';
            cursor.style.top = btnY + 'px';
            
            setTimeout(() => {
            // Click animation
            cursor.style.transform = 'scale(0.8)';
            bookBtn.style.transform = 'scale(0.95)';
            playSound('clickSound');
            
            // Add click ripple
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                left: ${btnX}px;
                top: ${btnY}px;
                width: 30px;
                height: 30px;
                border: 2px solid #5643ce;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 3001;
            `;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            setTimeout(() => {
                cursor.style.transform = 'scale(1)';
                bookBtn.style.transform = 'scale(1)';
                cursor.style.display = 'none';
                
                // Store the target slot globally for confirmBooking to use
                animationTargetSlot = targetSlot;
                
                // Actually click the button to trigger its onclick
                bookBtn.click();
            }, 200);
        }, 300);
        }, 600); // Close the new setTimeout for scroll delay
    }, 7500);
}

function typeText(element, text, speed) {
    element.value = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.value += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}


// Global variables for quick appointment
let currentSlot = null;
let currentSlotInfo = null;
let pickerMode = null; // 'date' or 'time' or null
let selectedAppointment = null; // For rescheduling
let rescheduleTargetSlot = null;
let animationTargetSlot = null; // For animation to pass slot to confirmBooking

// Open date/time picker
function openDateTimePicker() {
    pickerMode = 'datetime';
    const overlay = document.getElementById('datetimePickerOverlay');
    overlay.style.display = 'block';
    document.querySelector('.container').classList.add('picker-mode');
    
    // Update instruction
    const instruction = overlay.querySelector('.datetime-picker-instruction');
    instruction.textContent = 'Click on any available time slot to select date and time';
}

// Close date/time picker
function closeDateTimePicker() {
    pickerMode = null;
    const overlay = document.getElementById('datetimePickerOverlay');
    overlay.style.display = 'none';
    document.querySelector('.container').classList.remove('picker-mode');
}

// Open appointment picker for rescheduling
function openAppointmentPicker() {
    console.log('Opening appointment picker...');
    pickerMode = 'appointment';
    const overlay = document.getElementById('appointmentPickerOverlay');
    overlay.style.display = 'block';
    document.querySelector('.container').classList.add('picker-mode');
    
    // Highlight all appointments
    const appointments = document.querySelectorAll('.appointment-card');
    console.log('Found appointments to highlight:', appointments.length);
    appointments.forEach((appointment, index) => {
        console.log(`Appointment ${index}:`, appointment);
        appointment.style.cursor = 'pointer';
        appointment.style.outline = '2px dashed #ff6900';
        appointment.style.outlineOffset = '2px';
    });
    
    // Use a single event listener on the calendar grid for better event handling
    const calendarGrid = document.querySelector('.calendar-grid');
    console.log('Calendar grid found:', calendarGrid);
    
    if (!calendarGrid._appointmentPickerHandler) {
        console.log('Adding appointment picker handler to calendar grid...');
        calendarGrid._appointmentPickerHandler = function(e) {
            console.log('Click event fired on:', e.target);
            console.log('Current pickerMode:', pickerMode);
            
            if (pickerMode !== 'appointment') {
                console.log('Not in appointment picker mode, ignoring click');
                return;
            }
            
            // Check if we clicked on an appointment or its child
            let appointment = e.target.closest('.appointment-card');
            console.log('Closest appointment-card:', appointment);
            
            if (!appointment) {
                console.log('No appointment card found in click target');
                return;
            }
            
            console.log('Appointment clicked! Processing selection...');
            e.stopPropagation();
            e.preventDefault();
            
            // Get the parent slot
            const slot = appointment.closest('.hour-slot');
            if (!slot) return;
            
            // Store the selected appointment details
            const appointmentTitle = appointment.querySelector('.appointment-title')?.textContent || 
                                   appointment.querySelector('div:first-child')?.textContent || 'Appointment';
            const appointmentName = appointment.querySelector('.appointment-name')?.textContent || 
                                  appointment.querySelector('div:nth-child(2)')?.textContent || 'Customer';
            
            // Find slot info
            const dayColumn = slot.closest('.day-column');
            const dayHeader = dayColumn.querySelector('.day-header');
            const dayNumber = dayHeader.querySelector('.day-number').textContent;
            const timeGrid = dayColumn.querySelector('.time-grid');
            const hourSlotsInDay = timeGrid.querySelectorAll('.hour-slot');
            const slotIndexInDay = Array.from(hourSlotsInDay).indexOf(slot);
            const hour = 11 + slotIndexInDay;
            let timeString;
            
            if (hour === 12) {
                timeString = '12PM';
            } else if (hour < 12) {
                timeString = `${hour}AM`;
            } else if (hour === 24) {
                timeString = '12AM';
            } else {
                timeString = `${hour - 12}PM`;
            }
            
            const today = new Date();
            const selectedDate = new Date(today.getFullYear(), today.getMonth(), parseInt(dayNumber));
            const month = selectedDate.toLocaleDateString('en-US', { month: 'short' });
            const year = selectedDate.getFullYear();
            
            selectedAppointment = {
                element: appointment,
                slot: slot,
                title: appointmentTitle,
                name: appointmentName,
                originalDateTime: `${month} ${dayNumber}, ${year} at ${timeString}`,
                dateTimeString: `${month} ${dayNumber}, ${year} at ${timeString}`
            };
            
            document.getElementById('rescheduleSource').value = `${appointmentTitle} - ${selectedAppointment.dateTimeString}`;
            
            // Highlight selected appointment
            appointment.style.border = '2px solid #ff6900';
            setTimeout(() => {
                appointment.style.border = '';
            }, 500);
            
            closeAppointmentPicker();
        };
        
        // Add the handler with capture phase
        calendarGrid.addEventListener('click', calendarGrid._appointmentPickerHandler, true);
        console.log('Handler attached successfully');
    } else {
        console.log('Handler already exists, not re-adding');
    }
    
    // Let's also add a direct test click handler to see if clicks are working at all
    console.log('Testing if appointments are clickable...');
    appointments.forEach((appointment, index) => {
        appointment.onclick = function(e) {
            console.log(`Direct onclick fired for appointment ${index}!`);
        };
    });
    
    // Add a document-level listener to see ALL clicks
    document._debugClickHandler = function(e) {
        if (pickerMode === 'appointment') {
            console.log('Document click detected during appointment picker mode:');
            console.log('  - Target:', e.target);
            console.log('  - Target className:', e.target.className);
            console.log('  - Target tagName:', e.target.tagName);
            console.log('  - Event phase:', e.eventPhase);
        }
    };
    document.addEventListener('click', document._debugClickHandler, true);
}

// Close appointment picker
function closeAppointmentPicker() {
    pickerMode = null;
    const overlay = document.getElementById('appointmentPickerOverlay');
    overlay.style.display = 'none';
    document.querySelector('.container').classList.remove('picker-mode');
    
    // Remove visual indicators
    const appointments = document.querySelectorAll('.appointment-card');
    appointments.forEach(appointment => {
        appointment.style.cursor = '';
        appointment.style.outline = '';
        appointment.style.outlineOffset = '';
    });
}

// Open reschedule target picker
function openReschedulePicker() {
    pickerMode = 'reschedule';
    const overlay = document.getElementById('reschedulePickerOverlay');
    overlay.style.display = 'block';
    document.querySelector('.container').classList.add('picker-mode');
}

// Close reschedule picker
function closeReschedulePicker() {
    pickerMode = null;
    const overlay = document.getElementById('reschedulePickerOverlay');
    overlay.style.display = 'none';
    document.querySelector('.container').classList.remove('picker-mode');
}

// Setup click handlers for hour slots
function setupHourSlotClickHandlers() {
    const hourSlots = document.querySelectorAll('.hour-slot');
    const dayColumns = document.querySelectorAll('.day-column');
    const timeSlots = document.querySelectorAll('.time-slot');
    
    hourSlots.forEach((slot, slotIndex) => {
        slot.addEventListener('click', function(e) {
            // Skip slot clicks when in appointment picker mode (handled directly on appointments)
            if (pickerMode === 'appointment') {
                return;
            }
            
            // Don't allow clicking on occupied slots for other modes
            if (this.classList.contains('has-appointment') && pickerMode !== 'appointment') {
                return;
            }
            
            // Find which day column this slot belongs to
            const dayColumn = this.closest('.day-column');
            const dayIndex = Array.from(dayColumns).indexOf(dayColumn);
            const dayHeader = dayColumn.querySelector('.day-header');
            const dayNumber = dayHeader.querySelector('.day-number').textContent;
            const dayName = dayHeader.querySelector('.day-name').textContent;
            
            // Get the time-grid within this day column
            const timeGrid = dayColumn.querySelector('.time-grid');
            const hourSlotsInDay = timeGrid.querySelectorAll('.hour-slot');
            const slotIndexInDay = Array.from(hourSlotsInDay).indexOf(this);
            
            // Calculate time based on slot index within the day (11AM start)
            const hour = 11 + slotIndexInDay;
            let timeString;
            
            if (hour === 12) {
                timeString = '12PM';
            } else if (hour < 12) {
                timeString = `${hour}AM`;
            } else if (hour === 24) {
                timeString = '12AM';
            } else {
                timeString = `${hour - 12}PM`;
            }
            
            // If in picker mode, set the value and close picker
            if (pickerMode) {
                // Get current date or use today
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.toLocaleDateString('en-US', { month: 'short' });
                
                // Calculate the actual date based on the day number
                const selectedDate = new Date(currentYear, today.getMonth(), parseInt(dayNumber));
                const month = selectedDate.toLocaleDateString('en-US', { month: 'short' });
                const year = selectedDate.getFullYear();
                const dateTimeString = `${month} ${dayNumber}, ${year} at ${timeString}`;
                
                if (pickerMode === 'datetime') {
                    // Set the combined date and time value for booking animation
                    document.getElementById('animDateTime').value = dateTimeString;
                    closeDateTimePicker();
                } else if (pickerMode === 'reschedule') {
                    // Set the target slot for rescheduling
                    rescheduleTargetSlot = {
                        slot: this,
                        dayNumber,
                        dayName,
                        timeString,
                        dateTimeString
                    };
                    document.getElementById('rescheduleTarget').value = dateTimeString;
                    closeReschedulePicker();
                }
                
                // Visual feedback
                this.style.background = '#10b981';
                setTimeout(() => {
                    this.style.background = '';
                }, 300);
                
                return;
            }
            
            // Store slot info for later use
            currentSlot = this;
            currentSlotInfo = { dayNumber, dayName, timeString };
            
            // Show quick appointment form
            showQuickAppointmentForm();
        });
    });
}

// Show quick appointment form
function showQuickAppointmentForm() {
    const modal = document.getElementById('quickAppointmentModal');
    modal.style.display = 'flex';
    
    // Clear and focus first input
    document.getElementById('quickAppointmentName').value = '';
    document.getElementById('quickCustomerName').value = '';
    document.getElementById('quickStatus').selectedIndex = 0;
    
    setTimeout(() => {
        document.getElementById('quickAppointmentName').focus();
    }, 100);
}

// Close quick appointment form
function closeQuickAppointment() {
    const modal = document.getElementById('quickAppointmentModal');
    modal.style.display = 'none';
    currentSlot = null;
    currentSlotInfo = null;
}

// Confirm and create appointment from quick form
function confirmQuickAppointment() {
    const appointmentName = document.getElementById('quickAppointmentName').value.trim();
    const customerName = document.getElementById('quickCustomerName').value.trim();
    const status = document.getElementById('quickStatus').value;
    
    if (!appointmentName || !customerName) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (currentSlot && currentSlotInfo) {
        // Status colors mapping
        const statusColors = {
            'Confirmed': '#22c55e',    // Green
            'Pending': '#ff6900',      // Orange
            'Tentative': '#ef4444'     // Red
        };
        
        // Use status-based color
        const appointmentColor = statusColors[status] || '#5643ce';
        
        // Create appointment element
        const appointment = document.createElement('div');
        appointment.className = 'appointment-card';
        appointment.style.cssText = `
            position: absolute;
            top: 0;
            left: 2px;
            right: 2px;
            height: calc(100% - 4px);
            background: ${appointmentColor};
            color: white;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        appointment.innerHTML = `
            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${appointmentName}</div>
            <div style="opacity: 0.9; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${customerName}</div>
            <div style="opacity: 0.8; font-size: 9px;">${status}</div>
        `;
        
        // Add appointment to slot
        currentSlot.appendChild(appointment);
        currentSlot.classList.add('has-appointment');
        
        // Play sound effect
        playSound('chachingSound');
        
        // Animate appointment appearance
        setTimeout(() => {
            appointment.style.opacity = '1';
            appointment.style.transform = 'scale(1)';
        }, 50);
        
        // Add hover effect
        appointment.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });
        
        appointment.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Removed click-to-delete functionality to avoid conflicts with selection
    }
    
    // Close the modal
    closeQuickAppointment();
}

// Load business template
function loadBusinessTemplate(type) {
    // Clear existing appointments first
    clearCalendar();
    
    // Wait for clear animation to complete before adding new appointments
    setTimeout(() => {
        // Status colors mapping
        const statusColors = {
        'Confirmed': '#22c55e',    // Green
        'Pending': '#ff6900',      // Orange
        'Tentative': '#ef4444',    // Red
        'Cancelled': '#6b7280',    // Gray
        'Completed': '#3b82f6'     // Blue
    };
    
    const templates = {
        plumbing: {
            appointments: [
                { time: 0, day: 1, name: 'Pipe Repair', customer: 'John Miller', status: 'Confirmed' },
                { time: 2, day: 1, name: 'Drain Cleaning', customer: 'Sarah Davis', status: 'Pending' },
                { time: 4, day: 2, name: 'Water Heater Install', customer: 'Mike Johnson', status: 'Confirmed' },
                { time: 1, day: 3, name: 'Leak Detection', customer: 'Emily Brown', status: 'Tentative' },
                { time: 3, day: 4, name: 'Bathroom Remodel', customer: 'Tom Wilson', status: 'Pending' },
                { time: 5, day: 5, name: 'Emergency Repair', customer: 'Lisa Anderson', status: 'Confirmed' },
                { time: 6, day: 3, name: 'Faucet Install', customer: 'Steve Rogers', status: 'Completed' }
            ]
        },
        electrician: {
            appointments: [
                { time: 1, day: 1, name: 'Outlet Installation', customer: 'Robert Lee', status: 'Confirmed' },
                { time: 3, day: 2, name: 'Circuit Breaker Repair', customer: 'Jennifer White', status: 'Pending' },
                { time: 2, day: 3, name: 'Lighting Installation', customer: 'David Martinez', status: 'Tentative' },
                { time: 4, day: 4, name: 'Panel Upgrade', customer: 'Maria Garcia', status: 'Confirmed' },
                { time: 0, day: 5, name: 'Safety Inspection', customer: 'James Taylor', status: 'Completed' },
                { time: 5, day: 2, name: 'Wiring Repair', customer: 'Nancy Adams', status: 'Pending' }
            ]
        },
        hvac: {
            appointments: [
                { time: 0, day: 1, name: 'AC Maintenance', customer: 'Patricia Jones', status: 'Completed' },
                { time: 3, day: 1, name: 'Furnace Repair', customer: 'Charles Brown', status: 'Pending' },
                { time: 2, day: 2, name: 'Duct Cleaning', customer: 'Barbara Davis', status: 'Confirmed' },
                { time: 1, day: 3, name: 'AC Installation', customer: 'Richard Miller', status: 'Tentative' },
                { time: 4, day: 4, name: 'Filter Replacement', customer: 'Susan Wilson', status: 'Confirmed' },
                { time: 3, day: 5, name: 'System Inspection', customer: 'Joseph Moore', status: 'Pending' },
                { time: 7, day: 4, name: 'Thermostat Install', customer: 'Karen Hill', status: 'Confirmed' }
            ]
        },
        landscaping: {
            appointments: [
                { time: 0, day: 1, name: 'Lawn Mowing', customer: 'Dorothy Taylor', status: 'Confirmed' },
                { time: 1, day: 2, name: 'Tree Trimming', customer: 'Christopher Anderson', status: 'Pending' },
                { time: 3, day: 2, name: 'Garden Design', customer: 'Nancy Thomas', status: 'Tentative' },
                { time: 2, day: 3, name: 'Sprinkler Repair', customer: 'Daniel Jackson', status: 'Confirmed' },
                { time: 4, day: 4, name: 'Mulch Installation', customer: 'Betty White', status: 'Completed' },
                { time: 1, day: 5, name: 'Hedge Trimming', customer: 'Mark Harris', status: 'Pending' },
                { time: 5, day: 3, name: 'Sod Installation', customer: 'Amy Chen', status: 'Confirmed' }
            ]
        },
        carpet: {
            appointments: [
                { time: 1, day: 1, name: 'Carpet Cleaning', customer: 'Helen Martin', status: 'Confirmed' },
                { time: 3, day: 1, name: 'Stain Removal', customer: 'Paul Thompson', status: 'Pending' },
                { time: 0, day: 2, name: 'Deep Clean Service', customer: 'Sandra Garcia', status: 'Completed' },
                { time: 2, day: 3, name: 'Pet Odor Treatment', customer: 'Kevin Martinez', status: 'Tentative' },
                { time: 4, day: 4, name: 'Upholstery Cleaning', customer: 'Laura Robinson', status: 'Confirmed' },
                { time: 3, day: 5, name: 'Rug Cleaning', customer: 'Jason Clark', status: 'Pending' },
                { time: 6, day: 2, name: 'Tile Cleaning', customer: 'Brian Foster', status: 'Confirmed' }
            ]
        }
    };
    
    const template = templates[type];
    if (!template) return;
    
    // Add appointments with animation
    template.appointments.forEach((appointment, index) => {
        setTimeout(() => {
            const dayColumns = document.querySelectorAll('.day-column');
            const day = dayColumns[appointment.day];
            if (day) {
                const hourSlots = day.querySelectorAll('.hour-slot');
                const slot = hourSlots[appointment.time];
                if (slot && !slot.classList.contains('has-appointment')) {
                    const appointmentEl = document.createElement('div');
                    appointmentEl.className = 'appointment-card';
                    
                    // Use status-based color
                    const appointmentColor = statusColors[appointment.status] || '#5643ce';
                    
                    appointmentEl.style.cssText = `
                        position: absolute;
                        left: 2px;
                        right: 2px;
                        height: calc(100% - 4px);
                        background: ${appointmentColor};
                        color: white;
                        padding: 4px 6px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                        opacity: 0;
                        transform: scale(0.8);
                        transition: all 0.3s ease;
                        z-index: 10;
                        overflow: hidden;
                    `;
                    
                    // Calculate time string
                    const hour = 11 + appointment.time;
                    let timeString;
                    
                    if (hour === 12) {
                        timeString = '12PM';
                    } else if (hour < 12) {
                        timeString = `${hour}AM`;
                    } else if (hour === 24) {
                        timeString = '12AM';
                    } else {
                        timeString = `${hour - 12}PM`;
                    }
                    
                    appointmentEl.innerHTML = `
                        <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${appointment.name}</div>
                        <div style="opacity: 0.9; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${appointment.customer}</div>
                        <div style="opacity: 0.8; font-size: 9px;">${appointment.status}</div>
                    `;
                    
                    slot.style.position = 'relative';
                    slot.appendChild(appointmentEl);
                    slot.classList.add('has-appointment');
                    
                    // Animate appearance
                    setTimeout(() => {
                        appointmentEl.style.opacity = '1';
                        appointmentEl.style.transform = 'scale(1)';
                    }, 50);
                    
                    // Add hover effect
                    appointmentEl.addEventListener('mouseenter', function() {
                        this.style.transform = 'scale(1.02)';
                        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    });
                    
                    appointmentEl.addEventListener('mouseleave', function() {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = 'none';
                    });
                    
                    // Removed click-to-delete functionality to avoid conflicts with selection
                    
                    // Play sound for each appointment
                    playSound('chachingSound');
                }
            }
        }, index * 150); // Stagger the appointments
    });
    }, 350); // Wait for clear animation to complete
}

function confirmBooking(targetSlot) {
    // Get the filled data
    const contact = document.getElementById('contactSearch').value;
    const title = document.getElementById('appointmentTitle').value;
    const startTime = document.getElementById('startTime').value;
    
    // Close modal
    closeBookingModal();
    
    // Add the booking to calendar
    setTimeout(() => {
        // Get selected color
        const selectedColor = document.querySelector('input[name="appointmentColor"]:checked')?.value || '#5643ce';
        
        // Priority: animation slot > current slot (from manual click) > provided target slot
        let slotToUse = animationTargetSlot || currentSlot || targetSlot;
        
        // Clear the animation target slot after using it
        if (animationTargetSlot) {
            animationTargetSlot = null;
        }
        
        // Clear current slot after using it
        if (currentSlot) {
            currentSlot = null;
        }
        
        if (!slotToUse) {
            // Fallback to random slot if no target provided
            const dayColumns = document.querySelectorAll('.day-column');
            const randomDay = dayColumns[Math.floor(Math.random() * 5) + 1];
            const hourSlots = randomDay.querySelectorAll('.hour-slot');
            slotToUse = hourSlots[Math.floor(Math.random() * 6) + 2];
        }
        
        // Check if slot already has appointment
        if (!slotToUse || slotToUse.classList.contains('has-appointment')) {
            // Find another available slot if this one is taken
            const allSlots = document.querySelectorAll('.hour-slot');
            for (let slot of allSlots) {
                if (!slot.classList.contains('has-appointment')) {
                    slotToUse = slot;
                    break;
                }
            }
        }
        
        if (!slotToUse) {
            return;
        }
        
        const booking = document.createElement('div');
        booking.className = 'appointment-card';
        booking.style.cssText = `
            position: absolute;
            left: 2px;
            right: 2px;
            height: calc(100% - 4px);
            background: ${selectedColor};
            color: white;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
            z-index: 10;
            overflow: hidden;
        `;
        booking.innerHTML = `
            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title || 'New Appointment'}</div>
            <div style="font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${contact || 'Client'}</div>
            <div style="font-size: 9px; opacity: 0.8;">Confirmed</div>
        `;
        
        slotToUse.style.position = 'relative';
        slotToUse.appendChild(booking);
        slotToUse.classList.add('has-appointment');
        
        // Animate appearance
        setTimeout(() => {
            booking.style.opacity = '1';
            booking.style.transform = 'scale(1)';
        }, 50);
        
        // Add hover effect
        booking.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });
        
        booking.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Removed click-to-delete functionality to avoid conflicts with selection
        
        // Play chaching sound when appointment appears
        playSound('chachingSound');
    }, 500);
}

// Helper function to play sounds
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.5;
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Playing sound: ${soundId}`);
            }).catch(error => {
                console.log(`Could not play sound ${soundId}:`, error.message);
                // Create a fallback click sound using Web Audio API
                if (soundId === 'clickSound') {
                    playClickSound();
                } else if (soundId === 'chachingSound') {
                    playChachingSound();
                }
            });
        }
    }
}

// Fallback sound generators using Web Audio API
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Could not play fallback click sound');
    }
}


function playChachingSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.value = 800;
        oscillator2.frequency.value = 1200;
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator1.stop(audioContext.currentTime + 0.5);
        oscillator2.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Could not play fallback chaching sound');
    }
}

function toggleView(view) {
    const viewBtns = document.querySelectorAll('.controls-right .view-btn');
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(view)) {
            btn.classList.add('active');
        }
    });
}

function clearCalendar() {
    // Select both .appointment and .appointment-card classes
    const appointments = document.querySelectorAll('.appointment, .appointment-card');
    const hourSlots = document.querySelectorAll('.hour-slot');
    
    appointments.forEach(appointment => {
        appointment.style.opacity = '0';
        appointment.style.transform = 'scale(0.8)';
        setTimeout(() => appointment.remove(), 300);
    });
    
    hourSlots.forEach(slot => {
        slot.classList.remove('has-appointment');
    });
}

function fillSampleData() {
    // Clear existing appointments first
    clearCalendar();
    
    // Wait for clear animation to complete before adding new appointments
    setTimeout(() => {
        // Status colors mapping (matching template structure)
        const statusColors = {
            'Confirmed': '#22c55e',    // Green
            'Pending': '#ff6900',      // Orange
            'Tentative': '#ef4444',    // Red
            'Cancelled': '#6b7280',    // Gray
            'Completed': '#3b82f6'     // Blue
        };
        
        const sampleBookings = [
            { time: 2, day: 1, title: 'Team Meeting', contact: 'James Mitchell', status: 'Confirmed' },
            { time: 4, day: 2, title: 'Client Call', contact: 'Emma Thompson', status: 'Pending' },
            { time: 1, day: 3, title: 'Project Review', contact: 'Oliver Davies', status: 'Confirmed' },
            { time: 3, day: 4, title: 'Training Session', contact: 'Sarah Johnson', status: 'Tentative' },
            { time: 5, day: 5, title: 'Sales Presentation', contact: 'Michael Brown', status: 'Confirmed' }
        ];
        
        sampleBookings.forEach((booking, index) => {
            setTimeout(() => {
            const dayColumns = document.querySelectorAll('.day-column');
            const day = dayColumns[booking.day];
            if (day) {
                const hourSlots = day.querySelectorAll('.hour-slot');
                const slot = hourSlots[booking.time];
                if (slot && !slot.classList.contains('has-appointment')) {
                    const bookingEl = document.createElement('div');
                    bookingEl.className = 'appointment-card';
                    
                    // Use status-based color like templates
                    const color = statusColors[booking.status] || '#5643ce';
                    
                    bookingEl.style.cssText = `
                        position: absolute;
                        left: 2px;
                        right: 2px;
                        height: calc(100% - 4px);
                        background: ${color};
                        color: white;
                        padding: 4px 6px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                        opacity: 0;
                        transform: scale(0.8);
                        transition: all 0.3s ease;
                        z-index: 10;
                        overflow: hidden;
                    `;
                    
                    // Match the exact template structure
                    bookingEl.innerHTML = `
                        <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${booking.title}</div>
                        <div style="opacity: 0.9; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${booking.contact}</div>
                        <div style="opacity: 0.8; font-size: 9px;">${booking.status}</div>
                    `;
                    
                    slot.style.position = 'relative';
                    slot.appendChild(bookingEl);
                    slot.classList.add('has-appointment');
                    
                    // Animate appearance
                    setTimeout(() => {
                        bookingEl.style.opacity = '1';
                        bookingEl.style.transform = 'scale(1)';
                    }, 50);
                    
                    // Add hover effect
                    bookingEl.addEventListener('mouseenter', function() {
                        this.style.transform = 'scale(1.02)';
                        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    });
                    
                    bookingEl.addEventListener('mouseleave', function() {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = 'none';
                    });
                    
                    // Removed click-to-delete functionality to avoid conflicts with selection
                    
                    // Play sound for each appointment
                    playSound('chachingSound');
                }
            }
            }, index * 200); // Stagger the appointments
        });
    }, 350); // Wait for clear animation to complete
}

// Helper function to get default date
function getDefaultDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'short' });
    const year = today.getFullYear();
    return `${month} ${day}, ${year}`;
}

// Helper functions for random data
function getRandomContact() {
    const contacts = ['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Robert Brown', 
                     'Lisa Anderson', 'David Miller', 'Jennifer Taylor', 'Michael Thompson', 'Jessica Martinez'];
    return contacts[Math.floor(Math.random() * contacts.length)];
}

function getRandomTitle() {
    const titles = ['Strategy Session', 'Product Demo', 'Consultation Call', 'Follow-up Meeting', 
                   'Initial Assessment', 'Quarterly Review', 'Project Kickoff', 'Training Session',
                   'Sales Presentation', 'Technical Discussion'];
    return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomDescription() {
    const descriptions = [
        'Discuss project requirements and timeline',
        'Review proposal and pricing options',
        'Q4 planning and budget allocation',
        'Technical implementation discussion',
        'Performance review and optimization',
        'Strategic planning for next quarter',
        'Product features and customization options',
        'Integration requirements and API discussion',
        'Training on new system features',
        'Contract negotiation and terms review'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomNote() {
    const notes = [
        'Client interested in premium package',
        'Referred by existing customer',
        'High priority - decision maker',
        'Follow up from last week\'s email',
        'Potential for long-term contract',
        'Requires custom integration',
        'Budget approved for Q4',
        'Expanding team - needs multiple licenses',
        'Interested in annual subscription',
        'Competitor comparison needed'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
}

function randomizeBookingData() {
    // Fill all fields with random data
    const calendarNames = ['Main Calendar', 'Team Calendar', 'Personal Calendar', 'Client Meetings'];
    document.getElementById('animCalendarName').value = calendarNames[Math.floor(Math.random() * calendarNames.length)];
    document.getElementById('animContactName').value = getRandomContact();
    document.getElementById('animAppTitle').value = getRandomTitle();
    document.getElementById('animDescription').value = getRandomDescription();
    
    // Random team member
    const teamMembers = ['', 'James Mitchell', 'Emma Thompson', 'Oliver Davies', 'Sarah Johnson'];
    document.getElementById('animTeamMember').value = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    
    // Random date (within next 7 days) and time combined
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 7));
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    // Random time
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    // Set combined date/time value
    document.getElementById('animDateTime').value = `${month} ${day}, ${year} at ${randomTime}`;
    
    // Random duration
    const durations = ['30', '60', '90', '120'];
    document.getElementById('animDuration').value = durations[Math.floor(Math.random() * durations.length)];
    
    // Random status
    const statuses = ['Confirmed', 'Pending', 'Tentative'];
    document.getElementById('animStatus').value = statuses[Math.floor(Math.random() * statuses.length)];
}

// Helper function to calculate end time
function calculateEndTime(startDateTime, durationMinutes) {
    // Parse the date/time string (e.g., "Sep 13, 2025 at 2PM")
    const parts = startDateTime.match(/(\w+) (\d+), (\d+) at (\d+)(AM|PM)/);
    if (!parts) return startDateTime;
    
    const [, month, day, year, hour, period] = parts;
    let startHour = parseInt(hour);
    if (period === 'PM' && startHour !== 12) startHour += 12;
    if (period === 'AM' && startHour === 12) startHour = 0;
    
    // Add duration (assuming we're adding minutes to the hour)
    let totalMinutes = startHour * 60 + durationMinutes;
    let endHour = Math.floor(totalMinutes / 60);
    let endMinutes = totalMinutes % 60;
    
    // Handle day overflow
    if (endHour >= 24) {
        endHour = endHour % 24;
    }
    
    // Format end time
    let endPeriod = endHour >= 12 ? 'PM' : 'AM';
    let displayHour = endHour;
    if (endHour > 12) displayHour = endHour - 12;
    if (endHour === 0) displayHour = 12;
    if (endHour === 12) displayHour = 12;
    
    const timeStr = endMinutes > 0 ? `${displayHour}:${endMinutes.toString().padStart(2, '0')}${endPeriod}` : `${displayHour}${endPeriod}`;
    return `${month} ${day}, ${year} at ${timeStr}`;
}

// Start reschedule animation
function startRescheduleAnimation() {
    // Check if both source and target are selected
    if (!selectedAppointment || !rescheduleTargetSlot) {
        alert('Please select both an appointment to reschedule and a new time slot');
        return;
    }
    
    // Show animated cursor
    const cursor = document.getElementById('animatedCursor');
    cursor.style.display = 'block';
    
    // Get position of the source appointment
    const sourceRect = selectedAppointment.slot.getBoundingClientRect();
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;
    
    // Start cursor from center and move to source appointment
    cursor.style.left = '50%';
    cursor.style.top = '50%';
    
    setTimeout(() => {
        cursor.style.left = sourceX + 'px';
        cursor.style.top = sourceY + 'px';
    }, 100);
    
    // Click on the appointment to open edit modal
    setTimeout(() => {
        cursor.style.transform = 'scale(0.8)';
        playSound('clickSound');
        
        // Highlight the appointment
        selectedAppointment.element.style.transform = 'scale(1.05)';
        selectedAppointment.element.style.boxShadow = '0 4px 12px rgba(255, 105, 0, 0.4)';
        
        setTimeout(() => {
            cursor.style.transform = 'scale(1)';
            selectedAppointment.element.style.transform = 'scale(1)';
        }, 150);
    }, 1000);
    
    // Open the booking modal with existing appointment data
    setTimeout(() => {
        cursor.style.display = 'none';
        const modal = document.getElementById('bookingModal');
        modal.style.display = 'flex';
        
        // Pre-fill the form with existing appointment data
        document.getElementById('contactSearch').value = selectedAppointment.name;
        document.getElementById('appointmentTitle').value = selectedAppointment.title;
        document.getElementById('appointmentDesc').value = 'Rescheduling appointment to new time slot';
        document.getElementById('teamMember').selectedIndex = 1;
        document.getElementById('appointmentStatus').value = 'Confirmed';
        
        // FIRST show the EXISTING date/time
        document.getElementById('startTime').value = selectedAppointment.originalDateTime;
        const existingEndTime = calculateEndTime(selectedAppointment.originalDateTime, 30);
        document.getElementById('endTime').value = existingEndTime;
    }, 1500);
    
    // Animate editing the date/time field - show old time first, then update
    setTimeout(() => {
        const modal = document.querySelector('.booking-modal');
        const startTimeInput = document.getElementById('startTime');
        const endTimeInput = document.getElementById('endTime');
        
        // Scroll to time field
        if (modal && startTimeInput) {
            smoothScrollTo(modal, startTimeInput.offsetTop - 150, 800);
        }
        
        // First highlight the existing time
        setTimeout(() => {
            startTimeInput.style.borderColor = '#ff6900';
            startTimeInput.style.backgroundColor = '#fff3e0';
            
            // Wait a moment to show the existing time
            setTimeout(() => {
                // Now clear and type the NEW time
                startTimeInput.value = '';
                typeText(startTimeInput, rescheduleTargetSlot.dateTimeString, 40);
                
                // Update end time after start time is typed
                setTimeout(() => {
                    endTimeInput.value = '';
                    const newEndTime = calculateEndTime(rescheduleTargetSlot.dateTimeString, 30);
                    typeText(endTimeInput, newEndTime, 40);
                    
                    setTimeout(() => {
                        startTimeInput.style.borderColor = '#d0d0d0';
                        startTimeInput.style.backgroundColor = 'white';
                        endTimeInput.style.borderColor = '#d0d0d0';
                    }, 800);
                }, 1200);
            }, 1200); // Show existing time for 1.2 seconds
        }, 1000);
    }, 3000);
    
    // Click Save/Update button
    setTimeout(() => {
        const cursor = document.getElementById('animatedCursor');
        cursor.style.display = 'block';
        
        const bookBtn = document.querySelector('.btn-book');
        const btnRect = bookBtn.getBoundingClientRect();
        const btnX = btnRect.left + btnRect.width / 2;
        const btnY = btnRect.top + btnRect.height / 2;
        
        // Move cursor to button
        cursor.style.left = btnX + 'px';
        cursor.style.top = btnY + 'px';
        
        setTimeout(() => {
            cursor.style.transform = 'scale(0.8)';
            bookBtn.style.transform = 'scale(0.95)';
            playSound('clickSound');
            
            setTimeout(() => {
                cursor.style.transform = 'scale(1)';
                bookBtn.style.transform = 'scale(1)';
                
                // Close modal
                document.getElementById('bookingModal').style.display = 'none';
                cursor.style.display = 'none';
            }, 300);
        }, 500);
    }, 7000); // Increased delay to account for time field animation
    
    // After modal closes, animate the appointment card moving to new slot
    setTimeout(() => {
        // Create a floating copy of the appointment for movement animation
        const movingAppointment = selectedAppointment.element.cloneNode(true);
        movingAppointment.style.position = 'fixed';
        movingAppointment.style.zIndex = '5000';
        movingAppointment.style.transition = 'all 1.2s ease-in-out';
        movingAppointment.style.pointerEvents = 'none';
        
        // Get current position
        const sourceRect = selectedAppointment.element.getBoundingClientRect();
        movingAppointment.style.left = sourceRect.left + 'px';
        movingAppointment.style.top = sourceRect.top + 'px';
        movingAppointment.style.width = sourceRect.width + 'px';
        movingAppointment.style.height = sourceRect.height + 'px';
        
        document.body.appendChild(movingAppointment);
        
        // Hide original
        selectedAppointment.element.style.opacity = '0';
        
        // Get target position
        const targetRect = rescheduleTargetSlot.slot.getBoundingClientRect();
        
        // Animate movement to new slot
        setTimeout(() => {
            movingAppointment.style.left = targetRect.left + 2 + 'px';
            movingAppointment.style.top = targetRect.top + 2 + 'px';
            movingAppointment.style.width = (targetRect.width - 4) + 'px';
            movingAppointment.style.height = (targetRect.height - 4) + 'px';
        }, 50);
        
        // After movement completes, replace with actual appointment
        setTimeout(() => {
            movingAppointment.remove();
            selectedAppointment.element.remove();
            selectedAppointment.slot.classList.remove('has-appointment');
        
        // Create new appointment with EXACT same styling as template appointments
        const newAppointment = document.createElement('div');
        newAppointment.className = 'appointment-card';
        newAppointment.style.cssText = `
            position: absolute;
            left: 2px;
            right: 2px;
            height: calc(100% - 4px);
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
            z-index: 10;
            overflow: hidden;
        `;
        
        // Keep EXACT same layout as template appointments
        newAppointment.innerHTML = `
            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${selectedAppointment.title}</div>
            <div style="font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${selectedAppointment.name}</div>
            <div style="font-size: 9px; opacity: 0.8;">Rescheduled</div>
        `;
        
        rescheduleTargetSlot.slot.appendChild(newAppointment);
        rescheduleTargetSlot.slot.classList.add('has-appointment');
        rescheduleTargetSlot.slot.style.position = 'relative';
        
        // Add hover effects to the new appointment
        newAppointment.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        newAppointment.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Animate the new appointment appearing
        setTimeout(() => {
            newAppointment.style.opacity = '1';
            newAppointment.style.transform = 'scale(1)';
            playSound('cachingSound');
        }, 100);
        
        // Hide cursor and reset
        setTimeout(() => {
            cursor.style.display = 'none';
            
            // Reset selections
            selectedAppointment = null;
            rescheduleTargetSlot = null;
            document.getElementById('rescheduleSource').value = '';
            document.getElementById('rescheduleTarget').value = '';
        }, 500);
        }, 1300); // After movement animation completes (1.2s movement)
    }, 8000); // After modal closes and form is saved
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes scaleIn {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes ripple {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 60px;
            height: 60px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =====================================================
// Conversation Screen Functionality
// =====================================================

let currentConversation = null;
let conversationMessageIdCounter = 1;
let conversations = {};

// Initialize the conversation simulator
function initializeConversations() {
    initializeSampleConversations();
    setupConversationEventListeners();
    selectFirstConversation();

    // Load saved scenarios for conversation screen
    loadSavedScenarios();

    // Update the initial date/time display
    const timeSpan = document.querySelector('.last-message-time');
    if (timeSpan) {
        const now = new Date();
        timeSpan.textContent = formatConversationTime(now);
    }
}

// Initialize sample conversations
function initializeSampleConversations() {
    // Generate recent dates for a more realistic feel
    const today = new Date();
    const currentMonth = today.toLocaleString('en-US', { month: 'short' });

    // Helper to get a date X days ago
    function getRecentDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }

    // Sample conversation data with recent dates
    const sampleConversations = [
        {
            id: 'conv-1',
            name: 'Robert Paulus',
            initials: 'RP',
            lastMessage: 'Hi Robert, Piyush here from Mass',
            time: getRecentDate(0), // Today
            unread: 1,
            messages: []
        },
        {
            id: 'conv-2',
            name: 'Julien Fonteyne',
            initials: 'JF',
            lastMessage: 'Hi Julien, Piyush here from Massi',
            time: getRecentDate(0), // Today
            unread: 6,
            messages: []
        },
        {
            id: 'conv-3',
            name: 'Jamie Smith',
            initials: 'JS',
            lastMessage: 'Hi Jamie, Piyush here from Mass',
            time: getRecentDate(1), // Yesterday
            unread: 1,
            messages: [
                {
                    id: 'msg-1',
                    type: 'outgoing',
                    sender: 'AutomateMyBiz.pro',
                    text: "Recon'25 starts tomorrow, are you coming?",
                    subtext: '- Hey Jamie,...',
                    date: '18th ' + currentMonth + ', 2025',
                    time: currentMonth + ' 18, 2025, 7:00 PM'
                },
                {
                    id: 'msg-2',
                    type: 'outgoing',
                    sender: 'AutomateMyBiz.pro',
                    text: "A common pain I found amongst people at RECON'25",
                    subtext: '- H...',
                    date: '20th ' + currentMonth + ', 2025',
                    time: currentMonth + ' 20, 2025, 7:13 PM'
                }
            ]
        },
        {
            id: 'conv-4',
            name: 'Phil Harris',
            initials: 'PH',
            lastMessage: 'Hi Phil, Piyush here from Massive',
            time: getRecentDate(1), // Yesterday
            unread: 3,
            messages: []
        },
        {
            id: 'conv-5',
            name: 'Lex Hubert',
            initials: 'LH',
            lastMessage: 'Hey Lex, Quick heads up - RECON',
            time: getRecentDate(3), // 3 days ago
            unread: 7,
            messages: []
        },
        {
            id: 'conv-6',
            name: 'Michael Chen',
            initials: 'MC',
            lastMessage: 'Thanks for reaching out! I am interested',
            time: getRecentDate(2), // 2 days ago
            unread: 0,
            messages: []
        },
        {
            id: 'conv-7',
            name: 'Sarah Williams',
            initials: 'SW',
            lastMessage: 'Can we schedule a call next week?',
            time: getRecentDate(2), // 2 days ago
            unread: 2,
            messages: []
        },
        {
            id: 'conv-8',
            name: 'David Thompson',
            initials: 'DT',
            lastMessage: 'Perfect! See you at the event',
            time: getRecentDate(4), // 4 days ago
            unread: 0,
            messages: []
        }
    ];

    // Store conversations
    sampleConversations.forEach(conv => {
        conversations[conv.id] = conv;
    });

    // Update the HTML conversation list with the new dates
    updateConversationListDates();
}

// Update conversation list dates in the UI
function updateConversationListDates() {
    const conversationItems = document.querySelectorAll('.conversation-item');
    const convKeys = Object.keys(conversations);

    conversationItems.forEach((item, index) => {
        if (index < convKeys.length) {
            const conv = conversations[convKeys[index]];
            const timeSpan = item.querySelector('.time');
            if (timeSpan && conv) {
                timeSpan.textContent = conv.time;
            }
        }
    });
}

// Setup event listeners for conversation screen
function setupConversationEventListeners() {
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
            document.querySelectorAll('.message-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show/hide phone numbers based on selected tab
            const phoneNumbersSection = document.getElementById('phoneNumbersSection');
            const selectedTab = this.getAttribute('data-tab');

            if (phoneNumbersSection) {
                if (selectedTab === 'sms') {
                    phoneNumbersSection.style.display = 'flex';
                } else {
                    phoneNumbersSection.style.display = 'none';
                }
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
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendConversationMessage);
    }

    // Clear button
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearConversationMessageInput);
    }

    // Message input character count
    const messageInput = document.querySelector('.message-input');
    if (messageInput) {
        messageInput.addEventListener('input', updateConversationCharCount);
    }
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
        updateConversationChatHeader();

        // Load messages
        loadConversationMessages();

        // Update contact details
        updateConversationContactDetails();

        // Mark as read
        if (currentConversation && currentConversation.unread > 0) {
            currentConversation.unread = 0;
            updateConversationUnreadCount(selectedItem);
        }
    }
}

// Select first conversation on load
function selectFirstConversation() {
    selectConversation(2); // Select Jamie Smith by default
}

// Update chat header
function updateConversationChatHeader() {
    if (!currentConversation) return;

    const contactInfo = document.querySelector('.chat-contact-info');
    if (contactInfo) {
        const h2 = contactInfo.querySelector('h2');
        if (h2) h2.textContent = currentConversation.name;
        const timeSpan = contactInfo.querySelector('.last-message-time');
        if (timeSpan) {
            // Use current date and time instead of hardcoded value
            const now = new Date();
            timeSpan.textContent = formatConversationTime(now);
        }
    }
}

// Load messages for current conversation
function loadConversationMessages() {
    if (!currentConversation) return;

    const messagesArea = document.querySelector('.messages-area');
    if (!messagesArea) return;
    
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
        const messageGroup = createConversationMessageElement(msg);
        messagesArea.appendChild(messageGroup);
    });

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Create message element
function createConversationMessageElement(message) {
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
            <div class="avatar-small">AI</div>
        `;
    } else {
        // For incoming messages, use initials if available, otherwise use first 2 letters of sender name
        const initials = currentConversation && currentConversation.initials ? currentConversation.initials :
                        (message.sender ? message.sender.substring(0, 2).toUpperCase() : 'CT');
        messageGroup.innerHTML = `
            <div class="avatar-small">${initials}</div>
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
function updateConversationContactDetails() {
    if (!currentConversation) return;

    const contactAvatar = document.querySelector('.contact-avatar');
    if (contactAvatar) {
        contactAvatar.textContent = currentConversation.initials;
        contactAvatar.style.background = '#5e72e4';
    }
    
    const contactName = document.querySelector('.contact-details-panel h3');
    if (contactName) contactName.textContent = currentConversation.name;
    
    // Update email if available
    if (currentConversation.email) {
        const emailValue = document.querySelector('.detail-value');
        if (emailValue) emailValue.textContent = currentConversation.email;
    }
    
    // Update phone if available
    if (currentConversation.phone) {
        const phoneValues = document.querySelectorAll('.detail-value');
        if (phoneValues[1]) phoneValues[1].textContent = currentConversation.phone;
    }
    
    // Update tags if available
    if (currentConversation.tag) {
        const tagBadges = document.getElementById('contactTags');
        if (tagBadges) {
            tagBadges.innerHTML = '';
            const tagBadge = document.createElement('span');
            tagBadge.className = 'tag-badge';
            tagBadge.innerHTML = `<i class="fas fa-tag"></i>${currentConversation.tag}`;
            tagBadges.appendChild(tagBadge);
        }
    }
}

// Send message
function sendConversationMessage() {
    const messageInput = document.querySelector('.message-input');
    if (!messageInput) return;
    
    const messageText = messageInput.value.trim();

    if (!messageText || !currentConversation) return;

    // Create new message
    const now = new Date();
    const newMessage = {
        id: `msg-${conversationMessageIdCounter++}`,
        type: 'outgoing',
        sender: 'AutomateMyBiz.pro',
        text: messageText,
        date: formatConversationDate(now),
        time: formatConversationTime(now)
    };

    // Add to conversation
    currentConversation.messages.push(newMessage);

    // Reload messages
    loadConversationMessages();

    // Clear input
    clearConversationMessageInput();

    // Update last message in conversation list
    updateConversationPreview();
}

// Clear message input
function clearConversationMessageInput() {
    const messageInput = document.querySelector('.message-input');
    if (messageInput) {
        messageInput.value = '';
        updateConversationCharCount();
    }
}

// Update character count
function updateConversationCharCount() {
    const messageInput = document.querySelector('.message-input');
    const charCountSpan = document.querySelector('.char-count');
    if (messageInput && charCountSpan) {
        const charCount = messageInput.value.length;
        const segments = Math.ceil(charCount / 160) || 0;
        charCountSpan.textContent = `Chars: ${charCount}, Segs: ${segments}`;
    }
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
function updateConversationUnreadCount(conversationItem) {
    if (!conversationItem) return;
    
    const unreadElement = conversationItem.querySelector('.unread-count');
    if (unreadElement) {
        if (currentConversation && currentConversation.unread > 0) {
            unreadElement.textContent = currentConversation.unread;
            unreadElement.style.display = 'flex';
        } else {
            unreadElement.style.display = 'none';
        }
    }
}

// Format date for conversations
function formatConversationDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}${getConversationOrdinalSuffix(date.getDate())} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

// Format time for conversations
function formatConversationTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${hours}:${minutesStr} ${ampm}`;
}

// Get ordinal suffix for conversations
function getConversationOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// =====================================================
// Contact Adding Animation
// =====================================================

function startAddContactAnimation() {
    // Get input values
    const name = document.getElementById('newContactName').value || 'Sarah Johnson';
    const phone = document.getElementById('newContactPhone').value || '(555) 987-6543';
    const email = document.getElementById('newContactEmail').value || 'sarah.johnson@email.com';
    const tagName = document.getElementById('newContactTag').value || 'VIP Client';
    
    // Create initials from name
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Start animation sequence (no cursor)
    animateNewContactAddition(name, initials, phone, email, tagName);
}

async function animateNewContactAddition(name, initials, phone, email, tagName) {
    // First, ensure we're on the conversations screen
    const conversationNav = document.querySelector('.nav-item[data-screen="conversations"]');
    if (conversationNav && !conversationNav.classList.contains('active')) {
        conversationNav.click();
        await sleep(300);
    }
    
    // Create a new conversation object and add it to the beginning
    const newConvId = 'conv-new-' + Date.now();
    const newConversation = {
        id: newConvId,
        name: name,
        initials: initials,
        lastMessage: 'New contact added',
        time: 'Just now',
        unread: 1,
        messages: [],
        phone: phone,
        email: email,
        tag: tagName
    };
    
    // Add to conversations object at the beginning
    const oldConversations = {...conversations};
    conversations = {};
    conversations[newConvId] = newConversation;
    Object.assign(conversations, oldConversations);
    
    const conversationItems = document.querySelector('.conversation-items');
    let firstItem = conversationItems.querySelector('.conversation-item');

    // If no conversation items exist (list was cleared), remove the "No contacts" message
    if (!firstItem) {
        // Check if there's a "No contacts yet" message and remove it
        const divs = conversationItems.querySelectorAll('div');
        divs.forEach(div => {
            if (div.textContent.includes('No contacts yet')) {
                div.remove();
            }
        });
        // Also clear if it's the only content
        if (conversationItems.textContent.includes('No contacts yet')) {
            conversationItems.innerHTML = '';
        }
    }

    // Re-check for first item after potentially clearing the message
    firstItem = conversationItems.querySelector('.conversation-item');

    // Create new contact element
    const newContact = document.createElement('div');
    newContact.className = 'conversation-item';
    newContact.style.opacity = '0';
    newContact.style.transform = 'translateY(-20px)';
    newContact.innerHTML = `
        <div class="avatar">${initials}</div>
        <div class="conversation-info">
            <div class="conversation-header">
                <span class="contact-name">${name}</span>
                <span class="time">Just now</span>
            </div>
            <div class="conversation-preview">
                <span class="sender">New contact added</span>
            </div>
        </div>
        <div class="unread-count" style="width: auto; padding: 0 4px; font-size: 8px; min-width: 16px;">NEW</div>
    `;

    // Insert at the top of the list (or as first item if list was empty)
    if (firstItem) {
        conversationItems.insertBefore(newContact, firstItem);
    } else {
        conversationItems.appendChild(newContact);
    }

    // Select the new contact BEFORE rebinding handlers
    newContact.classList.add('active');
    newContact.querySelector('.avatar').classList.add('selected');

    // Re-bind click handlers for ALL conversation items with correct indices
    document.querySelectorAll('.conversation-item').forEach((item, index) => {
        // Remove any existing click listeners by cloning
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);

        // Add new click listener with correct index
        newItem.addEventListener('click', function() {
            selectConversation(index);
        });

        // If this is the first item (our new contact), keep it selected and visible
        if (index === 0) {
            newItem.classList.add('active');
            newItem.querySelector('.avatar').classList.add('selected');
            // Make sure it's visible
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
            newItem.style.transition = 'all 0.5s ease';
        }
    });

    // Clear existing active states for all items except the first one (our new contact)
    document.querySelectorAll('.conversation-item').forEach((item, index) => {
        if (index !== 0) {
            item.classList.remove('active');
            item.querySelector('.avatar')?.classList.remove('selected');
        }
    });

    // UPDATE ALL 3 SECTIONS AT ONCE

    // 1. Update chat header
    const chatHeader = document.querySelector('.chat-contact-info h2');
    if (chatHeader) chatHeader.textContent = name;

    // Clear messages area
    const messagesArea = document.querySelector('.messages-area');
    if (messagesArea) {
        messagesArea.innerHTML = '<div style="text-align: center; color: #999; padding: 50px;">Start a conversation with ' + name + '</div>';
    }

    // 2. Update contact details panel
    const contactAvatar = document.querySelector('.contact-avatar');
    const contactNameH3 = document.querySelector('.contact-details-panel h3');
    if (contactAvatar) {
        contactAvatar.textContent = initials;
        contactAvatar.style.background = '#5e72e4';
    }
    if (contactNameH3) contactNameH3.textContent = name;

    // Update email
    const emailValue = document.querySelector('.detail-value');
    if (emailValue) emailValue.textContent = email;

    // Update phone
    const phoneValues = document.querySelectorAll('.detail-value');
    if (phoneValues[1]) phoneValues[1].textContent = phone;

    // Update currentConversation to the new one
    currentConversation = newConversation;

    // 3. Add tag
    const tagBadges = document.getElementById('contactTags');
    if (tagBadges) {
        // Clear existing tags
        tagBadges.innerHTML = '';

        // Add the new tag
        const tagBadge = document.createElement('span');
        tagBadge.className = 'tag-badge';
        tagBadge.innerHTML = `<i class="fas fa-tag"></i>${tagName}`;
        tagBadges.appendChild(tagBadge);
    }

    // Play contact creation sound after a brief delay
    await sleep(100);
    playContactSound();

    // Update unread count after a brief delay
    await sleep(500);
    const firstContactItem = document.querySelector('.conversation-item');
    const unreadBadge = firstContactItem?.querySelector('.unread-count');
    if (unreadBadge) {
        unreadBadge.textContent = '1';
        unreadBadge.style.background = '#5e72e4';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playClickSound() {
    const audio = document.getElementById('clickSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function playSuccessSound() {
    const audio = document.getElementById('chachingSound');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function playMessageSound() {
    const audio = document.getElementById('messageNotification');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Message notification play failed:', e));
    }
}

function playContactSound() {
    const audio = document.getElementById('contactNotification');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Contact notification play failed:', e));
    }
}

// Scenario Management
let scenarioSteps = [];
let isScenarioPlaying = false;
let scenarioTimeout = null;

// Add Scenario Step
function addScenarioStep() {
    const stepType = document.getElementById('stepType').value;
    const stepContent = document.getElementById('stepContent').value;
    
    if (!stepContent && stepType !== 'typing') {
        alert('Please enter content for this step');
        return;
    }
    
    const step = {
        id: Date.now(),
        type: stepType,
        content: stepContent || '',
        delay: stepType === 'delay' ? parseInt(stepContent) || 1000 : 1000
    };
    
    scenarioSteps.push(step);
    renderScenarioList();
    
    // Clear input
    document.getElementById('stepContent').value = '';
}

// Render Scenario List
function renderScenarioList() {
    const listElement = document.getElementById('scenarioStepsList');
    
    if (scenarioSteps.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No steps added yet</div>';
        return;
    }
    
    listElement.innerHTML = scenarioSteps.map((step, index) => {
        let displayText = '';
        let icon = '';
        
        switch(step.type) {
            case 'incoming':
                icon = '📥';
                displayText = step.content;
                break;
            case 'outgoing':
                icon = '📤';
                displayText = step.content;
                break;
            case 'typing':
                icon = '⌨️';
                displayText = 'Show typing indicator';
                break;
            case 'delay':
                icon = '⏱️';
                displayText = `Wait ${step.content}ms`;
                break;
        }
        
        return `
            <div class="scenario-step">
                <div class="step-info">
                    <span class="step-number">${index + 1}.</span>
                    <span class="step-type">${icon} ${step.type.toUpperCase()}</span>
                    <span class="step-content">${displayText}</span>
                </div>
                <div class="step-actions">
                    ${index > 0 ? `<button onclick="moveStep(${index}, -1)">↑</button>` : ''}
                    ${index < scenarioSteps.length - 1 ? `<button onclick="moveStep(${index}, 1)">↓</button>` : ''}
                    <button onclick="removeStep(${index})">×</button>
                </div>
            </div>
        `;
    }).join('');
}

// Move Step
function moveStep(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < scenarioSteps.length) {
        const temp = scenarioSteps[index];
        scenarioSteps[index] = scenarioSteps[newIndex];
        scenarioSteps[newIndex] = temp;
        renderScenarioList();
    }
}

// Remove Step
function removeStep(index) {
    scenarioSteps.splice(index, 1);
    renderScenarioList();
}

// Clear Scenario
function clearScenario() {
    if (isScenarioPlaying && typeof stopScenario === 'function') {
        stopScenario();
    }
    scenarioSteps = [];
    renderScenarioList();
}

// Helper function to wait
function wait(ms) {
    return new Promise(resolve => {
        scenarioTimeout = setTimeout(resolve, ms);
    });
}

// Play Scenario
function playScenario() {
    if (isScenarioPlaying) return;

    if (scenarioSteps.length === 0) {
        alert('No scenario steps to play! Add some steps first.');
        return;
    }

    isScenarioPlaying = true;
    const speedSelect = document.getElementById('playbackSpeed');
    const speed = speedSelect ? speedSelect.value : 'medium';

    // Base delays for each speed
    const baseDelay = {
        slow: 2500,
        medium: 1500,
        fast: 1000
    }[speed] || 1500;

    // Clear "No messages yet" placeholder right at the start
    const messagesArea = document.querySelector('.messages-area');
    if (messagesArea) {
        if (messagesArea.innerHTML.includes('No messages yet') || messagesArea.innerHTML.includes('Start a conversation') || messagesArea.innerHTML.includes('Select a conversation')) {
            messagesArea.innerHTML = '';
            // Add date divider since we're starting fresh
            const now = new Date();
            const dateDivider = document.createElement('div');
            dateDivider.className = 'date-divider';
            dateDivider.innerHTML = `<span>${now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>`;
            messagesArea.appendChild(dateDivider);
        }
    }

    let currentIndex = 0;

    function processNextStep() {
        if (!isScenarioPlaying || currentIndex >= scenarioSteps.length) {
            isScenarioPlaying = false;
            return;
        }

        const step = scenarioSteps[currentIndex];
        currentIndex++;

        switch(step.type) {
            case 'incoming':
                // Show typing first
                showTypingIndicator();

                // After typing duration, show message
                scenarioTimeout = setTimeout(() => {
                    hideTypingIndicator();
                    addMessage(step.content, 'incoming');

                    // Wait before next step
                    scenarioTimeout = setTimeout(() => {
                        processNextStep();
                    }, baseDelay);
                }, 1500); // Typing duration
                break;

            case 'outgoing':
                // Show message immediately
                addMessage(step.content, 'outgoing');

                // Wait before next step
                scenarioTimeout = setTimeout(() => {
                    processNextStep();
                }, baseDelay);
                break;

            case 'typing':
                showTypingIndicator();

                scenarioTimeout = setTimeout(() => {
                    hideTypingIndicator();
                    // Small pause after hiding typing
                    scenarioTimeout = setTimeout(() => {
                        processNextStep();
                    }, 300);
                }, 2000); // Show typing for 2 seconds
                break;

            case 'delay':
                const delayTime = parseInt(step.content) || 1000;

                scenarioTimeout = setTimeout(() => {
                    processNextStep();
                }, delayTime);
                break;

            default:
                // Unknown type, continue
                processNextStep();
                break;
        }
    }

    // Start with a small initial delay
    scenarioTimeout = setTimeout(() => {
        processNextStep();
    }, 500);
}

// Show typing indicator
function showTypingIndicator() {
    const messagesArea = document.querySelector('.messages-area');
    if (!messagesArea) return;

    // Remove any existing typing indicator
    hideTypingIndicator();

    // Create typing indicator element
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-group incoming">
            <div class="avatar-small">${currentConversation && currentConversation.initials ? currentConversation.initials : 'CT'}</div>
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    messagesArea.appendChild(typingDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Stop Scenario
function stopScenario() {
    isScenarioPlaying = false;
    if (scenarioTimeout) {
        clearTimeout(scenarioTimeout);
        scenarioTimeout = null;
    }
    // Remove any lingering typing indicator when stopping
    hideTypingIndicator();
}

// Add Message to Conversation
function addMessage(text, type = 'outgoing') {
    const messagesArea = document.querySelector('.messages-area');
    if (!messagesArea) return;

    // Clear "no messages" placeholder if it exists
    const isFirstMessage = messagesArea.innerHTML.includes('No messages yet') || messagesArea.innerHTML.includes('Start a conversation');
    if (isFirstMessage) {
        messagesArea.innerHTML = '';
    }

    // Create message object
    const now = new Date();
    const message = {
        text: text,
        type: type,
        sender: type === 'outgoing' ? 'AI Assistant' : (currentConversation ? currentConversation.name : 'Contact'),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
    };

    // Only add date divider if this is the first message or if there are no date dividers yet
    const existingDateDivider = messagesArea.querySelector('.date-divider');
    if (!existingDateDivider) {
        const dateDivider = document.createElement('div');
        dateDivider.className = 'date-divider';
        dateDivider.innerHTML = `<span>${message.date}</span>`;
        messagesArea.appendChild(dateDivider);
    }

    // Create and add message element
    const messageGroup = createConversationMessageElement(message);
    messagesArea.appendChild(messageGroup);

    // Add to current conversation's messages if exists
    if (currentConversation) {
        currentConversation.messages.push(message);
    }

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Play message sound
    playMessageSound();
}

// Save Custom Scenario
function saveCustomScenario() {
    const scenarioNameInput = document.getElementById('scenarioName');
    if (!scenarioNameInput) {
        console.error('Scenario name input not found');
        return;
    }

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
    const savedScenarios = JSON.parse(localStorage.getItem('ghlCrmSimulatorScenarios')) || {};

    // Save the current scenario
    savedScenarios[name] = {
        name: name,
        steps: scenarioSteps,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('ghlCrmSimulatorScenarios', JSON.stringify(savedScenarios));

    // Clear the input
    scenarioNameInput.value = '';

    // Show success message
    alert(`Scenario "${name}" saved successfully!`);

    // Refresh the saved scenarios list
    loadSavedScenarios();
}

// Load Saved Scenarios
function loadSavedScenarios() {
    const savedScenarios = JSON.parse(localStorage.getItem('ghlCrmSimulatorScenarios')) || {};
    const savedScenariosList = document.getElementById('savedScenariosList');

    if (!savedScenariosList) return;

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

// Load a Saved Scenario
function loadScenario(name) {
    const savedScenarios = JSON.parse(localStorage.getItem('ghlCrmSimulatorScenarios')) || {};

    if (!savedScenarios[name]) {
        alert('Scenario not found!');
        return;
    }

    // Load the scenario steps
    scenarioSteps = savedScenarios[name].steps;

    // Update the scenario list display - use renderScenarioList for conversation screen
    if (typeof renderScenarioList === 'function') {
        renderScenarioList();
    } else if (typeof updateScenarioList === 'function') {
        updateScenarioList();
    }

    alert(`Loaded scenario: ${name}`);
}

// Clear all conversations/contacts
function clearConversations() {
    // Only clear the conversation items, not the entire structure
    const conversationItems = document.querySelector('.conversation-items');
    if (conversationItems) {
        conversationItems.innerHTML = `
            <div style="text-align: center; color: #999; padding: 50px; font-size: 14px;">
                No conversations yet
            </div>
        `;
    }

    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = '0 RESULTS';
    }

    // Clear the chat area
    const messagesArea = document.querySelector('.messages-area');
    if (messagesArea) {
        messagesArea.innerHTML = '<div style="text-align: center; color: #999; padding: 50px;">Select a conversation to start messaging</div>';
    }

    // Clear the chat header
    const chatHeader = document.querySelector('.chat-contact-info h2');
    if (chatHeader) chatHeader.textContent = 'Select a conversation';

    // Clear the conversations object
    conversations = {};
    currentConversation = null;

    // Clear the contact details panel
    const contactAvatar = document.querySelector('.contact-avatar');
    const contactNameH3 = document.querySelector('.contact-details-panel h3');
    if (contactAvatar) {
        contactAvatar.textContent = '';
        contactAvatar.style.background = '#e0e0e0';
    }
    if (contactNameH3) contactNameH3.textContent = 'Select a contact';

    console.log('All conversations cleared');
}

// Remove a scenario step from conversation
function removeScenarioStep(index) {
    scenarioSteps.splice(index, 1);
    updateScenarioList();
}

// Delete a Saved Scenario
function deleteScenario(name) {
    if (!confirm(`Are you sure you want to delete the scenario "${name}"?`)) {
        return;
    }

    const savedScenarios = JSON.parse(localStorage.getItem('ghlCrmSimulatorScenarios')) || {};
    delete savedScenarios[name];
    localStorage.setItem('ghlCrmSimulatorScenarios', JSON.stringify(savedScenarios));

    loadSavedScenarios();
}


// Get Speed Multiplier
function getSpeedMultiplier() {
    const speed = document.getElementById('playbackSpeed').value;
    switch(speed) {
        case 'slow':
            return 1.5;
        case 'fast':
            return 0.5;
        case 'normal':
        default:
            return 1;
    }
}

// Opportunities Screen Functionality
let opportunityAnimationInterval = null;
// Make opportunityCards global
if (!window.opportunityCards) {
    window.opportunityCards = [];
}
let opportunityCards = window.opportunityCards;

// Initialize Opportunities
function initializeOpportunities() {
    // Load saved stage names when initializing opportunities
    loadSavedStageNames();
    // Load saved pipeline name when initializing opportunities
    loadSavedPipelineName();

    // Start with empty pipeline
    window.opportunityCards = [];
    opportunityCards = window.opportunityCards;

    renderOpportunityCards();
    initializeDragAndDrop();
    updateStageCounters();
}

// Render Opportunity Cards
function renderOpportunityCards() {
    // Use global opportunityCards
    const cards = window.opportunityCards || [];
    console.log('Rendering opportunity cards:', cards);

    // Clear all stages first
    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];

    stages.forEach(stageId => {
        const stageCards = document.getElementById(`${stageId}-cards`);
        if (stageCards) {
            stageCards.innerHTML = '';
        } else {
            console.log(`Stage cards not found: ${stageId}-cards`);
        }
    });

    // Add cards to their respective stages
    cards.forEach(card => {
        const stageCards = document.getElementById(`${card.stage}-cards`);
        if (stageCards) {
            const cardElement = createOpportunityCard(card);
            stageCards.appendChild(cardElement);
            console.log(`Added card to stage ${card.stage}:`, card.name);
        } else {
            console.log(`Could not find stage cards for: ${card.stage}-cards`);
        }
    });
}

// Create Opportunity Card Element
function createOpportunityCard(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'opportunity-card';
    cardDiv.draggable = true;
    cardDiv.dataset.cardId = card.id;

    // Format the card based on new design
    cardDiv.innerHTML = `
        <div class="card-main-header">
            <div class="card-title">${card.name}</div>
            <div class="card-avatar-circle">${card.avatar || 'PA'}</div>
        </div>
        <div class="card-details">
            <div class="card-detail-row">
                <span class="detail-label">Opportunity Source:</span>
                <span class="detail-value">${card.source || 'Automate My Biz - AI...'}</span>
            </div>
            <div class="card-detail-row">
                <span class="detail-label">Opportunity Value:</span>
                <span class="detail-value">$${card.value}</span>
            </div>
        </div>
        <div class="card-actions-row">
            <button class="card-icon-btn" title="Call"><i class="fas fa-phone"></i></button>
            <button class="card-icon-btn" title="WhatsApp"><i class="fas fa-comment"></i></button>
            <button class="card-icon-btn" title="Favorite"><i class="fas fa-heart"></i></button>
            <button class="card-icon-btn" title="Task"><i class="fas fa-check-square"></i></button>
            <button class="card-icon-btn" title="Calendar"><i class="fas fa-calendar-alt"></i></button>
            <button class="card-icon-btn card-delete-icon" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add drag event listeners
    cardDiv.addEventListener('dragstart', handleDragStart);
    cardDiv.addEventListener('dragend', handleDragEnd);

    // Add click event listener for delete button after DOM is ready
    setTimeout(() => {
        const deleteBtn = cardDiv.querySelector('.card-delete-icon');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteOpportunityCard(card.id);
            });
        }
    }, 0);

    return cardDiv;
}

// Initialize Drag and Drop
function initializeDragAndDrop() {
    const stageColumns = document.querySelectorAll('.stage-column');

    stageColumns.forEach(stage => {
        const stageCards = stage.querySelector('.stage-cards');

        if (stageCards) {
            stageCards.addEventListener('dragover', handleDragOver);
            stageCards.addEventListener('drop', handleDrop);
            stageCards.addEventListener('dragenter', handleDragEnter);
            stageCards.addEventListener('dragleave', handleDragLeave);
        }
    });
}

// Drag and Drop Handlers
let draggedCard = null;
let dropIndicator = null;

function handleDragStart(e) {
    draggedCard = e.target.closest('.opportunity-card');
    if (draggedCard) {
        draggedCard.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedCard.innerHTML);
    }
}

function handleDragEnd(e) {
    if (draggedCard) {
        draggedCard.style.opacity = '';
    }
    draggedCard = null;

    // Remove drop indicator if it exists
    if (dropIndicator) {
        dropIndicator.remove();
        dropIndicator = null;
    }

    // Remove all drag-over classes and placeholders
    document.querySelectorAll('.stage-cards').forEach(stage => {
        stage.classList.remove('drag-over');
    });
    document.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
    const stageCards = e.currentTarget;

    // Remove existing placeholder
    const existingPlaceholder = stageCards.querySelector('.drop-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }

    // Create and insert placeholder
    if (draggedCard && stageCards.classList.contains('stage-cards')) {
        const placeholder = createDropPlaceholder();

        if (afterElement == null) {
            stageCards.appendChild(placeholder);
        } else {
            stageCards.insertBefore(placeholder, afterElement);
        }
    }

    return false;
}

function handleDragEnter(e) {
    if (e.currentTarget.classList.contains('stage-cards')) {
        e.currentTarget.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.currentTarget.classList.contains('stage-cards')) {
        // Only remove if we're actually leaving the container
        const rect = e.currentTarget.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom) {
            e.currentTarget.classList.remove('drag-over');
            const placeholder = e.currentTarget.querySelector('.drop-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
        }
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const stageCards = e.currentTarget;
    const placeholder = stageCards.querySelector('.drop-placeholder');

    if (draggedCard && stageCards.classList.contains('stage-cards')) {
        // Find where to insert the card
        if (placeholder) {
            placeholder.replaceWith(draggedCard);
        } else {
            const afterElement = getDragAfterElement(stageCards, e.clientY);
            if (afterElement == null) {
                stageCards.appendChild(draggedCard);
            } else {
                stageCards.insertBefore(draggedCard, afterElement);
            }
        }

        // Update the card data
        const cardId = parseInt(draggedCard.dataset.cardId);
        const stageColumn = stageCards.closest('.stage-column');
        const newStage = stageColumn ? stageColumn.getAttribute('data-stage') : null;

        if (newStage) {
            const card = window.opportunityCards.find(c => c.id === cardId);
            if (card) {
                card.stage = newStage;
            }
        }

        // Update counters
        updateStageCounters();

        // Remove drag-over class
        stageCards.classList.remove('drag-over');
    }

    // Clean up any remaining placeholders
    document.querySelectorAll('.drop-placeholder').forEach(p => p.remove());

    return false;
}

// Helper function to determine where to insert the dragged element
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.opportunity-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Create a placeholder element
function createDropPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';
    return placeholder;
}

// Update Stage Counters and Values
function updateStageCounters() {
    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];

    stages.forEach(stageId => {
        const stageColumn = document.querySelector(`[data-stage="${stageId}"]`);
        if (stageColumn) {
            const counter = stageColumn.querySelector('.stage-count');
            const valueElement = stageColumn.querySelector('.stage-value');
            const stageCards = document.getElementById(`${stageId}-cards`);
            const cards = stageCards ? stageCards.querySelectorAll('.opportunity-card') : [];

            // Update count
            const count = cards.length;
            if (counter) {
                counter.textContent = count + (count === 1 ? ' Opportunity' : ' Opportunities');
            }

            // Calculate total value for this stage
            let totalValue = 0;
            const cardsInStage = window.opportunityCards.filter(c => c.stage === stageId);
            cardsInStage.forEach(card => {
                // Parse value removing $ and commas
                const value = parseFloat(card.value.replace(/[$,]/g, '')) || 0;
                totalValue += value;
            });

            // Update value display
            if (valueElement) {
                valueElement.textContent = '$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        }
    });
}

// Start Opportunity Animation
function startOpportunityAnimation() {
    if (opportunityAnimationInterval) {
        clearInterval(opportunityAnimationInterval);
    }

    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];
    let currentStageIndex = 0;

    // Get a random card from demo-requested
    const demoRequestedCards = window.opportunityCards.filter(c => c.stage === 'demo-requested');
    if (demoRequestedCards.length === 0) {
        // Reset some cards back to demo-requested if all have moved
        opportunityCards.forEach((card, index) => {
            if (index < 3) {
                card.stage = 'demo-requested';
            }
        });
        renderOpportunityCards();
        updateStageCounters();
        return;
    }

    const cardToMove = demoRequestedCards[Math.floor(Math.random() * demoRequestedCards.length)];

    opportunityAnimationInterval = setInterval(() => {
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            cardToMove.stage = stages[currentStageIndex];

            // Animate the movement
            renderOpportunityCards();
            updateStageCounters();

            // Highlight the moved card
            setTimeout(() => {
                const movedCard = document.querySelector(`[data-card-id="${cardToMove.id}"]`);
                if (movedCard) {
                    movedCard.classList.add('highlight');
                    setTimeout(() => {
                        movedCard.classList.remove('highlight');
                    }, 500);
                }
            }, 100);

            // Stop at a random stage sometimes
            if (Math.random() > 0.6 && currentStageIndex > 1) {
                clearInterval(opportunityAnimationInterval);
                opportunityAnimationInterval = null;
            }
        } else {
            clearInterval(opportunityAnimationInterval);
            opportunityAnimationInterval = null;
        }
    }, 2000);
}

// Stop Opportunity Animation
function stopOpportunityAnimation() {
    if (opportunityAnimationInterval) {
        clearInterval(opportunityAnimationInterval);
        opportunityAnimationInterval = null;
    }
}

// Add Contact Opportunity from Control Panel
function addContactOpportunity() {
    console.log('addContactOpportunity called');
    // Initialize opportunities if not already initialized
    if (!window.opportunitiesInitialized) {
        initializeOpportunities();
        window.opportunitiesInitialized = true;
    }

    const nameInput = document.getElementById('contactName');
    const valueInput = document.getElementById('opportunityValue');
    const sourceInput = document.getElementById('opportunitySource');
    const stageSelect = document.getElementById('targetStageSelect');

    if (nameInput && valueInput) {
        const name = nameInput.value || 'New Contact';
        const value = parseFloat(valueInput.value) || 0;
        const source = sourceInput.value || 'Direct';
        const stage = stageSelect.value;

        // Generate initials from name
        const nameParts = name.split(' ');
        const initials = nameParts.length >= 2
            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();

        const newCard = {
            id: Date.now(),
            name: name,
            value: value.toFixed(2),
            source: source,
            stage: stage,
            avatar: initials
        };

        window.opportunityCards.push(newCard);

        console.log('Adding card:', newCard);
        console.log('Total cards:', window.opportunityCards.length);

        // Make sure the opportunities screen is visible
        const opportunitiesScreen = document.getElementById('opportunities-screen');
        const calendarScreen = document.getElementById('calendar-screen');
        const conversationsScreen = document.getElementById('conversations-screen');

        if (opportunitiesScreen) {
            opportunitiesScreen.style.display = 'block';
        }
        if (calendarScreen) {
            calendarScreen.style.display = 'none';
        }
        if (conversationsScreen) {
            conversationsScreen.style.display = 'none';
        }

        // Update nav
        const navItems = document.querySelectorAll('.nav-item[data-screen]');
        navItems.forEach(nav => nav.classList.remove('active'));
        const opportunitiesNav = document.querySelector('.nav-item[data-screen="opportunities"]');
        if (opportunitiesNav) opportunitiesNav.classList.add('active');

        renderOpportunityCards();
        updateStageCounters();

        // Clear inputs
        nameInput.value = '';
        valueInput.value = '';
        sourceInput.value = '';

        // Highlight the new card
        setTimeout(() => {
            const addedCard = document.querySelector(`[data-card-id="${newCard.id}"]`);
            if (addedCard) {
                addedCard.classList.add('highlight');
                setTimeout(() => {
                    addedCard.classList.remove('highlight');
                }, 1000);
            }
        }, 100);
    } else {
        alert('Please enter at least a contact name to add an opportunity.');
    }
}

// Add New Opportunity
function addNewOpportunity() {
    const names = [
        'Alex Thompson', 'Jordan Lee', 'Taylor Brown', 'Casey Miller',
        'Morgan Davis', 'Riley Johnson', 'Avery Wilson', 'Quinn Anderson'
    ];
    const companies = [
        'techstart', 'bizpro', 'salesmax', 'growthco', 'innovate', 'nexgen', 'future', 'digital'
    ];
    const domains = ['.com', '.io', '.net', '.co', '.biz'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomValue = Math.floor(Math.random() * 15000) + 2000;

    const newCard = {
        id: Date.now(),
        name: randomName,
        email: `${randomName.toLowerCase().replace(' ', '.')}@${randomCompany}${randomDomain}`,
        value: `$${randomValue.toLocaleString()}`,
        stage: 'demo-requested',
        avatar: '👤'
    };

    window.opportunityCards.push(newCard);
    renderOpportunityCards();
    updateStageCounters();

    // Highlight the new card
    setTimeout(() => {
        const addedCard = document.querySelector(`[data-card-id="${newCard.id}"]`);
        if (addedCard) {
            addedCard.classList.add('highlight');
            setTimeout(() => {
                addedCard.classList.remove('highlight');
            }, 1000);
        }
    }, 100);
}

// Move Card to Stage
function moveCardToStage(targetStage) {
    // Get cards from earlier stages
    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];
    const targetIndex = stages.indexOf(targetStage);

    let cardToMove = null;

    // Find a card from an earlier stage
    for (let i = 0; i < targetIndex; i++) {
        const cardsInStage = window.opportunityCards.filter(c => c.stage === stages[i]);
        if (cardsInStage.length > 0) {
            cardToMove = cardsInStage[0];
            break;
        }
    }

    if (cardToMove) {
        cardToMove.stage = targetStage;
        renderOpportunityCards();
        updateStageCounters();

        // Highlight the moved card
        setTimeout(() => {
            const movedCard = document.querySelector(`[data-card-id="${cardToMove.id}"]`);
            if (movedCard) {
                movedCard.classList.add('highlight');
                setTimeout(() => {
                    movedCard.classList.remove('highlight');
                }, 1000);
            }
        }, 100);
    } else {
        // If no cards in earlier stages, create a new one
        addNewOpportunity();
        setTimeout(() => {
            const newCard = opportunityCards[window.opportunityCards.length - 1];
            newCard.stage = targetStage;
            renderOpportunityCards();
            updateStageCounters();
        }, 500);
    }
}

// Delete specific opportunity card
function deleteOpportunityCard(cardId) {
    // Remove card from array
    window.opportunityCards = window.window.opportunityCards.filter(card => card.id !== cardId);

    // Re-render cards
    renderOpportunityCards();
    updateStageCounters();

    // Play sound effect if available
    if (typeof playSound === 'function') {
        playSound('popSound');
    }
}

// Clear All Opportunities
function clearOpportunities() {
    // Initialize opportunities if not already initialized
    if (!window.opportunitiesInitialized) {
        initializeOpportunities();
        window.opportunitiesInitialized = true;
    }

    stopOpportunityAnimation();
    window.window.opportunityCards = [];
    renderOpportunityCards();
    updateStageCounters();
}

// Quick Fill Pipeline
function quickFillPipeline() {
    console.log('quickFillPipeline called');
    // Initialize opportunities if not already initialized
    if (!window.opportunitiesInitialized) {
        initializeOpportunities();
        window.opportunitiesInitialized = true;
    }

    // Clear existing and add sample opportunities
    window.opportunityCards = [
        {
            id: 1,
            name: 'Sarah Johnson',
            value: '5000.00',
            source: 'Automate My Biz - AI Demo',
            stage: 'demo-requested',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Mike Chen',
            value: '3500.00',
            source: 'LinkedIn Outreach',
            stage: 'demo-requested',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Emily Davis',
            value: '7500.00',
            source: 'Website Form',
            stage: 'demo-scheduled',
            avatar: 'ED'
        },
        {
            id: 4,
            name: 'James Wilson',
            value: '12000.00',
            source: 'Referral Program',
            stage: 'demo-scheduled',
            avatar: 'JW'
        },
        {
            id: 5,
            name: 'Lisa Martinez',
            value: '4200.00',
            source: 'Cold Email Campaign',
            stage: 'demo-scheduled',
            avatar: 'LM'
        },
        {
            id: 6,
            name: 'Robert Taylor',
            value: '8800.00',
            source: 'Facebook Ads',
            stage: 'demo-no-show',
            avatar: 'RT'
        },
        {
            id: 7,
            name: 'Anna Brown',
            value: '6000.00',
            source: 'Google Ads',
            stage: 'demo-converted',
            avatar: 'AB'
        },
        {
            id: 8,
            name: 'David Lee',
            value: '15000.00',
            source: 'Partner Referral',
            stage: 'demo-converted',
            avatar: 'DL'
        },
        {
            id: 9,
            name: 'Sophie Anderson',
            value: '4500.00',
            source: 'Trade Show',
            stage: 'client-not-converted',
            avatar: 'SA'
        },
        {
            id: 10,
            name: 'Chris Walker',
            value: '9200.00',
            source: 'Webinar Funnel',
            stage: 'demo-converted',
            avatar: 'CW'
        }
    ];

    renderOpportunityCards();
    updateStageCounters();
}

// Card Animation Variables
let animatedMoveMode = false;
let selectedCardForAnimation = null;
let selectedCardElement = null;

// Opportunity Animation Scenario System
let opportunityScenario = [];
let isRecordingMove = false;
let isPlayingScenario = false;
let currentScenarioStep = 0;

// Start animated move mode
function startAnimatedMove() {
    const btn = document.getElementById('animatedMoveBtn');
    const statusLabel = document.getElementById('animationStatusLabel');

    if (animatedMoveMode) {
        // Cancel mode
        cancelAnimatedMove();
        return;
    }

    // Enter card selection mode
    animatedMoveMode = 'select-card';
    btn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    btn.classList.add('active');
    statusLabel.textContent = 'Step 1: Click on a card to select it';

    // Add selection mode to all cards
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.add('selectable-card');
        card.addEventListener('click', handleCardSelection);
    });
}

// Handle card selection
function handleCardSelection(e) {
    if (animatedMoveMode !== 'select-card') return;

    e.stopPropagation();
    e.preventDefault();

    // Remove previous selection
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.remove('selected-for-animation');
    });

    // Select this card
    const card = e.currentTarget;
    card.classList.add('selected-for-animation');
    selectedCardElement = card;
    selectedCardForAnimation = card.dataset.cardId;

    // Update UI
    const cardName = card.querySelector('.card-title').textContent;
    document.getElementById('selectedCardName').textContent = cardName;
    document.getElementById('selectedCardInfo').style.display = 'block';
    document.getElementById('animationStatusLabel').textContent = 'Step 2: Click where you want to place the card';

    // Switch to destination selection mode
    animatedMoveMode = 'select-destination';

    // Remove card click handlers and add destination handlers
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.remove('selectable-card');
        card.removeEventListener('click', handleCardSelection);
    });

    // Add destination indicators
    addDestinationIndicators();
}

// Add visual destination indicators
function addDestinationIndicators() {
    const stages = document.querySelectorAll('.stage-cards');

    stages.forEach(stage => {
        // Add drop zone at the top of each stage
        const topIndicator = createDropIndicator('top');
        topIndicator.addEventListener('click', (e) => handleDestinationSelection(e, stage, 'top'));
        stage.insertBefore(topIndicator, stage.firstChild);

        // Add drop zones between cards
        const cards = stage.querySelectorAll('.opportunity-card');
        cards.forEach((card) => {
            if (card !== selectedCardElement) {
                const indicator = createDropIndicator('between');
                indicator.addEventListener('click', (e) => handleDestinationSelection(e, stage, 'after', card));
                card.parentNode.insertBefore(indicator, card.nextSibling);
            }
        });

        // Make stage clickable for empty stages
        if (cards.length === 0 || (cards.length === 1 && cards[0] === selectedCardElement)) {
            stage.classList.add('drop-zone-active');
            stage.addEventListener('click', handleEmptyStageClick);
        }
    });
}

// Create a drop indicator element
function createDropIndicator(type) {
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator-interactive';
    indicator.innerHTML = '<div class="drop-line"></div><div class="drop-text">Click to place here</div>';
    return indicator;
}

// Handle destination selection
function handleDestinationSelection(e, stage, position, afterCard) {
    e.stopPropagation();
    if (animatedMoveMode !== 'select-destination') return;

    // Perform the animated move
    performAnimatedMove(stage, position, afterCard);
}

// Handle clicking on empty stage
function handleEmptyStageClick(e) {
    if (e.target !== e.currentTarget) return;
    handleDestinationSelection(e, e.currentTarget, 'top');
}

// Perform the animated move with kanban-style indicator
function performAnimatedMove(targetStage, position, afterCard) {
    if (!selectedCardElement) return;

    const cardId = parseInt(selectedCardForAnimation);
    const card = window.opportunityCards.find(c => c.id === cardId);
    if (!card) return;

    // First show the blue placement line
    const placementLine = document.createElement('div');
    placementLine.className = 'drop-placeholder';
    placementLine.style.height = '3px';
    placementLine.style.background = '#5643ce';
    placementLine.style.margin = '4px 0';
    placementLine.style.borderRadius = '2px';
    placementLine.style.animation = 'pulse 1s infinite';

    // Insert placeholder at destination
    if (position === 'top') {
        targetStage.insertBefore(placementLine, targetStage.firstChild);
    } else if (position === 'after' && afterCard) {
        afterCard.parentNode.insertBefore(placementLine, afterCard.nextSibling);
    }

    // Create clone for animation
    const cardClone = selectedCardElement.cloneNode(true);
    cardClone.style.position = 'fixed';
    cardClone.style.zIndex = '1000';
    cardClone.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    cardClone.style.pointerEvents = 'none';
    cardClone.classList.remove('selected-for-animation');

    // Get positions
    const startRect = selectedCardElement.getBoundingClientRect();
    const destRect = placementLine.getBoundingClientRect();

    // Set initial position
    cardClone.style.left = startRect.left + 'px';
    cardClone.style.top = startRect.top + 'px';
    cardClone.style.width = startRect.width + 'px';
    document.body.appendChild(cardClone);

    // Hide original
    selectedCardElement.style.opacity = '0';

    // Animate to destination
    setTimeout(() => {
        cardClone.style.left = destRect.left + 'px';
        cardClone.style.top = destRect.top + 'px';
        cardClone.style.transform = 'scale(0.95)';
    }, 50);

    // After animation, update data
    setTimeout(() => {
        // Update card stage
        const newStageId = targetStage.id.replace('-cards', '');
        card.stage = newStageId;

        // Remove placeholder
        placementLine.remove();

        // Re-render cards
        renderOpportunityCards();
        updateStageCounters();

        // Clean up clone
        cardClone.remove();

        // Reset mode
        cancelAnimatedMove();

        // Play sound
        if (typeof playSound === 'function') {
            playSound('swooshSound');
        }
    }, 850);
}

// Cancel animated move mode  
function cancelAnimatedMove() {
    animatedMoveMode = false;
    selectedCardForAnimation = null;
    selectedCardElement = null;

    // Clean up UI
    const btn = document.getElementById('animatedMoveBtn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-hand-pointer"></i> Start Animated Move';
        btn.classList.remove('active');
    }
    
    const statusLabel = document.getElementById('animationStatusLabel');
    if (statusLabel) {
        statusLabel.textContent = 'Click button to start';
    }
    
    const cardInfo = document.getElementById('selectedCardInfo');
    if (cardInfo) {
        cardInfo.style.display = 'none';
    }

    // Remove all classes and handlers
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.remove('selectable-card', 'selected-for-animation');
        card.removeEventListener('click', handleCardSelection);
    });

    // Remove indicators
    document.querySelectorAll('.drop-indicator-interactive').forEach(ind => ind.remove());
    document.querySelectorAll('.drop-zone-active').forEach(zone => {
        zone.classList.remove('drop-zone-active');
        zone.removeEventListener('click', handleEmptyStageClick);
    });
}

// Record a move for scenario
window.recordOpportunityMove = function() {
    const btn = document.getElementById('recordMoveBtn');

    if (isRecordingMove) {
        // Cancel recording
        cancelRecordingMove();
        return;
    }

    // Start recording mode
    isRecordingMove = true;
    btn.innerHTML = '<i class="fas fa-times"></i> Cancel Recording';
    btn.classList.add('active');

    // Show instruction
    alert('Step 1: Click on a card to select it\nStep 2: Click where you want to move it');

    // Enable card selection
    enableCardSelectionForRecording();
};

// Enable card selection for recording
function enableCardSelectionForRecording() {
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.add('recordable-card');
        card.addEventListener('click', handleRecordCardSelection);
    });
}

// Handle card selection during recording
function handleRecordCardSelection(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!isRecordingMove) return;

    const card = e.currentTarget;
    const cardId = card.dataset.cardId;
    const cardTitle = card.querySelector('.card-title').textContent;

    // Highlight selected card
    document.querySelectorAll('.opportunity-card').forEach(c => {
        c.classList.remove('recording-selected');
    });
    card.classList.add('recording-selected');

    // Remove card selection handlers
    document.querySelectorAll('.opportunity-card').forEach(c => {
        c.classList.remove('recordable-card');
        c.removeEventListener('click', handleRecordCardSelection);
    });

    // Now enable destination selection
    enableDestinationSelectionForRecording(cardId, cardTitle);
}

// Enable destination selection for recording
function enableDestinationSelectionForRecording(cardId, cardTitle) {
    const stages = document.querySelectorAll('.stage-cards');

    stages.forEach(stage => {
        // Add visual indicators for drop zones
        const cards = stage.querySelectorAll('.opportunity-card');

        // Add top indicator
        const topIndicator = document.createElement('div');
        topIndicator.className = 'record-drop-indicator';
        topIndicator.innerHTML = '<div class="drop-line"></div>';
        topIndicator.dataset.position = 'top';
        topIndicator.dataset.stage = stage.id.replace('-cards', '');
        topIndicator.addEventListener('click', (e) => handleRecordDestination(e, cardId, cardTitle));
        stage.insertBefore(topIndicator, stage.firstChild);

        // Add indicators between cards
        cards.forEach(card => {
            if (card.dataset.cardId !== cardId) {
                const indicator = document.createElement('div');
                indicator.className = 'record-drop-indicator';
                indicator.innerHTML = '<div class="drop-line"></div>';
                indicator.dataset.position = 'after';
                indicator.dataset.afterCardId = card.dataset.cardId;
                indicator.dataset.stage = stage.id.replace('-cards', '');
                indicator.addEventListener('click', (e) => handleRecordDestination(e, cardId, cardTitle));
                card.parentNode.insertBefore(indicator, card.nextSibling);
            }
        });
    });
}

// Handle destination selection during recording
function handleRecordDestination(e, cardId, cardTitle) {
    e.stopPropagation();

    const stage = e.currentTarget.dataset.stage;
    const position = e.currentTarget.dataset.position;
    const afterCardId = e.currentTarget.dataset.afterCardId;

    // Create scenario step
    const step = {
        cardId: cardId,
        cardTitle: cardTitle,
        fromStage: getCurrentStageForCard(cardId),
        toStage: stage,
        position: position,
        afterCardId: afterCardId || null
    };

    // Add to scenario
    opportunityScenario.push(step);

    // Update UI
    updateScenarioList();

    // Clean up recording mode
    cancelRecordingMove();

    // Enable play button if we have steps
    const playBtn = document.getElementById('playScenarioBtn');
    if (playBtn && opportunityScenario.length > 0) {
        playBtn.disabled = false;
    }
}

// Get current stage for a card
function getCurrentStageForCard(cardId) {
    const card = document.querySelector('[data-card-id="' + cardId + '"]');
    if (card) {
        const stageCards = card.closest('.stage-cards');
        if (stageCards) {
            return stageCards.id.replace('-cards', '');
        }
    }
    return null;
}

// Cancel recording mode
function cancelRecordingMove() {
    isRecordingMove = false;

    // Reset button
    const btn = document.getElementById('recordMoveBtn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-plus-circle"></i> Record Move';
        btn.classList.remove('active');
    }

    // Clean up UI
    document.querySelectorAll('.opportunity-card').forEach(card => {
        card.classList.remove('recordable-card', 'recording-selected');
        card.removeEventListener('click', handleRecordCardSelection);
    });

    document.querySelectorAll('.record-drop-indicator').forEach(indicator => {
        indicator.remove();
    });
}

// Update scenario list display
function updateScenarioList() {
    const listContainer = document.getElementById('opportunityScenarioList');
    if (!listContainer) return;

    if (opportunityScenario.length === 0) {
        listContainer.innerHTML = '<div class="empty-scenario-message" style="text-align: center; color: #999; padding: 20px; font-size: 11px;">No moves recorded yet</div>';
        return;
    }

    let html = '';
    opportunityScenario.forEach((step, index) => {
        const stageName = getStageName(step.toStage);
        html += '<div class="scenario-step" style="padding: 8px; background: #f5f5f5; border-radius: 4px; margin-bottom: 6px; font-size: 11px;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
        html += '<span><strong>' + (index + 1) + '.</strong> Move "' + step.cardTitle + '" to ' + stageName + '</span>';
        html += '<button onclick="removeScenarioStep(' + index + ')" style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 12px;">';
        html += '<i class="fas fa-times"></i></button></div></div>';
    });
    listContainer.innerHTML = html;
}

// Remove a scenario step
window.removeScenarioStep = function(index) {
    opportunityScenario.splice(index, 1);
    updateScenarioList();

    // Disable play button if no steps
    const playBtn = document.getElementById('playScenarioBtn');
    if (playBtn && opportunityScenario.length === 0) {
        playBtn.disabled = true;
    }
};

// Clear all scenario steps
window.clearOpportunityScenario = function() {
    opportunityScenario = [];
    updateScenarioList();

    const playBtn = document.getElementById('playScenarioBtn');
    if (playBtn) {
        playBtn.disabled = true;
    }
};

// Play the scenario
window.playOpportunityScenario = function() {
    if (isPlayingScenario || opportunityScenario.length === 0) return;

    isPlayingScenario = true;
    currentScenarioStep = 0;

    // Update UI
    const playBtn = document.getElementById('playScenarioBtn');
    const stopBtn = document.getElementById('stopScenarioBtn');
    if (playBtn) playBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'block';

    // Start playing steps
    playNextScenarioStep();
};

// Play next step in scenario
function playNextScenarioStep() {
    if (!isPlayingScenario || currentScenarioStep >= opportunityScenario.length) {
        // Finished playing
        stopOpportunityScenario();
        return;
    }

    const step = opportunityScenario[currentScenarioStep];
    const speedSelect = document.getElementById('animationSpeed');
    const speed = speedSelect ? speedSelect.value : 'normal';

    // Get timing based on speed
    let duration;
    switch(speed) {
        case 'slow': duration = 2000; break;
        case 'fast': duration = 1000; break;
        default: duration = 1500;
    }

    // Perform the animated move
    performScenarioMove(step);

    // Schedule next step
    currentScenarioStep++;
    setTimeout(() => {
        playNextScenarioStep();
    }, duration);
}

// Perform a scenario move
function performScenarioMove(step) {
    const card = document.querySelector('[data-card-id="' + step.cardId + '"]');
    if (!card) return;

    const targetStage = document.getElementById(step.toStage + '-cards');
    if (!targetStage) return;

    // Create blue indicator line first
    const placementLine = document.createElement('div');
    placementLine.className = 'drop-placeholder';
    placementLine.style.cssText = 'height: 3px; background: #5643ce; margin: 4px 0; border-radius: 2px; animation: pulse 1s infinite;';

    // Insert placeholder at destination
    if (step.position === 'top') {
        targetStage.insertBefore(placementLine, targetStage.firstChild);
    } else if (step.position === 'after' && step.afterCardId) {
        const afterCard = targetStage.querySelector('[data-card-id="' + step.afterCardId + '"]');
        if (afterCard) {
            afterCard.parentNode.insertBefore(placementLine, afterCard.nextSibling);
        } else {
            targetStage.appendChild(placementLine);
        }
    } else {
        targetStage.appendChild(placementLine);
    }

    // Create clone for animation
    const cardClone = card.cloneNode(true);
    cardClone.style.position = 'fixed';
    cardClone.style.zIndex = '1000';
    cardClone.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    cardClone.style.pointerEvents = 'none';

    // Get positions
    const startRect = card.getBoundingClientRect();
    const destRect = placementLine.getBoundingClientRect();

    // Set initial position
    cardClone.style.left = startRect.left + 'px';
    cardClone.style.top = startRect.top + 'px';
    cardClone.style.width = startRect.width + 'px';
    document.body.appendChild(cardClone);

    // Hide original
    card.style.opacity = '0';

    // Animate to destination
    setTimeout(() => {
        cardClone.style.left = destRect.left + 'px';
        cardClone.style.top = destRect.top + 'px';
        cardClone.style.transform = 'scale(0.95)';
    }, 50);

    // After animation, update actual card position
    setTimeout(() => {
        // Get the card data
        const cardData = window.opportunityCards.find(c => c.id == step.cardId);
        if (!cardData) {
            placementLine.remove();
            cardClone.remove();
            return;
        }

        // Update card data
        cardData.stage = step.toStage;

        // Remove the original card from DOM without animation
        card.remove();

        // Create a new card element for the destination
        const newCard = createOpportunityCard(cardData);
        newCard.style.opacity = '0';
        newCard.style.transition = 'opacity 0.3s ease';

        // Replace placeholder with actual card
        placementLine.parentNode.insertBefore(newCard, placementLine);
        placementLine.remove();
        cardClone.remove();

        // Fade in the new card
        setTimeout(() => {
            newCard.style.opacity = '1';
        }, 50);

        // Update array order to maintain correct position
        const cardIndex = window.opportunityCards.indexOf(cardData);
        window.opportunityCards.splice(cardIndex, 1);

        if (step.position === 'top') {
            // Insert at the beginning of cards for this stage
            const firstCardInStage = window.opportunityCards.findIndex(c => c.stage === step.toStage);
            if (firstCardInStage === -1) {
                window.opportunityCards.push(cardData);
            } else {
                window.opportunityCards.splice(firstCardInStage, 0, cardData);
            }
        } else if (step.position === 'after' && step.afterCardId) {
            // Find the card to insert after
            const afterCardIndex = window.opportunityCards.findIndex(c => c.id == step.afterCardId);
            if (afterCardIndex !== -1) {
                window.opportunityCards.splice(afterCardIndex + 1, 0, cardData);
            } else {
                window.opportunityCards.push(cardData);
            }
        } else {
            window.opportunityCards.push(cardData);
        }

        // Only update stage counters
        if (window.updateStageCounters) {
            window.updateStageCounters();
        }

        // Play sound
        if (typeof playSound === 'function') {
            playSound('swooshSound');
        }
    }, 850);
}

// Stop scenario playback
window.stopOpportunityScenario = function() {
    isPlayingScenario = false;
    currentScenarioStep = 0;

    // Update UI
    const playBtn = document.getElementById('playScenarioBtn');
    const stopBtn = document.getElementById('stopScenarioBtn');
    if (playBtn) playBtn.style.display = 'block';
    if (stopBtn) stopBtn.style.display = 'none';
};

// Store custom stage names
let customStageNames = {
    'demo-requested': 'Demo Requested',
    'demo-scheduled': 'Demo Scheduled',
    'demo-no-show': 'Demo No-Show',
    'demo-converted': 'Demo Converted',
    'client-not-converted': 'Client Not-Converted'
};

// Store custom pipeline name
let customPipelineName = 'AI Demo Booking Pipeline';

// Load saved stage names from localStorage
function loadSavedStageNames() {
    const saved = localStorage.getItem('ghlStageNames');
    if (saved) {
        customStageNames = JSON.parse(saved);
        // Update the input fields
        const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];
        stages.forEach((stage, index) => {
            const input = document.getElementById(`stage${index + 1}Name`);
            if (input) {
                input.value = customStageNames[stage];
            }
        });
        // Update the actual stage headers
        updateAllStageHeaders();
    }
}

// Helper function to get stage name
function getStageName(stageId) {
    return customStageNames[stageId] || stageId;
}

// Update stage name function
function updateStageName(index, newName) {
    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];
    const stageId = stages[index];

    if (stageId && newName) {
        customStageNames[stageId] = newName;

        // Update the stage header in the UI
        const stageColumn = document.querySelector(`[data-stage="${stageId}"]`);
        if (stageColumn) {
            const header = stageColumn.querySelector('.stage-header h3');
            if (header) {
                header.textContent = newName;
            }
        }
    }
}

// Save stage names to localStorage
function saveStageNames() {
    localStorage.setItem('ghlStageNames', JSON.stringify(customStageNames));
    updateAllStageHeaders();

    // Show success feedback
    const saveBtn = document.querySelector('#opportunities-controls .save-stages-btn');
    if (saveBtn) {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = '#22c55e';
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }
}

// Update all stage headers with custom names
function updateAllStageHeaders() {
    const stages = ['demo-requested', 'demo-scheduled', 'demo-no-show', 'demo-converted', 'client-not-converted'];

    stages.forEach(stageId => {
        const stageColumn = document.querySelector(`[data-stage="${stageId}"]`);
        if (stageColumn) {
            const header = stageColumn.querySelector('.stage-header h3');
            if (header) {
                header.textContent = customStageNames[stageId];
            }
        }
    });
}

// Pipeline Name Functions
function loadSavedPipelineName() {
    const saved = localStorage.getItem('ghlPipelineName');
    if (saved) {
        customPipelineName = saved;
        // Update the input field
        const input = document.getElementById('pipelineNameControl');
        if (input) {
            input.value = customPipelineName;
        }
        // Update the pipeline selector
        updatePipelineSelector();
    }
}

function updatePipelineName() {
    const input = document.getElementById('pipelineNameControl');
    if (input && input.value) {
        customPipelineName = input.value;
        // Update the pipeline selector immediately
        updatePipelineSelector();
    }
}

function savePipelineName() {
    localStorage.setItem('ghlPipelineName', customPipelineName);
    updatePipelineSelector();

    // Show success feedback
    const saveBtn = document.querySelector('#opportunities-controls .save-pipeline-btn');
    if (saveBtn) {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = '#22c55e';
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }
}

function updatePipelineSelector() {
    // Update the pipeline selector dropdown
    const pipelineSelector = document.querySelector('.pipeline-selector');
    if (pipelineSelector) {
        // Update the first option which is our main pipeline
        const firstOption = pipelineSelector.querySelector('option:first-child');
        if (firstOption) {
            firstOption.textContent = customPipelineName;
        }
        // If the first option is selected, update the displayed value
        if (pipelineSelector.selectedIndex === 0) {
            pipelineSelector.value = customPipelineName;
        }
    }
}

// Make functions globally available
window.updateStageName = updateStageName;
window.saveStageNames = saveStageNames;
window.loadSavedStageNames = loadSavedStageNames;
window.updatePipelineName = updatePipelineName;
window.savePipelineName = savePipelineName;
window.loadSavedPipelineName = loadSavedPipelineName;
// Move these functions outside DOMContentLoaded to make them globally available
window.addContactOpportunity = function() {
    console.log('addContactOpportunity called');
    // Initialize opportunities if not already initialized
    if (!window.opportunitiesInitialized) {
        if (typeof initializeOpportunities === 'function') {
            initializeOpportunities();
        }
        window.opportunitiesInitialized = true;
    }

    const nameInput = document.getElementById('contactName');
    const valueInput = document.getElementById('opportunityValue');
    const sourceInput = document.getElementById('opportunitySource');
    const stageSelect = document.getElementById('targetStageSelect');

    if (nameInput && nameInput.value) {
        const name = nameInput.value;
        const value = parseFloat(valueInput.value) || 0;
        const source = sourceInput.value || 'Direct';
        const stage = stageSelect.value || 'demo-requested';

        // Generate initials from name
        const nameParts = name.split(' ');
        const initials = nameParts.length >= 2
            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();

        const newCard = {
            id: Date.now(),
            name: name,
            value: value.toFixed(2),
            source: source,
            stage: stage,
            avatar: initials
        };

        if (!window.opportunityCards) {
            window.window.window.opportunityCards = [];
        }
        window.window.opportunityCards.push(newCard);

        console.log('Adding card:', newCard);

        // Switch to opportunities screen
        if (window.switchToScreen) {
            window.switchToScreen('opportunities');
        }

        // Render cards
        if (typeof renderOpportunityCards === 'function') {
            renderOpportunityCards();
        }
        if (typeof updateStageCounters === 'function') {
            updateStageCounters();
        }

        // Clear inputs
        nameInput.value = '';
        valueInput.value = '';
        sourceInput.value = '';

        // Play sound
        if (typeof playSound === 'function') {
            playSound('chachingSound');
        }
    } else {
        alert('Please enter at least a contact name to add an opportunity.');
    }
};

window.quickFillPipeline = function() {
    console.log('quickFillPipeline called');
    // Initialize opportunities if not already initialized
    if (!window.opportunitiesInitialized) {
        if (typeof initializeOpportunities === 'function') {
            initializeOpportunities();
        }
        window.opportunitiesInitialized = true;
    }

    // Sample data
    window.window.opportunityCards = [
        {
            id: 1,
            name: 'Sarah Johnson',
            value: '5000.00',
            source: 'Automate My Biz - AI Demo',
            stage: 'demo-requested',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Mike Chen',
            value: '3500.00',
            source: 'LinkedIn Outreach',
            stage: 'demo-requested',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Emily Davis',
            value: '7500.00',
            source: 'Website Form',
            stage: 'demo-scheduled',
            avatar: 'ED'
        },
        {
            id: 4,
            name: 'James Wilson',
            value: '12000.00',
            source: 'Referral Program',
            stage: 'demo-scheduled',
            avatar: 'JW'
        },
        {
            id: 5,
            name: 'Lisa Martinez',
            value: '4200.00',
            source: 'Cold Email Campaign',
            stage: 'demo-scheduled',
            avatar: 'LM'
        },
        {
            id: 6,
            name: 'Robert Taylor',
            value: '8800.00',
            source: 'Facebook Ads',
            stage: 'demo-no-show',
            avatar: 'RT'
        },
        {
            id: 7,
            name: 'Anna Brown',
            value: '6000.00',
            source: 'Google Ads',
            stage: 'demo-converted',
            avatar: 'AB'
        },
        {
            id: 8,
            name: 'David Lee',
            value: '15000.00',
            source: 'Partner Referral',
            stage: 'demo-converted',
            avatar: 'DL'
        },
        {
            id: 9,
            name: 'Sophie Anderson',
            value: '4500.00',
            source: 'Trade Show',
            stage: 'client-not-converted',
            avatar: 'SA'
        },
        {
            id: 10,
            name: 'Chris Walker',
            value: '9200.00',
            source: 'Webinar Funnel',
            stage: 'demo-converted',
            avatar: 'CW'
        }
    ];

    // Switch to opportunities screen
    if (window.switchToScreen) {
        window.switchToScreen('opportunities');
    }

    // Render cards
    if (window.renderOpportunityCards) {
        window.renderOpportunityCards();
    }
    if (window.updateStageCounters) {
        window.updateStageCounters();
    }

    // Play sound
    if (typeof playSound === 'function') {
        playSound('chachingSound');
    }
};

window.clearOpportunities = function() {
    console.log('clearOpportunities called');
    // Initialize if not already done
    if (!window.opportunitiesInitialized) {
        if (typeof initializeOpportunities === 'function') {
            initializeOpportunities();
        }
        window.opportunitiesInitialized = true;
    }

    window.window.window.opportunityCards = [];

    if (window.renderOpportunityCards) {
        window.renderOpportunityCards();
    }
    if (window.updateStageCounters) {
        window.updateStageCounters();
    }
};

// Payment/Invoices Screen Functions
let invoices = [
    { id: 'INV-001', customer: 'Alfredo Marco', avatar: 'AM', avatarColor: '#10b981', date: 'Nov 5, 2024', amount: 4500, status: 'overdue' },
    { id: 'INV-002', customer: 'Sarah Johnson', avatar: 'SJ', avatarColor: '#f59e0b', date: 'Nov 8, 2024', amount: 3200, status: 'paid' },
    { id: 'INV-003', customer: 'Michael Chen', avatar: 'MC', avatarColor: '#8b5cf6', date: 'Nov 10, 2024', amount: 7800, status: 'draft' },
    { id: 'INV-004', customer: 'Emily Davis', avatar: 'ED', avatarColor: '#ef4444', date: 'Nov 12, 2024', amount: 2100, status: 'pending' },
    { id: 'INV-005', customer: 'Robert Wilson', avatar: 'RW', avatarColor: '#3b82f6', date: 'Nov 14, 2024', amount: 5600, status: 'paid' },
    { id: 'INV-006', customer: 'Lisa Anderson', avatar: 'LA', avatarColor: '#ec4899', date: 'Nov 15, 2024', amount: 4200, status: 'overdue' },
    { id: 'INV-007', customer: 'James Taylor', avatar: 'JT', avatarColor: '#14b8a6', date: 'Nov 16, 2024', amount: 8900, status: 'paid' },
    { id: 'INV-008', customer: 'Patricia Brown', avatar: 'PB', avatarColor: '#a855f7', date: 'Nov 17, 2024', amount: 3400, status: 'draft' },
    { id: 'INV-009', customer: 'David Martinez', avatar: 'DM', avatarColor: '#22c55e', date: 'Nov 18, 2024', amount: 6700, status: 'pending' },
    { id: 'INV-010', customer: 'Jennifer Garcia', avatar: 'JG', avatarColor: '#f97316', date: 'Nov 19, 2024', amount: 5100, status: 'paid' }
];

function renderInvoiceTable() {
    const tbody = document.querySelector('.invoices-table tbody');
    if (!tbody) return;

    tbody.innerHTML = invoices.map(invoice => `
        <tr>
            <td class="td-checkbox">
                <input type="checkbox" class="table-checkbox" data-invoice-id="${invoice.id}">
            </td>
            <td>
                <div class="invoice-name">Invoice ${invoice.id}</div>
                <div class="invoice-number">${invoice.id}</div>
            </td>
            <td class="customer-cell">
                <div class="customer-info">
                    <div class="customer-avatar" style="background: ${invoice.avatarColor}">
                        ${invoice.avatar}
                    </div>
                    <span class="customer-name">${invoice.customer}</span>
                </div>
            </td>
            <td>
                <span class="issue-date">${invoice.date}</span>
            </td>
            <td>
                <span class="amount">$${invoice.amount.toLocaleString()}</span>
            </td>
            <td>
                <span class="status-badge status-${invoice.status}">${invoice.status}</span>
            </td>
            <td class="td-actions">
                <button class="action-btn" onclick="deleteInvoice('${invoice.id}')">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </td>
        </tr>
    `).join('');

    updateInvoiceStats();
}

function updateInvoiceStats() {
    const stats = {
        draft: { count: 0, amount: 0 },
        overdue: { count: 0, amount: 0 },
        pending: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 }
    };

    invoices.forEach(invoice => {
        if (stats[invoice.status]) {
            stats[invoice.status].count++;
            stats[invoice.status].amount += invoice.amount;
        }
    });

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-label').textContent = `${stats.draft.count} Invoice(s) in Draft`;
        statCards[0].querySelector('.stat-value').textContent = `$${(stats.draft.amount / 1000).toFixed(1)}k`;

        statCards[1].querySelector('.stat-label').textContent = `${stats.overdue.count} Overdue`;
        statCards[1].querySelector('.stat-value').textContent = `$${(stats.overdue.amount / 1000).toFixed(1)}k`;

        statCards[2].querySelector('.stat-label').textContent = `${stats.pending.count} Awaiting Payment`;
        statCards[2].querySelector('.stat-value').textContent = `$${(stats.pending.amount / 1000).toFixed(1)}k`;

        statCards[3].querySelector('.stat-label').textContent = `${stats.paid.count} Paid`;
        statCards[3].querySelector('.stat-value').textContent = `$${(stats.paid.amount / 1000).toFixed(1)}k`;
    }
}

function addNewInvoice() {
    const newInvoiceNumber = invoices.length + 1;
    const customerNames = ['Alex Thompson', 'Maria Rodriguez', 'John Smith', 'Anna Lee', 'Chris Johnson', 'Emma Wilson'];
    const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
    const initials = randomCustomer.split(' ').map(n => n[0]).join('');
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#ec4899'];
    const statuses = ['draft', 'pending', 'overdue', 'paid'];

    const newInvoice = {
        id: `INV-${String(newInvoiceNumber).padStart(3, '0')}`,
        customer: randomCustomer,
        avatar: initials,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: Math.floor(Math.random() * 8000) + 2000,
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };

    invoices.unshift(newInvoice);
    renderInvoiceTable();
}

function deleteInvoice(invoiceId) {
    invoices = invoices.filter(inv => inv.id !== invoiceId);
    renderInvoiceTable();
}

function markRandomAsPaid() {
    // Only select from pending or overdue invoices (not draft or already paid)
    const eligibleInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
    if (eligibleInvoices.length > 0) {
        const randomInvoice = eligibleInvoices[Math.floor(Math.random() * eligibleInvoices.length)];
        const index = invoices.findIndex(inv => inv.id === randomInvoice.id);
        if (index !== -1) {
            invoices[index].status = 'paid';
            renderInvoiceTable();
        }
    }
}

function markRandomAsOverdue() {
    // Only select from pending invoices to mark as overdue (not draft or paid)
    const eligibleInvoices = invoices.filter(inv => inv.status === 'pending');
    if (eligibleInvoices.length > 0) {
        const randomInvoice = eligibleInvoices[Math.floor(Math.random() * eligibleInvoices.length)];
        const index = invoices.findIndex(inv => inv.id === randomInvoice.id);
        if (index !== -1) {
            invoices[index].status = 'overdue';
            renderInvoiceTable();
        }
    }
}

function generateBulkInvoices() {
    const count = 5;
    for (let i = 0; i < count; i++) {
        addNewInvoice();
    }
}

function clearAllInvoices() {
    invoices = [];
    renderInvoiceTable();
}

function resetInvoicesToDefault() {
    invoices = [
        { id: 'INV-001', customer: 'Alfredo Marco', avatar: 'AM', avatarColor: '#10b981', date: 'Nov 5, 2024', amount: 4500, status: 'overdue' },
        { id: 'INV-002', customer: 'Sarah Johnson', avatar: 'SJ', avatarColor: '#f59e0b', date: 'Nov 8, 2024', amount: 3200, status: 'paid' },
        { id: 'INV-003', customer: 'Michael Chen', avatar: 'MC', avatarColor: '#8b5cf6', date: 'Nov 10, 2024', amount: 7800, status: 'draft' },
        { id: 'INV-004', customer: 'Emily Davis', avatar: 'ED', avatarColor: '#ef4444', date: 'Nov 12, 2024', amount: 2100, status: 'pending' },
        { id: 'INV-005', customer: 'Robert Wilson', avatar: 'RW', avatarColor: '#3b82f6', date: 'Nov 14, 2024', amount: 5600, status: 'paid' },
        { id: 'INV-006', customer: 'Lisa Anderson', avatar: 'LA', avatarColor: '#ec4899', date: 'Nov 15, 2024', amount: 4200, status: 'overdue' },
        { id: 'INV-007', customer: 'James Taylor', avatar: 'JT', avatarColor: '#14b8a6', date: 'Nov 16, 2024', amount: 8900, status: 'paid' },
        { id: 'INV-008', customer: 'Patricia Brown', avatar: 'PB', avatarColor: '#a855f7', date: 'Nov 17, 2024', amount: 3400, status: 'draft' },
        { id: 'INV-009', customer: 'David Martinez', avatar: 'DM', avatarColor: '#22c55e', date: 'Nov 18, 2024', amount: 6700, status: 'pending' },
        { id: 'INV-010', customer: 'Jennifer Garcia', avatar: 'JG', avatarColor: '#f97316', date: 'Nov 19, 2024', amount: 5100, status: 'paid' }
    ];
    renderInvoiceTable();
}

// Initialize invoice table on page load
document.addEventListener('DOMContentLoaded', function() {
    renderInvoiceTable();
});

