// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get common elements
    const calendarScreen = document.getElementById('calendar-screen');
    const conversationsScreen = document.getElementById('conversations-screen');
    const rightPanel = document.querySelector('.right-panel');
    const navItems = document.querySelectorAll('.nav-item[data-screen]');
    
    // Control Panel Screen Switching
    const screenSwitchBtns = document.querySelectorAll('.screen-switch-btn');
    const calendarControls = document.getElementById('calendar-controls');
    const conversationControls = document.getElementById('conversation-controls');
    
    screenSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.getAttribute('data-panel');
            
            // Update button states
            screenSwitchBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Switch control panels AND main screens
            if (panel === 'calendar') {
                // Switch control panels
                calendarControls.style.display = 'block';
                conversationControls.style.display = 'none';
                
                // Switch main screens
                calendarScreen.style.display = 'block';
                conversationsScreen.style.display = 'none';
                if (rightPanel) rightPanel.style.display = 'block';
                
                // Update nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                const calendarNav = document.querySelector('.nav-item[data-screen="calendar"]');
                if (calendarNav) calendarNav.classList.add('active');
                
            } else if (panel === 'conversation') {
                // Switch control panels
                calendarControls.style.display = 'none';
                conversationControls.style.display = 'block';
                
                // Switch main screens
                calendarScreen.style.display = 'none';
                conversationsScreen.style.display = 'block';
                if (rightPanel) rightPanel.style.display = 'none';
                
                // Update nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                const conversationNav = document.querySelector('.nav-item[data-screen="conversations"]');
                if (conversationNav) conversationNav.classList.add('active');
                
                // Initialize conversations if needed
                if (!window.conversationsInitialized) {
                    initializeConversations();
                    window.conversationsInitialized = true;
                }
            }
        });
    });
    
    // Screen switching functionality
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const screen = this.getAttribute('data-screen');
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Switch screens
            if (screen === 'calendar') {
                calendarScreen.style.display = 'block';
                conversationsScreen.style.display = 'none';
                if (rightPanel) rightPanel.style.display = 'block';
                
                // Switch control panel too
                screenSwitchBtns[0].click(); // Calendar button
            } else if (screen === 'conversations') {
                calendarScreen.style.display = 'none';
                conversationsScreen.style.display = 'block';
                if (rightPanel) rightPanel.style.display = 'none';
                
                // Initialize conversation functionality if not already done
                if (!window.conversationsInitialized) {
                    initializeConversations();
                    window.conversationsInitialized = true;
                }
                
                // Switch control panel too
                screenSwitchBtns[1].click(); // Conversation button
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
        appointment.className = 'appointment';
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
    const teamMembers = ['', 'James Mitchell', 'Emma Thompson', 'Oliver Davies'];
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
}

