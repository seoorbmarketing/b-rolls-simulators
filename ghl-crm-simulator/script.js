// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
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
                // Calendar starts at 11AM (index 0) and goes to 12AM (index 13)
                if (timePart === '11AM') {
                    slotIndex = 0;
                } else if (timePart === '12PM') {
                    slotIndex = 1;
                } else if (timePart === '12AM') {
                    slotIndex = 13;
                } else if (timePart.includes('PM')) {
                    // PM times (1PM-11PM)
                    slotIndex = timeHour + 1; // 1PM = index 2, 2PM = index 3, etc.
                } else if (timePart.includes('AM') && timeHour < 11) {
                    // Should not happen with our calendar (starts at 11AM)
                    slotIndex = 0;
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
            autoFillBookingForm();
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

function autoFillBookingForm() {
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
        const [time, period] = startTime.split(' ');
        const [hours, minutes] = time.split(':').map(num => parseInt(num) || 0);
        let endHours = hours;
        let endMinutes = (minutes || 0) + durationMinutes;
        
        if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
        }
        
        const startTimeValue = `${dateValue} ${startTime}`;
        const endTimeValue = `${dateValue} ${endHours}:${endMinutes.toString().padStart(2, '0')} ${period}`;
        
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
                confirmBooking();
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

function confirmBooking() {
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
        
        // Find a random slot and add booking
        const dayColumns = document.querySelectorAll('.day-column');
        const randomDay = dayColumns[Math.floor(Math.random() * 5) + 1];
        const hourSlots = randomDay.querySelectorAll('.hour-slot');
        const randomSlot = hourSlots[Math.floor(Math.random() * 6) + 2];
        
        // Check if slot already has appointment
        if (randomSlot.classList.contains('has-appointment')) {
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
        
        randomSlot.style.position = 'relative';
        randomSlot.appendChild(booking);
        randomSlot.classList.add('has-appointment');
        
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
    
    // Add duration
    let endHour = startHour;
    let endMinutes = durationMinutes;
    if (endMinutes >= 60) {
        endHour += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
    }
    
    // Format end time
    let endPeriod = endHour >= 12 ? 'PM' : 'AM';
    let displayHour = endHour;
    if (endHour > 12) displayHour = endHour - 12;
    if (endHour === 0) displayHour = 12;
    
    const timeStr = endMinutes > 0 ? `${displayHour}:${endMinutes.toString().padStart(2, '0')}` : `${displayHour}:30`;
    return `${month} ${day}, ${year} at ${timeStr}${endPeriod}`;
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