// Calendar State
let currentMonth = 8; // September (0-indexed)
let currentYear = 2025;
let events = {};
let selectedEventColor = '#4285f4';

// Color coding system for appointment types
const workTypeColors = {
    // Routine/Maintenance - Green shades
    maintenance: '#2e7d32',
    routine: '#43a047',
    
    // Installation/New - Blue shades  
    installation: '#1565c0',
    new: '#1976d2',
    
    // Repair/Fix - Orange shades
    repair: '#ef6c00',
    fix: '#f57c00',
    
    // Emergency - Red
    emergency: '#c62828',
    urgent: '#d32f2f',
    
    // Cleaning/Service - Teal shades
    cleaning: '#00897b',
    service: '#00acc1',
    
    // Inspection/Assessment - Purple shades
    inspection: '#6a1b9a',
    assessment: '#7b1fa2'
};

// Function to determine color based on appointment title
function getAppointmentColor(title) {
    const lowerTitle = title.toLowerCase();
    
    // Emergency
    if (lowerTitle.includes('emergency') || lowerTitle.includes('burst') || lowerTitle.includes('no heat') || lowerTitle.includes('power outage')) {
        return workTypeColors.emergency;
    }
    
    // Repairs
    if (lowerTitle.includes('repair') || lowerTitle.includes('fix')) {
        return workTypeColors.repair;
    }
    
    // Installations
    if (lowerTitle.includes('install') || lowerTitle.includes('installation') || lowerTitle.includes('upgrade') || lowerTitle.includes('replacement')) {
        return workTypeColors.installation;
    }
    
    // Cleaning
    if (lowerTitle.includes('clean') || lowerTitle.includes('cleanup') || lowerTitle.includes('washing')) {
        return workTypeColors.cleaning;
    }
    
    // Inspections
    if (lowerTitle.includes('inspection') || lowerTitle.includes('assessment') || lowerTitle.includes('test') || lowerTitle.includes('check')) {
        return workTypeColors.inspection;
    }
    
    // Maintenance/Routine
    if (lowerTitle.includes('tune-up') || lowerTitle.includes('maintenance') || lowerTitle.includes('mowing') || lowerTitle.includes('trimming') || lowerTitle.includes('filter')) {
        return workTypeColors.maintenance;
    }
    
    // Service (general)
    if (lowerTitle.includes('treatment') || lowerTitle.includes('control') || lowerTitle.includes('removal')) {
        return workTypeColors.service;
    }
    
    // Default to standard work green
    return '#0f9d58';
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    loadSampleEvents();
    initializeProfile();
});

function initializeCalendar() {
    renderCalendar();
    renderMiniCalendar();
    updateMonthYearDisplay();
}

function setupEventListeners() {
    // Create button
    document.getElementById('createBtn').addEventListener('click', () => showEventModal());
    
    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            e.target.classList.add('active');
            selectedEventColor = e.target.dataset.color;
        });
    });
    
    // Modal event listeners
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventModal') {
            closeEventModal();
        }
    });
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayDiv = createDayElement(day, true, `${currentYear}-${currentMonth}-${day}`);
        calendarGrid.appendChild(dayDiv);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = currentYear === today.getFullYear() && 
                       currentMonth === today.getMonth() && 
                       day === today.getDate();
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const dayDiv = createDayElement(day, false, dateKey, isToday);
        calendarGrid.appendChild(dayDiv);
    }
    
    // Next month days to fill the grid
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createDayElement(day, true, `${currentYear}-${currentMonth + 2}-${day}`);
        calendarGrid.appendChild(dayDiv);
    }
}

function createDayElement(day, isOtherMonth, dateKey, isToday = false) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    if (isOtherMonth) dayDiv.classList.add('other-month');
    if (isToday) dayDiv.classList.add('today');
    dayDiv.setAttribute('data-date', dateKey);
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);
    
    const eventsDiv = document.createElement('div');
    eventsDiv.className = 'day-events';
    
    // Add events if they exist for this date
    if (events[dateKey]) {
        events[dateKey].forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.backgroundColor = event.color;
            eventDiv.textContent = event.title;
            eventDiv.title = `${event.title} - ${event.time}\nClick to delete`;
            
            // Add click handler for deletion
            eventDiv.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent day click event
                if (confirm(`Delete event "${event.title}"?`)) {
                    events[dateKey].splice(index, 1);
                    if (events[dateKey].length === 0) {
                        delete events[dateKey];
                    }
                    renderCalendar();
                }
            });
            
            eventsDiv.appendChild(eventDiv);
        });
    }
    
    dayDiv.appendChild(eventsDiv);
    
    // Add click event to open modal for adding events
    dayDiv.addEventListener('click', () => {
        if (!isOtherMonth) {
            showEventModal(day);
        }
    });
    
    return dayDiv;
}

function renderMiniCalendar() {
    const miniGrid = document.querySelector('.mini-calendar-grid');
    if (!miniGrid) return;
    
    miniGrid.innerHTML = '';
    
    // Add weekday headers
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.color = '#70757a';
        dayHeader.style.fontSize = '10px';
        miniGrid.appendChild(dayHeader);
    });
    
    // Add days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        miniGrid.appendChild(document.createElement('div'));
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.style.cursor = 'pointer';
        dayDiv.style.borderRadius = '50%';
        dayDiv.style.fontSize = '11px';
        
        const today = new Date();
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayDiv.style.background = '#1a73e8';
            dayDiv.style.color = 'white';
        }
        
        miniGrid.appendChild(dayDiv);
    }
}

function updateMonthYearDisplay() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Show only month in main header
    document.getElementById('monthYear').textContent = monthNames[currentMonth];
    // Keep month and year in mini calendar
    document.getElementById('miniMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Update selectors
    document.getElementById('monthSelector').value = currentMonth;
    document.getElementById('yearSelector').value = currentYear;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    initializeCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    initializeCalendar();
}