// Initialize sample conversations
function initializeSampleConversations() {
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
        },
        {
            id: 'conv-6',
            name: 'Michael Chen',
            initials: 'MC',
            lastMessage: 'Thanks for reaching out! I am interested',
            time: 'Aug 19',
            unread: 0,
            messages: []
        },
        {
            id: 'conv-7',
            name: 'Sarah Williams',
            initials: 'SW',
            lastMessage: 'Can we schedule a call next week?',
            time: 'Aug 18',
            unread: 2,
            messages: []
        },
        {
            id: 'conv-8',
            name: 'David Thompson',
            initials: 'DT',
            lastMessage: 'Perfect! See you at the event',
            time: 'Aug 17',
            unread: 0,
            messages: []
        }
    ];

    // Store conversations
    sampleConversations.forEach(conv => {
        conversations[conv.id] = conv;
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
        if (timeSpan) timeSpan.textContent = 'Aug 11, 2025, 11:42 AM';
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
    const firstItem = conversationItems.querySelector('.conversation-item');
    
    if (firstItem) {
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
        
        // Insert at the top of the list
        conversationItems.insertBefore(newContact, firstItem);
        
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
    if (isScenarioPlaying) {
        stopScenario();
    }
    scenarioSteps = [];
    renderScenarioList();
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

// Play Scenario
async function playScenario() {
    if (scenarioSteps.length === 0) {
        alert('Please add steps to the scenario first');
        return;
    }
    
    if (isScenarioPlaying) {
        alert('Scenario is already playing');
        return;
    }
    
    // Ensure we're on conversations screen
    const conversationNav = document.querySelector('.nav-item[data-screen="conversations"]');
    if (conversationNav && !conversationNav.classList.contains('active')) {
        conversationNav.click();
        await sleep(300);
    }
    
    // Ensure a conversation is selected
    if (!currentConversation) {
        const firstConversationItem = document.querySelector('.conversation-item');
        if (firstConversationItem) {
            firstConversationItem.click();
            await sleep(300);
        }
    }
    
    if (!currentConversation) {
        alert('Please select a conversation first');
        return;
    }
    
    isScenarioPlaying = true;
    
    // Clear existing messages and the messages area
    currentConversation.messages = [];
    const messagesArea = document.querySelector('.messages-area');
    if (messagesArea) {
        messagesArea.innerHTML = '';
    }
    
    const playBtn = document.querySelector('.control-btn.primary[onclick="playScenario()"]');
    if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i> Playing...';
        playBtn.disabled = true;
    }
    
    const speedMultiplier = getSpeedMultiplier();
    
    // Play each step
    for (let i = 0; i < scenarioSteps.length; i++) {
        if (!isScenarioPlaying) break;
        
        const step = scenarioSteps[i];
        
        switch(step.type) {
            case 'incoming':
                await showTypingIndicator('incoming', 1500 * speedMultiplier);
                await addAnimatedMessage('incoming', step.content);
                break;
                
            case 'outgoing':
                await showTypingIndicator('outgoing', 1000 * speedMultiplier);
                await addAnimatedMessage('outgoing', step.content);
                break;
                
            case 'typing':
                await showTypingIndicator('incoming', 2000 * speedMultiplier);
                break;
                
            case 'delay':
                await sleep((step.delay || parseInt(step.content)) * speedMultiplier);
                break;
        }
        
        // Default delay between steps
        if (step.type !== 'delay' && i < scenarioSteps.length - 1) {
            await sleep(500 * speedMultiplier);
        }
    }
    
    isScenarioPlaying = false;
    if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        playBtn.disabled = false;
    }
    
    // Update conversation preview
    updateConversationPreview();
    
    // Success sound removed per request
}

// Stop Scenario
function stopScenario() {
    isScenarioPlaying = false;
    if (scenarioTimeout) {
        clearTimeout(scenarioTimeout);
        scenarioTimeout = null;
    }
    
    const playBtn = document.querySelector('.control-btn.primary[onclick="playScenario()"]');
    if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        playBtn.disabled = false;
    }
}

// Load Scenario Template
function loadScenarioTemplate() {
    const template = document.getElementById('scenarioTemplate').value;
    if (!template) return;
    
    scenarioSteps = [];
    
    switch(template) {
        case 'greeting':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'Hi there! 👋', delay: 1000 },
                { id: 2, type: 'delay', content: '1500', delay: 1500 },
                { id: 3, type: 'outgoing', content: 'Hello! Welcome to our business. How can I help you today?', delay: 1000 },
                { id: 4, type: 'incoming', content: 'I saw your ad online', delay: 1000 },
                { id: 5, type: 'outgoing', content: 'Great! Which service are you interested in?', delay: 1000 }
            ];
            break;
            
        case 'inquiry':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'Do you have this product in stock?', delay: 1000 },
                { id: 2, type: 'outgoing', content: 'Let me check that for you right away!', delay: 1000 },
                { id: 3, type: 'typing', content: '', delay: 2000 },
                { id: 4, type: 'outgoing', content: 'Yes, we have it available!', delay: 1000 },
                { id: 5, type: 'outgoing', content: 'Would you like to place an order?', delay: 800 },
                { id: 6, type: 'incoming', content: 'Yes, please!', delay: 1000 }
            ];
            break;
            
        case 'support':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: 'I need help with my recent order', delay: 1000 },
                { id: 2, type: 'outgoing', content: "I'm sorry to hear you're having issues. Can you provide your order number?", delay: 1000 },
                { id: 3, type: 'incoming', content: 'Order #12345', delay: 1500 },
                { id: 4, type: 'typing', content: '', delay: 2000 },
                { id: 5, type: 'outgoing', content: "I've found your order. What seems to be the problem?", delay: 1000 },
                { id: 6, type: 'incoming', content: "It hasn't arrived yet", delay: 1000 },
                { id: 7, type: 'outgoing', content: "Let me track that for you. One moment please...", delay: 1000 }
            ];
            break;
            
        case 'booking':
            scenarioSteps = [
                { id: 1, type: 'incoming', content: "I'd like to book an appointment", delay: 1000 },
                { id: 2, type: 'outgoing', content: 'Of course! What service would you like to book?', delay: 1000 },
                { id: 3, type: 'incoming', content: 'A consultation please', delay: 1000 },
                { id: 4, type: 'outgoing', content: 'Perfect! We have availability this week. When works best for you?', delay: 1000 },
                { id: 5, type: 'incoming', content: 'Thursday afternoon would be great', delay: 1000 },
                { id: 6, type: 'outgoing', content: 'I have 2:00 PM and 3:30 PM available on Thursday. Which do you prefer?', delay: 1000 },
                { id: 7, type: 'incoming', content: '2:00 PM works perfectly', delay: 1000 },
                { id: 8, type: 'outgoing', content: "Great! You're all set for Thursday at 2:00 PM. I'll send you a confirmation email.", delay: 1000 }
            ];
            break;
            
        case 'followup':
            scenarioSteps = [
                { id: 1, type: 'outgoing', content: 'Hi! Just following up on our conversation from yesterday.', delay: 1000 },
                { id: 2, type: 'outgoing', content: 'Have you had a chance to think about our proposal?', delay: 1200 },
                { id: 3, type: 'delay', content: '3000', delay: 3000 },
                { id: 4, type: 'incoming', content: 'Yes, I have some questions', delay: 1000 },
                { id: 5, type: 'outgoing', content: "I'd be happy to answer them! What would you like to know?", delay: 1000 }
            ];
            break;
    }
    
    renderScenarioList();
    document.getElementById('scenarioTemplate').value = '';
}