function goToMonth() {
    currentMonth = parseInt(document.getElementById('monthSelector').value);
    currentYear = parseInt(document.getElementById('yearSelector').value);
    initializeCalendar();
}

function goToToday() {
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    initializeCalendar();
}

// Event Management
function showEventModal(day = null) {
    const modal = document.getElementById('eventModal');
    modal.classList.add('active');
    
    if (day && typeof day === 'number') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        document.getElementById('modalEventDate').value = `${monthNames[currentMonth]} ${day}`;
    } else {
        document.getElementById('modalEventDate').value = '';
    }
    
    document.getElementById('modalEventTitle').focus();
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    
    // Clear form
    document.getElementById('modalEventTitle').value = '';
    document.getElementById('modalEventDate').value = '';
    document.getElementById('modalEventTime').value = '';
}

function saveEvent() {
    const title = document.getElementById('modalEventTitle').value;
    const date = document.getElementById('modalEventDate').value;
    const time = document.getElementById('modalEventTime').value;
    
    if (!title || !date) {
        alert('Please enter a title and date');
        return;
    }
    
    // Parse date to get day number
    const dateParts = date.split(' ');
    const day = parseInt(dateParts[1]);
    
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    
    events[dateKey].push({
        title: title,
        time: time || 'All day',
        color: selectedEventColor
    });
    
    renderCalendar();
    closeEventModal();
    showSuccessMessage();
}

function addQuickEvent() {
    const title = document.getElementById('quickEventTitle').value;
    const day = document.getElementById('quickEventDate').value;
    const time = document.getElementById('quickEventTime').value;
    const color = document.getElementById('quickEventColor').value;
    
    if (!title || !day) {
        alert('Please enter a title and date');
        return;
    }
    
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    
    events[dateKey].push({
        title: title,
        time: time || 'All day',
        color: color
    });
    
    renderCalendar();
    showSuccessMessage();
    
    // Clear quick event fields
    document.getElementById('quickEventTitle').value = '';
    document.getElementById('quickEventDate').value = '';
    document.getElementById('quickEventTime').value = '';
}

function showSuccessMessage() {
    // Notification messages disabled
    return;
}


// Preset Events
function loadPresetEvents(preset) {
    events = {}; // Clear existing events
    
    const presets = {
        plumbing: {
            [`${currentYear}-${currentMonth + 1}-2`]: [
                { title: 'Leak Repair - Johnson', time: '9:00 AM', color: getAppointmentColor('Leak Repair') },
                { title: 'Water Heater Install', time: '11:00 AM', color: getAppointmentColor('Water Heater Install') }
            ],
            [`${currentYear}-${currentMonth + 1}-3`]: [
                { title: 'Drain Cleaning - Smith', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Toilet Repair - Wilson', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-5`]: [
                { title: 'Drain Cleaning - Thompson', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Leak Repair - Davis', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-8`]: [
                { title: 'Emergency - Burst Pipe', time: '8:00 AM', color: '#ea4335' },
                { title: 'Faucet Replacement', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-10`]: [
                { title: 'Water Heater Repair', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Toilet Repair - Garcia', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-12`]: [
                { title: 'Annual Inspection', time: '11:00 AM', color: '#0f9d58' },
                { title: 'Faucet Replacement', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-15`]: [
                { title: 'Pipe Installation', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Drain Cleaning - Anderson', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-17`]: [
                { title: 'Leak Repair - Roberts', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Sewer Line Inspection', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-20`]: [
                { title: 'Water Heater Install', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-22`]: [
                { title: 'Toilet Repair - Miller', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Drain Cleaning - Clark', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-25`]: [
                { title: 'Annual Inspection', time: '1:00 PM', color: '#0f9d58' },
                { title: 'Leak Repair - Harris', time: '3:00 PM', color: '#0f9d58' }
            ]
        },
        electrician: {
            [`${currentYear}-${currentMonth + 1}-2`]: [
                { title: 'Outlet Installation', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Circuit Breaker Repair', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-4`]: [
                { title: 'Outlet Installation', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Light Fixture Install', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-6`]: [
                { title: 'Panel Upgrade - Garcia', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Circuit Breaker Repair', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-9`]: [
                { title: 'Electrical Inspection', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Outlet Installation', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-11`]: [
                { title: 'Rewiring - Smith', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Light Fixture Install', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-14`]: [
                { title: 'Emergency - Power Outage', time: '7:00 PM', color: '#ea4335' }
            ],
            [`${currentYear}-${currentMonth + 1}-16`]: [
                { title: 'Ceiling Fan Install', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Electrical Inspection', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-18`]: [
                { title: 'Circuit Breaker Repair', time: '11:00 AM', color: '#0f9d58' },
                { title: 'Outdoor Lighting', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-22`]: [
                { title: 'Panel Upgrade - Park', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Ceiling Fan Install', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-24`]: [
                { title: 'EV Charger Install', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Outlet Installation', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-26`]: [
                { title: 'Electrical Inspection', time: '10:00 AM', color: '#0f9d58' }
            ]
        },
        hvac: {
            [`${currentYear}-${currentMonth + 1}-1`]: [
                { title: 'AC Tune-up', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Filter Replacement', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-3`]: [
                { title: 'Furnace Repair - Lewis', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Duct Cleaning', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-5`]: [
                { title: 'AC Tune-up', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Thermostat Install', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-8`]: [
                { title: 'System Installation', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Filter Replacement', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-10`]: [
                { title: 'Thermostat Install', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Duct Cleaning', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-13`]: [
                { title: 'Emergency - No Heat', time: '5:00 PM', color: '#ea4335' }
            ],
            [`${currentYear}-${currentMonth + 1}-15`]: [
                { title: 'System Installation', time: '9:00 AM', color: '#0f9d58' },
                { title: 'AC Tune-up', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-17`]: [
                { title: 'Furnace Repair - Plaza', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Filter Replacement', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-19`]: [
                { title: 'AC Tune-up', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Air Quality Test', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-21`]: [
                { title: 'Furnace Repair - Lee', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Duct Cleaning', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-24`]: [
                { title: 'AC Tune-up', time: '3:00 PM', color: '#0f9d58' },
                { title: 'Filter Replacement', time: '10:00 AM', color: '#0f9d58' }
            ]
        },
        landscaping: {
            [`${currentYear}-${currentMonth + 1}-2`]: [
                { title: 'Lawn Mowing', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Tree Trimming', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-4`]: [
                { title: 'Hedge Trimming', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Leaf Cleanup', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-5`]: [
                { title: 'Lawn Mowing', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Fertilization', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-8`]: [
                { title: 'Sprinkler Repair', time: '11:00 AM', color: '#0f9d58' },
                { title: 'Mulching', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-10`]: [
                { title: 'Lawn Mowing', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Tree Trimming', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-12`]: [
                { title: 'Hedge Trimming', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Sod Installation', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-15`]: [
                { title: 'Lawn Mowing', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Weed Control', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-16`]: [
                { title: 'Mulching', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Plant Installation', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-18`]: [
                { title: 'Lawn Mowing', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Fertilization', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-20`]: [
                { title: 'Leaf Cleanup', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Tree Trimming', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-23`]: [
                { title: 'Lawn Mowing', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Weed Control', time: '10:00 AM', color: '#0f9d58' }
            ]
        },
        carpet: {
            [`${currentYear}-${currentMonth + 1}-2`]: [
                { title: 'Deep Cleaning', time: '7:00 AM', color: '#0f9d58' },
                { title: 'Stain Removal', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-3`]: [
                { title: 'Whole House Clean', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Pet Odor Treatment', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-6`]: [
                { title: 'Deep Cleaning', time: '7:00 AM', color: '#0f9d58' },
                { title: 'Stain Removal', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-9`]: [
                { title: 'Whole House Clean', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Upholstery Cleaning', time: '2:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-10`]: [
                { title: 'Area Rug Cleaning', time: '9:00 AM', color: '#0f9d58' },
                { title: 'Deep Cleaning', time: '11:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-14`]: [
                { title: 'Pet Odor Treatment', time: '11:00 AM', color: '#0f9d58' },
                { title: 'Area Rug Cleaning', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-16`]: [
                { title: 'Commercial Cleaning', time: '6:00 AM', color: '#0f9d58' },
                { title: 'Stain Removal', time: '10:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-18`]: [
                { title: 'Deep Cleaning', time: '8:00 AM', color: '#0f9d58' },
                { title: 'Upholstery Cleaning', time: '1:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-21`]: [
                { title: 'Whole House Clean', time: '1:00 PM', color: '#0f9d58' },
                { title: 'Pet Odor Treatment', time: '3:00 PM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-23`]: [
                { title: 'Commercial Cleaning', time: '7:00 AM', color: '#0f9d58' },
                { title: 'Area Rug Cleaning', time: '9:00 AM', color: '#0f9d58' }
            ],
            [`${currentYear}-${currentMonth + 1}-25`]: [
                { title: 'Move-out Cleaning', time: '10:00 AM', color: '#0f9d58' },
                { title: 'Deep Cleaning', time: '2:00 PM', color: '#0f9d58' }
            ]
        }
    };
    
    if (presets[preset]) {
        // Apply color coding to all events based on their titles
        const colorCodedEvents = {};
        for (const [dateKey, dayEvents] of Object.entries(presets[preset])) {
            colorCodedEvents[dateKey] = dayEvents.map(event => ({
                ...event,
                color: getAppointmentColor(event.title)
            }));
        }
        events = colorCodedEvents;
        renderCalendar();
        showSuccessMessage();
    }
}

function clearAllEvents() {
    if (confirm('Are you sure you want to clear all events?')) {
        events = {};
        renderCalendar();
    }
}

function loadSampleEvents() {
    // Load a realistic contractor calendar
    const appointments = [
        'Leak Repair', 'AC Tune-up', 'Outlet Installation', 'Drain Cleaning',
        'Furnace Repair', 'Panel Upgrade', 'Water Heater Install', 'Toilet Repair',
        'Duct Cleaning', 'Faucet Replacement', 'Circuit Breaker Repair', 'Filter Replacement'
    ];
    const customers = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    events = {};
    
    // Add realistic appointments - some days with multiple, some empty (no Sundays)
    const potentialSchedule = [
        {day: 2, count: 2},
        {day: 5, count: 1},
        {day: 6, count: 3},
        {day: 9, count: 1},
        {day: 12, count: 2},
        {day: 13, count: 1},
        {day: 16, count: 2},
        {day: 19, count: 1},
        {day: 20, count: 3},
        {day: 23, count: 1},
        {day: 26, count: 2},
        {day: 27, count: 1}
    ];
    
    // Filter out any Sundays
    const appointmentSchedule = potentialSchedule.filter(schedule => {
        const date = new Date(currentYear, currentMonth, schedule.day);
        return date.getDay() !== 0; // Not Sunday
    });
    
    let appointmentIndex = 0;
    appointmentSchedule.forEach(schedule => {
        const dateKey = `${currentYear}-${currentMonth + 1}-${schedule.day}`;
        events[dateKey] = [];
        
        for (let i = 0; i < schedule.count; i++) {
            const appointment = appointments[appointmentIndex % appointments.length];
            const customer = customers[appointmentIndex % customers.length];
            const time = times[(appointmentIndex + i * 2) % times.length];
            const fullTitle = `${appointment} - ${customer}`;
            
            events[dateKey].push({
                title: fullTitle,
                time: time,
                color: getAppointmentColor(fullTitle)
            });
            appointmentIndex++;
        }
    });
    
    renderCalendar();
}

// Profile Management Functions
function initializeProfile() {
    // Load saved profile from localStorage or use default
    const savedAvatar = localStorage.getItem('calendarProfileAvatar');
    
    if (savedAvatar) {
        setProfileImage(savedAvatar);
    } else {
        resetToDefaultAvatar();
    }
}

function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            setProfileImage(imageData);
            // Save to localStorage
            localStorage.setItem('calendarProfileAvatar', imageData);
        };
        reader.readAsDataURL(file);
    }
}

function setProfileImage(imageData) {
    // Update header profile
    const headerImg = document.getElementById('headerProfilePic');
    const defaultAvatar = document.getElementById('defaultAvatar');
    
    headerImg.src = imageData;
    headerImg.style.display = 'block';
    defaultAvatar.style.display = 'none';
    
    // Update preview
    const previewImg = document.getElementById('profilePreview');
    previewImg.src = imageData;
    previewImg.style.display = 'block';
}

function resetToDefaultAvatar() {
    // Hide profile images and show default avatar
    const headerImg = document.getElementById('headerProfilePic');
    const defaultAvatar = document.getElementById('defaultAvatar');
    const previewImg = document.getElementById('profilePreview');
    
    headerImg.style.display = 'none';
    defaultAvatar.style.display = 'flex';
    
    // Use a data URL for default avatar
    const defaultAvatarDataURL = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="30" fill="#5f6368"/>
            <path d="M30 30c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0 4c8.8 0 16 7.2 16 16H14c0-8.8 7.2-16 16-16z" fill="white"/>
        </svg>
    `);
    
    previewImg.src = defaultAvatarDataURL;
    previewImg.style.display = 'block';
    
    // Remove from localStorage
    localStorage.removeItem('calendarProfileAvatar');
}

// Animation Effects Functions
function startMissedOpportunitiesAnimation() {
    // Get all work events on the calendar (excluding emergency red ones)
    const allEventElements = document.querySelectorAll('.event');
    const workEvents = [];
    
    // Filter for work events (all colors except emergency red)
    allEventElements.forEach((element, index) => {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        const elementStyle = element.style.backgroundColor || element.style.background;
        
        // Exclude only emergency appointments (red colors)
        const isEmergency = bgColor === 'rgb(198, 40, 40)' || bgColor === 'rgb(211, 47, 47)' || 
                           bgColor === 'rgb(234, 67, 53)' || elementStyle === '#c62828' || 
                           elementStyle === '#d32f2f' || elementStyle === '#ea4335';
        
        if (!isEmergency) {
            workEvents.push({element, index});
        }
    });
    
    if (workEvents.length === 0) {
        alert('Please add some work appointments to the calendar first!');
        return;
    }
    
    // Calculate how many events to remove (about 45% of them, max 8)
    const eventsToRemove = Math.min(Math.ceil(workEvents.length * 0.45), 8);
    
    // Shuffle and select work events to remove
    const shuffled = workEvents.sort(() => Math.random() - 0.5);
    const selectedEvents = shuffled.slice(0, eventsToRemove);
    
    
    // Use appropriate sound based on animation style
    const animationStyle = document.getElementById('animationStyle').value;
    const soundFile = animationStyle === 'shake-vanish' ? 'beep-329314.mp3' : 'pop.mp3';
    const popSound = new Audio(soundFile);
    
    // Function to get random revenue amount based on appointment type
    function getRevenueAmount(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('install') || lowerTitle.includes('system') || lowerTitle.includes('remodel')) {
            return Math.floor(Math.random() * 1500) + 1500; // $1500-$3000
        } else if (lowerTitle.includes('repair')) {
            return Math.floor(Math.random() * 400) + 250; // $250-$650
        } else if (lowerTitle.includes('inspection') || lowerTitle.includes('tune-up')) {
            return Math.floor(Math.random() * 100) + 150; // $150-$250
        } else if (lowerTitle.includes('clean')) {
            return Math.floor(Math.random() * 200) + 200; // $200-$400
        } else if (lowerTitle.includes('mowing') || lowerTitle.includes('trimming')) {
            return Math.floor(Math.random() * 50) + 75; // $75-$125
        }
        return Math.floor(Math.random() * 300) + 200; // Default $200-$500
    }

    if (animationStyle === 'shake-vanish') {
        // Check if lost revenue should be shown
        const showLostRevenue = document.getElementById('showLostRevenue').checked;
        
        // Apply shake-vanish animation to ALL selected events at once
        selectedEvents.forEach((eventObj) => {
            const eventElement = eventObj.element;
            if (!eventElement) return;
            eventElement.classList.add('event-shake-vanish');
            
            // Add lost revenue indicator if enabled
            if (showLostRevenue) {
                const rect = eventElement.getBoundingClientRect();
                const revenueDiv = document.createElement('div');
                revenueDiv.className = 'lost-revenue';
                revenueDiv.textContent = `-$${getRevenueAmount(eventElement.textContent)}`;
                revenueDiv.style.left = `${rect.right + 10}px`;
                revenueDiv.style.top = `${rect.top + rect.height/2}px`;
                document.body.appendChild(revenueDiv);
                
                // Remove the element after animation
                setTimeout(() => {
                    revenueDiv.remove();
                }, 1500);
            }
        });
        
        // Play sound 3 times in a loop
        let playCount = 0;
        const playSound = () => {
            if (playCount < 3) {
                popSound.currentTime = 0;
                popSound.volume = 0.5;
                popSound.play().catch(e => console.log('Audio play failed:', e));
                playCount++;
                if (playCount < 3) {
                    setTimeout(playSound, 250); // Play again after 250ms
                }
            }
        };
        setTimeout(playSound, 200); // Start playing after 200ms
        
        // Remove all events after animation completes
        setTimeout(() => {
            selectedEvents.forEach((eventObj) => {
                const eventElement = eventObj.element;
                if (!eventElement) return;
                
                // Find the date key for this event
                const dayElement = eventElement.closest('.calendar-day');
                if (dayElement) {
                    const dayNumber = dayElement.querySelector('.day-number').textContent;
                    const dateKey = `${currentYear}-${currentMonth + 1}-${dayNumber}`;
                    
                    // Remove from events object
                    if (events[dateKey]) {
                        const eventTitle = eventElement.textContent.trim();
                        events[dateKey] = events[dateKey].filter(e => {
                            return e.title.trim() !== eventTitle;
                        });
                        
                        if (events[dateKey].length === 0) {
                            delete events[dateKey];
                        }
                    }
                }
                
                // Remove the element
                eventElement.remove();
            });
        }, 1000); // Match shake-vanish animation duration
    } else {
        // For other animation styles, keep the staggered approach
        selectedEvents.forEach((eventObj, i) => {
            setTimeout(() => {
                const eventElement = eventObj.element;
                if (!eventElement) return;
                
                const showLostRevenue = document.getElementById('showLostRevenue').checked;
                
                if (animationStyle === 'fade') {
                // Simple fade animation
                eventElement.classList.add('fading-out');
                
                // Add lost revenue indicator if enabled
                if (showLostRevenue) {
                    const rect = eventElement.getBoundingClientRect();
                    const revenueDiv = document.createElement('div');
                    revenueDiv.className = 'lost-revenue';
                    revenueDiv.textContent = `-$${getRevenueAmount(eventElement.textContent)}`;
                    revenueDiv.style.left = `${rect.right + 10}px`;
                    revenueDiv.style.top = `${rect.top + rect.height/2}px`;
                    document.body.appendChild(revenueDiv);
                    
                    // Remove the element after animation
                    setTimeout(() => {
                        revenueDiv.remove();
                    }, 1500);
                }
                
                // Play softer sound for fade
                setTimeout(() => {
                    const soundClone = popSound.cloneNode();
                    soundClone.volume = 0.1;
                    soundClone.play().catch(e => console.log('Audio play failed:', e));
                }, 300);
                
                // Remove after fade completes
                setTimeout(() => {
                    // Find the date key for this event
                    const dayElement = eventElement.closest('.calendar-day');
                    if (dayElement) {
                        const dayNumber = dayElement.querySelector('.day-number').textContent;
                        const dateKey = `${currentYear}-${currentMonth + 1}-${dayNumber}`;
                        
                        // Remove from events object
                        if (events[dateKey]) {
                            const eventTitle = eventElement.textContent.trim();
                            events[dateKey] = events[dateKey].filter(e => {
                                return e.title.trim() !== eventTitle;
                            });
                            
                            if (events[dateKey].length === 0) {
                                delete events[dateKey];
                            }
                        }
                    }
                    
                    // Remove the element
                    eventElement.remove();
                }, 1500); // Match slower fade animation duration
            } else {
                // Default strike and fall animation
                // First add strike-through effect
                eventElement.classList.add('striking');
                
                // Add lost revenue indicator if enabled
                if (showLostRevenue) {
                    const rect = eventElement.getBoundingClientRect();
                    const revenueDiv = document.createElement('div');
                    revenueDiv.className = 'lost-revenue';
                    revenueDiv.textContent = `-$${getRevenueAmount(eventElement.textContent)}`;
                    revenueDiv.style.left = `${rect.right + 10}px`;
                    revenueDiv.style.top = `${rect.top + rect.height/2}px`;
                    document.body.appendChild(revenueDiv);
                    
                    // Remove the element after animation
                    setTimeout(() => {
                        revenueDiv.remove();
                    }, 1500);
                }
                
                // Play sound when strike happens
                setTimeout(() => {
                    const soundClone = popSound.cloneNode();
                    soundClone.volume = 0.15;
                    soundClone.play().catch(e => console.log('Audio play failed:', e));
                }, 200);
                
                // After strike, make it crumble down
                setTimeout(() => {
                    // Keep the red color when transitioning
                    eventElement.style.background = '#ef5350';
                    eventElement.style.borderColor = '#c62828';
                    eventElement.classList.remove('striking');
                    eventElement.classList.add('crumbling');
                    
                    // Remove the event from data after crumble animation
                    setTimeout(() => {
                        // Find the date key for this event
                        const dayElement = eventElement.closest('.calendar-day');
                        if (dayElement) {
                            const dayNumber = dayElement.querySelector('.day-number').textContent;
                            const dateKey = `${currentYear}-${currentMonth + 1}-${dayNumber}`;
                            
                            // Remove from events object
                            if (events[dateKey]) {
                                const eventTitle = eventElement.textContent.trim();
                                events[dateKey] = events[dateKey].filter(e => {
                                    return e.title.trim() !== eventTitle;
                                });
                                
                                if (events[dateKey].length === 0) {
                                    delete events[dateKey];
                                }
                            }
                        }
                        
                        // Remove the element
                        eventElement.remove();
                    }, 800); // Match crumble animation duration
                }, 600); // Reduced timing for smoother transition
            }
        }, i * (animationStyle === 'fade' ? 450 : 500)); // Adjusted stagger for slower fade
    });
    
    // Notification messages disabled
    }
}

// Convert Question Marks or Lost Revenue to Appointments
function convertQuestionMarksToAppointments() {
    // Get both question marks and lost revenue markers
    const questionMarks = document.querySelectorAll('.what-if-marker');
    const revenueMarkers = document.querySelectorAll('.lost-revenue-marker');
    
    // Combine both NodeLists into an array
    const allMarkers = [...questionMarks, ...revenueMarkers];
    
    if (allMarkers.length === 0) {
        alert('Please run "What If?" or "Lost Revenue" animation first to show potential slots!');
        return;
    }
    
    // Get appointment pools for generating realistic appointments
    const appointments = [
        'Leak Repair', 'AC Tune-up', 'Outlet Installation', 'Drain Cleaning',
        'Furnace Repair', 'Panel Upgrade', 'Water Heater Install', 'Toilet Repair',
        'Duct Cleaning', 'Faucet Replacement', 'Circuit Breaker Repair', 'Filter Replacement',
        'Lawn Mowing', 'Tree Trimming', 'Carpet Cleaning', 'Inspection'
    ];
    const customers = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
    const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    // Play a success sound
    const successSound = new Audio('chaching.mp3');
    successSound.volume = 0.3;
    
    // Process each marker (question mark or revenue) sequentially - one completes before next starts
    allMarkers.forEach((marker, index) => {
        // Calculate timing: even faster animation for better flow
        const conversionDuration = 400; // Further reduced for faster conversion
        
        setTimeout(() => {
            // Add transformation animation based on marker type
            if (marker.classList.contains('what-if-marker')) {
                marker.classList.add('question-transforming');
            } else {
                marker.classList.add('revenue-transforming');
            }
            
            // Get the parent day element
            const dayElement = marker.parentElement;
            const dateKey = dayElement.getAttribute('data-date');
            
            // Generate 1-3 random appointments for this slot
            const appointmentCount = Math.floor(Math.random() * 3) + 1;
            const newAppointments = [];
            
            for (let i = 0; i < appointmentCount; i++) {
                const appointment = appointments[Math.floor(Math.random() * appointments.length)];
                const customer = customers[Math.floor(Math.random() * customers.length)];
                const time = times[Math.floor(Math.random() * times.length)];
                const fullTitle = `${appointment} - ${customer}`;
                
                newAppointments.push({
                    title: fullTitle,
                    time: time,
                    color: getAppointmentColor(fullTitle)
                });
            }
            
            // After transformation animation, add the actual appointments
            setTimeout(() => {
                // Remove the marker (question mark or revenue)
                marker.remove();
                
                // Add appointments to the events object
                if (!events[dateKey]) {
                    events[dateKey] = [];
                }
                events[dateKey].push(...newAppointments);
                
                // Instead of re-rendering entire calendar, just update this specific day
                // Find the events container for this day and add the new appointments
                const eventsContainer = dayElement.querySelector('.day-events');
                if (eventsContainer) {
                    // Clear any existing content in this specific day
                    eventsContainer.innerHTML = '';
                    
                    // Add the new appointments to this day only - matching exact style
                    const dayEvents = events[dateKey];
                    dayEvents.forEach((event, eventIndex) => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event'; // Use 'event' class like existing appointments
                        eventDiv.style.backgroundColor = event.color || '#4285f4';
                        eventDiv.textContent = event.title; // Just the title text, like existing events
                        eventDiv.title = `${event.title} - ${event.time}\nClick to delete`;
                        
                        // Add click handler for deletion to match existing functionality
                        eventDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (confirm(`Delete event "${event.title}"?`)) {
                                events[dateKey].splice(eventIndex, 1);
                                if (events[dateKey].length === 0) {
                                    delete events[dateKey];
                                }
                                renderCalendar();
                            }
                        });
                        
                        eventsContainer.appendChild(eventDiv);
                    });
                }
                
                // Play sound effect for each conversion
                const soundClone = successSound.cloneNode();
                soundClone.volume = 0.15;
                soundClone.play().catch(e => console.log('Audio play failed:', e));
            }, 300); // Further reduced for even faster animation
            
        }, index * conversionDuration); // Each conversion starts after previous one completes
    });
    
    // Notification messages disabled
}

// Lost Revenue Animation - Shows lost revenue amounts on empty calendar slots
function startLostRevenueAnimation() {
    // Wait 3 seconds before starting
    setTimeout(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const emptySlots = [];
        
        // Revenue amounts to randomly select from
        const revenueAmounts = [150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 425, 450];
        
        // Find all empty weekdays (not Sunday and no appointments)
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            // Skip Sundays
            if (dayOfWeek === 0) continue;
            
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            const hasAppointments = events[dateKey] && events[dateKey].length > 0;
            
            // Only add if completely empty (no appointments at all)
            if (!hasAppointments) {
                emptySlots.push({
                    day: day,
                    dateKey: dateKey,
                    dayOfWeek: dayOfWeek
                });
            }
        }
        
        // Play a cash register sound effect
        const lossSound = new Audio('beep-329314.mp3');
        lossSound.volume = 0.2;
        lossSound.play().catch(e => console.log('Audio play failed:', e));
        
        // Add lost revenue markers with staggered animation
        emptySlots.forEach((slot, index) => {
            setTimeout(() => {
                const dayElement = document.querySelector(`[data-date="${slot.dateKey}"]`);
                if (dayElement) {
                    // Generate random revenue amount
                    const revenue = revenueAmounts[Math.floor(Math.random() * revenueAmounts.length)];
                    
                    // Create lost revenue element
                    const revenueMarker = document.createElement('div');
                    revenueMarker.className = 'lost-revenue-marker lost-revenue-appearing';
                    revenueMarker.innerHTML = `−$${revenue}`;
                    revenueMarker.title = `Lost revenue opportunity: $${revenue}`;
                    
                    // Position it in the day cell
                    dayElement.style.position = 'relative';
                    dayElement.appendChild(revenueMarker);
                    
                    // Remove the appearing class after animation
                    setTimeout(() => {
                        revenueMarker.classList.remove('lost-revenue-appearing');
                    }, 600);
                }
            }, index * 100); // Stagger each marker by 100ms for faster animation
        });
        
        // Play sound effects at intervals
        if (emptySlots.length > 5) {
            setTimeout(() => {
                const soundClone = lossSound.cloneNode();
                soundClone.volume = 0.15;
                soundClone.play().catch(e => console.log('Audio play failed:', e));
            }, 1000);
        }
        
        if (emptySlots.length > 10) {
            setTimeout(() => {
                const soundClone = lossSound.cloneNode();
                soundClone.volume = 0.1;
                soundClone.play().catch(e => console.log('Audio play failed:', e));
            }, 2000);
        }
    }, 3000);
}

// What If Animation - Shows question marks in empty calendar slots
function startWhatIfAnimation() {
    // Wait 3 seconds before starting
    setTimeout(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const emptySlots = [];
        
        // Find all empty weekdays (not Sunday and no appointments)
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            // Skip Sundays
            if (dayOfWeek === 0) continue;
            
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            const hasAppointments = events[dateKey] && events[dateKey].length > 0;
            
            // Only add if completely empty (no appointments at all)
            if (!hasAppointments) {
                emptySlots.push({
                    day: day,
                    dateKey: dateKey,
                    dayOfWeek: dayOfWeek
                });
            }
        }
        
        // Use ALL empty weekday slots (no random selection)
        const selectedSlots = emptySlots;
        
        // Add question marks with staggered animation
        selectedSlots.forEach((slot, index) => {
            setTimeout(() => {
                const dayElement = document.querySelector(`[data-date="${slot.dateKey}"]`);
                if (dayElement) {
                    // Check if there's already a lost revenue marker in this slot
                    const existingRevenueMarker = dayElement.querySelector('.lost-revenue-marker');
                    if (existingRevenueMarker) {
                        // Skip this slot if it already has a lost revenue marker
                        return;
                    }
                    
                    // Create question mark element
                    const questionMark = document.createElement('div');
                    questionMark.className = 'what-if-marker what-if-appearing';
                    questionMark.innerHTML = '?';
                    questionMark.title = 'Potential booking opportunity!';
                    
                    // Position it in the day cell
                    dayElement.style.position = 'relative';
                    dayElement.appendChild(questionMark);
                    
                    // Remove the appearing class after animation
                    setTimeout(() => {
                        questionMark.classList.remove('what-if-appearing');
                    }, 600);
                }
            }, index * 150); // Stagger each question mark by 150ms
        });
        
        // Optional: Play a subtle sound effect
        const whooshSound = new Audio('pop.mp3'); // Using existing sound
        whooshSound.volume = 0.1;
        whooshSound.play().catch(e => console.log('Audio play failed:', e));
        
    }, 3000); // 3 second delay before starting
}

// Particle effect function
function createMagicParticles() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    const rect = calendarGrid.getBoundingClientRect();
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00CED1', '#32CD32'];
    
    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: rect.left + Math.random() * rect.width,
            y: rect.top + Math.random() * rect.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: Math.random() * 0.02 + 0.01
        });
    }
    
    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let allDead = true;
        particles.forEach(p => {
            if (p.life > 0) {
                allDead = false;
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // gravity
                p.life -= p.decay;
                
                // Draw particle
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw sparkle effect
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x - p.size * 2, p.y);
                ctx.lineTo(p.x + p.size * 2, p.y);
                ctx.moveTo(p.x, p.y - p.size * 2);
                ctx.lineTo(p.x, p.y + p.size * 2);
                ctx.stroke();
            }
        });
        
        if (!allDead) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    
    animate();
}

// Calendar Filling Animation
function startCalendarFillingAnimation() {
    const businessType = document.getElementById('fillingBusinessType').value;
    
    // Start with a realistic sparse calendar (not empty)
    events = {};
    
    // Add 3-4 initial appointments to show contractor's reality (avoiding Sundays)
    const initialAppointments = [];
    const preferredDays = [2, 5, 9, 12, 16, 19, 23, 26]; // Weekday-heavy selection
    let appointmentsAdded = 0;
    
    for (const day of preferredDays) {
        if (appointmentsAdded >= 4) break;
        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() !== 0) { // Not Sunday
            initialAppointments.push({ 
                day: day, 
                time: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'][appointmentsAdded] 
            });
            appointmentsAdded++;
        }
    }
    
    // Define appointment pools for each business type
    const appointmentPools = {
        plumbing: [
            'Leak Repair', 'Drain Cleaning', 'Water Heater Install', 'Toilet Repair',
            'Faucet Replacement', 'Pipe Installation', 'Annual Inspection', 
            'Sewer Line Check', 'Bathroom Remodel', 'Kitchen Plumbing'
        ],
        electrician: [
            'Outlet Installation', 'Circuit Breaker Repair', 'Panel Upgrade',
            'Light Fixture Install', 'Ceiling Fan Install', 'Electrical Inspection',
            'Rewiring Project', 'EV Charger Install', 'Smart Home Setup', 'Switch Repair'
        ],
        hvac: [
            'AC Tune-up', 'Filter Replacement', 'Furnace Repair', 'Duct Cleaning',
            'System Installation', 'Thermostat Install', 'Air Quality Test',
            'Seasonal Maintenance', 'Heat Pump Service', 'Coil Cleaning'
        ],
        landscaping: [
            'Lawn Mowing', 'Tree Trimming', 'Hedge Trimming', 'Leaf Cleanup',
            'Fertilization', 'Weed Control', 'Mulching', 'Sprinkler Repair',
            'Sod Installation', 'Garden Design'
        ],
        carpet: [
            'Deep Cleaning', 'Stain Removal', 'Whole House Clean', 'Pet Odor Treatment',
            'Area Rug Cleaning', 'Upholstery Cleaning', 'Commercial Cleaning',
            'Move-out Clean', 'Steam Cleaning', 'Spot Treatment'
        ]
    };
    
    const appointments = appointmentPools[businessType] || appointmentPools.plumbing;
    const customerNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
    const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    // Add initial appointments to show realistic starting point
    initialAppointments.forEach(appt => {
        const appointment = appointments[Math.floor(Math.random() * appointments.length)];
        const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
        const fullTitle = `${appointment} - ${customer}`;
        const dateKey = `${currentYear}-${currentMonth + 1}-${appt.day}`;
        
        events[dateKey] = [{
            title: fullTitle,
            time: appt.time,
            color: getAppointmentColor(fullTitle)
        }];
    });
    
    renderCalendar();
    
    // Use the cha-ching sound
    const chachingSound = new Audio('chaching.mp3');
    
    // Generate appointments to add in batches
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalNewAppointments = 30; // Total appointments to add
    
    // Create batches of appointments - more appointments for fuller look
    const batches = [
        [], // Batch 1: 8 appointments
        [], // Batch 2: 10 appointments  
        []  // Batch 3: 12 appointments
    ];
    
    const batchSizes = [8, 10, 12];
    let appointmentCount = 0;
    
    // Generate appointments for each batch with realistic distribution
    // Some days will be empty, some will have 1-3 appointments
    const dayAppointmentCounts = new Map(); // Track appointments per day
    
    // Initialize with existing appointments that were actually added
    initialAppointments.forEach(appt => {
        dayAppointmentCounts.set(appt.day, 1);
    });
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const appointmentsInBatch = batchSizes[batchIndex];
        let appointmentsPlaced = 0;
        
        while (appointmentsPlaced < appointmentsInBatch) {
            // Randomly decide: new day or add to existing busy day
            const useBusyDay = Math.random() < 0.65 && dayAppointmentCounts.size > 3; // 65% chance to make a busy day
            
            let day;
            if (useBusyDay) {
                // Pick a day that already has appointments (make it busier) but not Sunday
                const busyDays = Array.from(dayAppointmentCounts.keys()).filter(d => {
                    const date = new Date(currentYear, currentMonth, d);
                    const isSunday = date.getDay() === 0;
                    return !isSunday && dayAppointmentCounts.get(d) < 3; // Max 3 appointments per day, not Sunday
                });
                if (busyDays.length > 0) {
                    day = busyDays[Math.floor(Math.random() * busyDays.length)];
                } else {
                    // All busy days are full, pick a new non-Sunday day
                    let attempts = 0;
                    let foundValidDay = false;
                    do {
                        day = Math.floor(Math.random() * daysInMonth) + 1;
                        const date = new Date(currentYear, currentMonth, day);
                        const isSunday = date.getDay() === 0;
                        attempts++;
                        
                        if (!isSunday && !dayAppointmentCounts.has(day)) {
                            foundValidDay = true;
                            break;
                        }
                        
                        if (attempts > 30) {
                            // Find any available weekday
                            for (let d = 1; d <= daysInMonth; d++) {
                                const checkDate = new Date(currentYear, currentMonth, d);
                                if (checkDate.getDay() !== 0 && !dayAppointmentCounts.has(d)) {
                                    day = d;
                                    foundValidDay = true;
                                    break;
                                }
                            }
                            break;
                        }
                    } while (!foundValidDay);
                    
                    // If still no valid day found, skip this appointment
                    if (!foundValidDay) continue;
                }
            } else {
                // Pick a new empty day (but avoid Sundays)
                let attempts = 0;
                let foundValidDay = false;
                do {
                    day = Math.floor(Math.random() * daysInMonth) + 1;
                    const date = new Date(currentYear, currentMonth, day);
                    const isSunday = date.getDay() === 0;
                    attempts++;
                    
                    // Check if this day is valid
                    if (!isSunday && (!dayAppointmentCounts.has(day) || dayAppointmentCounts.get(day) < 3)) {
                        foundValidDay = true;
                        break;
                    }
                    
                    // If we've tried too many times, find any valid day
                    if (attempts > 20) {
                        for (let d = 1; d <= daysInMonth; d++) {
                            const checkDate = new Date(currentYear, currentMonth, d);
                            if (checkDate.getDay() !== 0 && (!dayAppointmentCounts.has(d) || dayAppointmentCounts.get(d) < 3)) {
                                day = d;
                                foundValidDay = true;
                                break;
                            }
                        }
                        break;
                    }
                } while (!foundValidDay);
                
                // If still no valid day found, skip this appointment
                if (!foundValidDay) continue;
            }
            
            // Make sure we have a valid day before proceeding
            if (!day || day < 1 || day > daysInMonth) {
                continue;
            }
            
            // Update count for this day
            dayAppointmentCounts.set(day, (dayAppointmentCounts.get(day) || 0) + 1);
            
            const appointment = appointments[Math.floor(Math.random() * appointments.length)];
            const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
            const timeIndex = Math.floor(Math.random() * times.length);
            const time = times[timeIndex];
            const fullTitle = `${appointment} - ${customer}`;
            
            batches[batchIndex].push({
                day: day,
                title: fullTitle,
                time: time,
                color: getAppointmentColor(fullTitle)
            });
            
            appointmentsPlaced++;
        }
    }
    
    // Wait 3-4 seconds before starting the animation
    setTimeout(() => {
        // Process each batch
        batches.forEach((batch, batchIndex) => {
            setTimeout(() => {
                // Add all appointments in this batch at once
                batch.forEach(appt => {
                    const dateKey = `${currentYear}-${currentMonth + 1}-${appt.day}`;
                    
                    if (!events[dateKey]) {
                        events[dateKey] = [];
                    }
                    
                    events[dateKey].push({
                        title: appt.title,
                        time: appt.time,
                        color: appt.color
                    });
                });
                
                // Re-render calendar with all new appointments
                renderCalendar();
                
                // Play cha-ching sound for this batch
                setTimeout(() => {
                    chachingSound.currentTime = 0;
                    chachingSound.volume = 0.4;
                    chachingSound.play().catch(e => console.log('Audio play failed:', e));
                    
                    // Create confetti-like particle effect
                    createMagicParticles();
                }, 100);
                
            }, batchIndex * 2000); // 2 seconds between batches
        });
    }, 3500); // Wait 3.5 seconds before starting
    
}