// Save Custom Scenario
function saveCustomScenario() {
    const name = document.getElementById('scenarioName').value.trim();
    
    if (!name) {
        alert('Please enter a scenario name');
        return;
    }
    
    if (scenarioSteps.length === 0) {
        alert('Please add steps to the scenario first');
        return;
    }
    
    let savedScenarios = JSON.parse(localStorage.getItem('ghlScenarios') || '{}');
    savedScenarios[name] = {
        name: name,
        steps: scenarioSteps,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('ghlScenarios', JSON.stringify(savedScenarios));
    document.getElementById('scenarioName').value = '';
    loadSavedScenarios();
    alert(`Scenario "${name}" saved successfully!`);
}

// Load Saved Scenarios
function loadSavedScenarios() {
    const savedScenarios = JSON.parse(localStorage.getItem('ghlScenarios') || '{}');
    const container = document.getElementById('savedScenariosList');
    
    if (!container) return;
    
    const scenarios = Object.values(savedScenarios);
    if (scenarios.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 10px; font-size: 11px;">No saved scenarios yet</div>';
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

// Load Custom Scenario
function loadCustomScenario(name) {
    const savedScenarios = JSON.parse(localStorage.getItem('ghlScenarios') || '{}');
    const scenario = savedScenarios[name];
    
    if (scenario) {
        scenarioSteps = scenario.steps;
        renderScenarioList();
        alert(`Loaded scenario "${name}"`);
    }
}

// Delete Custom Scenario
function deleteCustomScenario(name) {
    if (confirm(`Delete scenario "${name}"?`)) {
        const savedScenarios = JSON.parse(localStorage.getItem('ghlScenarios') || '{}');
        delete savedScenarios[name];
        localStorage.setItem('ghlScenarios', JSON.stringify(savedScenarios));
        loadSavedScenarios();
    }
}

// Load saved scenarios on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedScenarios();
});

// Messaging Animation Function (Deprecated - Use Scenario Builder instead)
async function startMessagingAnimation() {
    // First, ensure we're on the conversations screen
    const conversationNav = document.querySelector('.nav-item[data-screen="conversations"]');
    if (conversationNav && !conversationNav.classList.contains('active')) {
        conversationNav.click();
        await sleep(300);
    }
    
    // Get animation settings
    const outgoingMessagesText = document.getElementById('outgoingMessages').value;
    const incomingMessagesText = document.getElementById('incomingMessages').value;
    const messageDelay = parseInt(document.getElementById('messageDelay').value) || 2000;
    const typingDuration = parseInt(document.getElementById('typingDuration').value) || 1500;
    
    // Parse messages
    const outgoingMessages = outgoingMessagesText.split('\n').filter(msg => msg.trim());
    const incomingMessages = incomingMessagesText.split('\n').filter(msg => msg.trim());
    
    // Ensure a conversation is selected
    if (!currentConversation) {
        // Select the first conversation if none is selected
        const firstConversationItem = document.querySelector('.conversation-item');
        if (firstConversationItem) {
            firstConversationItem.click();
            await sleep(300);
        }
    }
    
    if (!currentConversation) {
        alert('Please select a conversation first');
        return;
    }
    
    // Clear existing messages
    currentConversation.messages = [];
    loadConversationMessages();
    
    // Create message sequence (alternating between incoming and outgoing)
    const messageSequence = [];
    const maxMessages = Math.max(outgoingMessages.length, incomingMessages.length);
    
    for (let i = 0; i < maxMessages; i++) {
        if (i < incomingMessages.length) {
            messageSequence.push({ type: 'incoming', text: incomingMessages[i] });
        }
        if (i < outgoingMessages.length) {
            messageSequence.push({ type: 'outgoing', text: outgoingMessages[i] });
        }
    }
    
    // Animate messages
    for (const msgData of messageSequence) {
        // Show typing indicator
        await showTypingIndicator(msgData.type, typingDuration);
        
        // Add message
        await addAnimatedMessage(msgData.type, msgData.text);
        
        // Wait before next message
        await sleep(messageDelay);
    }
    
    // Update conversation preview
    updateConversationPreview();
    
    // Success sound removed per request
}

async function showTypingIndicator(type, duration) {
    const messagesArea = document.querySelector('.messages-area');
    if (!messagesArea) return;
    
    // Create typing indicator using same structure as messages
    const typingIndicator = document.createElement('div');
    typingIndicator.className = `message-group ${type} typing-indicator`;
    
    if (type === 'outgoing') {
        typingIndicator.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="avatar-small">AI</div>
        `;
    } else {
        typingIndicator.innerHTML = `
            <div class="avatar-small">${currentConversation?.initials || 'U'}</div>
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
    }
    
    messagesArea.appendChild(typingIndicator);
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    await sleep(duration);
    
    // Remove typing indicator
    typingIndicator.remove();
}

async function addAnimatedMessage(type, text) {
    const now = new Date();
    const newMessage = {
        id: `msg-${conversationMessageIdCounter++}`,
        type: type,
        sender: type === 'outgoing' ? 'AutomateMyBiz.pro' : currentConversation.name,
        text: text,
        date: formatConversationDate(now),
        time: formatConversationTime(now)
    };
    
    // Add to conversation
    currentConversation.messages.push(newMessage);
    
    // Create message element
    const messagesArea = document.querySelector('.messages-area');
    if (!messagesArea) return;
    
    // Check if we need a date separator
    const lastMessageGroup = messagesArea.querySelector('.message-group:last-child');
    const lastDate = lastMessageGroup?.dataset?.date;
    
    if (!lastDate || lastDate !== newMessage.date) {
        const dateDivider = document.createElement('div');
        dateDivider.className = 'date-divider';
        dateDivider.innerHTML = `<span>${newMessage.date}</span>`;
        messagesArea.appendChild(dateDivider);
    }
    
    // Create message using the same structure as default messages
    const messageGroup = document.createElement('div');
    messageGroup.className = `message-group ${type}`;
    messageGroup.dataset.date = newMessage.date;
    messageGroup.style.opacity = '0';
    messageGroup.style.transform = 'translateY(10px)';
    
    if (type === 'outgoing') {
        messageGroup.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <span class="label">${newMessage.sender}</span>
                    <span class="message-text">${text}</span>
                </div>
                <div class="message-time">${newMessage.time}</div>
            </div>
            <div class="avatar-small">AI</div>
        `;
    } else {
        messageGroup.innerHTML = `
            <div class="avatar-small">${currentConversation.initials}</div>
            <div class="message-bubble">
                <div class="message-header">
                    <span class="message-text">${text}</span>
                </div>
                <div class="message-time">${newMessage.time}</div>
            </div>
        `;
    }
    
    messagesArea.appendChild(messageGroup);
    
    // Animate message appearance
    await sleep(50);
    messageGroup.style.transition = 'all 0.3s ease';
    messageGroup.style.opacity = '1';
    messageGroup.style.transform = 'translateY(0)';
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Play message notification sound
    playMessageSound();
}

// Additional conversation control functions
function sendTestMessage() {
    if (currentConversation) {
        const testMessage = {
            id: `msg-${conversationMessageIdCounter++}`,
            type: 'incoming',
            text: 'This is a test message from the control panel!',
            date: formatConversationDate(new Date()),
            time: formatConversationTime(new Date())
        };
        currentConversation.messages.push(testMessage);
        loadConversationMessages();
    }
}

function markAllRead() {
    document.querySelectorAll('.unread-count').forEach(badge => {
        badge.style.display = 'none';
    });
    Object.keys(conversations).forEach(key => {
        conversations[key].unread = 0;
    });
}

function clearConversations() {
    if (confirm('Clear all conversations?')) {
        Object.keys(conversations).forEach(key => {
            conversations[key].messages = [];
        });
        if (currentConversation) {
            loadConversationMessages();
        }
    }
}