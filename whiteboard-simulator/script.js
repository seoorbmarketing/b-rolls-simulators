// Whiteboard state
let textElements = [];
let textIdCounter = 0;
let currentTextType = 'heading';
let currentTextColor = 'black';
let currentUnderline = 'none';
let animationTimeouts = [];
let isAnimating = false;
let boardLayout = 'center'; // 'center' or 'left'

// Audio setup
const typingSound = new Audio('typing.mp3');
typingSound.volume = 0.3;
typingSound.loop = true; // Loop the typing sound

// DOM Elements
const whiteboard = document.getElementById('whiteboard');
const textOverlay = document.getElementById('textOverlay');
const canvas = document.getElementById('whiteboardCanvas');
const ctx = canvas.getContext('2d');

// Initialize canvas size
function initializeCanvas() {
    const rect = whiteboard.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    loadFromLocalStorage();
    updatePreview();
});

// Window resize handler
window.addEventListener('resize', () => {
    initializeCanvas();
    renderAllText(false); // Don't show on resize
});

// Select text type
function selectTextType(type) {
    currentTextType = type;
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    updatePreview();
}

// Set board layout
function setBoardLayout(layout) {
    boardLayout = layout;
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.layout === layout);
    });
    renderAllText(true);
}

// Select text color
function selectTextColor(color) {
    currentTextColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
    updatePreview();
}

// Select underline style
function selectUnderline(underline) {
    currentUnderline = underline;
    document.querySelectorAll('.underline-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.underline === underline);
    });
    updatePreview();
}

// Update font size label
function updateFontSizeLabel() {
    const fontSize = document.getElementById('fontSize').value;
    document.getElementById('fontSizeLabel').textContent = fontSize + 'px';
    updatePreview();
}

// Update preview
function updatePreview() {
    const text = document.getElementById('textInput').value || 'Your text will appear here...';
    const fontStyle = document.getElementById('fontStyle').value;
    const fontSize = document.getElementById('fontSize').value;
    const preview = document.getElementById('textPreview');
    
    // Set font family and size
    preview.style.fontFamily = `'${fontStyle}', cursive`;
    preview.style.fontSize = fontSize + 'px';
    preview.style.textAlign = 'center';
    preview.style.fontWeight = currentTextType === 'heading' ? '700' : '400';
    
    // Set text color
    const colorMap = {
        'black': '#000',
        'blue': '#2196F3',
        'grey': '#666'
    };
    preview.style.color = colorMap[currentTextColor] || '#000';
    
    // Apply underline
    let underlineClass = '';
    if (currentUnderline !== 'none') {
        underlineClass = `underline-${currentUnderline}`;
    }
    
    if (underlineClass) {
        preview.innerHTML = `<span class="${underlineClass}">${text}</span>`;
    } else {
        preview.innerHTML = text;
    }
}

// Calculate text position based on order and previous text sizes
function calculateTextPosition(index) {
    const startY = 80; // starting Y position
    let currentY = startY;
    
    // Calculate position based on previous elements' sizes
    for (let i = 0; i < index && i < textElements.length; i++) {
        const element = textElements[i];
        const elementHeight = element.fontSize || 60; // default font size
        const spacing = Math.max(30, elementHeight * 0.5); // Dynamic spacing based on font size
        currentY += elementHeight + spacing;
    }
    
    return {
        x: 50, // Always center horizontally
        y: currentY
    };
}

// Add text to board
function addTextToBoard() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        alert('Please enter some text');
        return;
    }
    
    const fontStyle = document.getElementById('fontStyle').value;
    const fontSize = parseInt(document.getElementById('fontSize').value);
    
    // Calculate position based on existing elements
    const position = calculateTextPosition(textElements.length);
    
    let textElement = {
        id: textIdCounter++,
        text: text,
        type: currentTextType,
        fontStyle: fontStyle,
        fontSize: fontSize,
        textColor: currentTextColor,
        underline: currentUnderline,
        animated: false,
        visible: false // Start as invisible
    };
    
    textElements.push(textElement);
    renderTextElement(textElement, false, false); // Don't animate, don't show
    updateTextElementsList();
    
    // Clear input
    document.getElementById('textInput').value = '';
    updatePreview();
    
    // Save to localStorage
    saveToLocalStorage();
}

// Render text element on board
function renderTextElement(element, animate = false, show = false) {
    const div = document.createElement('div');
    div.className = `text-element ${element.type}`;
    div.id = `text-${element.id}`;
    div.style.fontFamily = `'${element.fontStyle}', cursive`;
    div.style.fontSize = element.fontSize + 'px';
    div.style.fontWeight = element.type === 'heading' ? '700' : '400';
    
    // Set text color
    const colorMap = {
        'black': '#000',
        'blue': '#2196F3',
        'grey': '#666'
    };
    div.style.color = colorMap[element.textColor] || '#000';
    
    // Position based on board layout
    const boardRect = whiteboard.getBoundingClientRect();
    const index = textElements.findIndex(el => el.id === element.id);
    const position = calculateTextPosition(index);
    
    if (boardLayout === 'center') {
        div.style.left = '50%';
        div.style.top = position.y + 'px';
        div.style.transform = 'translateX(-50%)';
        div.style.textAlign = 'center';
    } else {
        div.style.left = '40px';
        div.style.top = position.y + 'px';
        div.style.textAlign = 'left';
    }
    
    // Create text wrapper for animation
    const textWrapper = document.createElement('div');
    textWrapper.className = 'text-wrapper';
    
    // Split text into characters for animation
    const chars = element.text.split('');
    
    if (animate && !element.animated) {
        // Create spans for each character
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space
            textWrapper.appendChild(span);
        });
        
        // Add underline if needed
        if (element.underline !== 'none') {
            const underlineLine = document.createElement('span');
            underlineLine.className = `underline-line ${element.underline}`;
            // Calculate underline thickness based on font size
            const thickness = Math.max(3, Math.floor(element.fontSize / 15));
            underlineLine.style.height = thickness + 'px';
            textWrapper.appendChild(underlineLine);
            textWrapper.classList.add(`underline-${element.underline}`);
        }
        
        div.classList.add('animating');
        div.appendChild(textWrapper);
        
        // Animate characters one by one
        setTimeout(() => {
            animateCharacters(div, element);
        }, 50);
    } else if (show || element.visible) {
        // Show immediately without animation
        textWrapper.textContent = element.text;
        
        if (element.underline !== 'none') {
            const underlineLine = document.createElement('span');
            underlineLine.className = `underline-line ${element.underline}`;
            underlineLine.style.width = '100%';
            // Calculate underline thickness based on font size
            const thickness = Math.max(3, Math.floor(element.fontSize / 15));
            underlineLine.style.height = thickness + 'px';
            textWrapper.appendChild(underlineLine);
            textWrapper.classList.add(`underline-${element.underline}`);
        }
        
        div.classList.add('animating');
        div.appendChild(textWrapper);
    } else {
        // Keep hidden
        textWrapper.textContent = '';
        div.appendChild(textWrapper);
    }
    
    // Make draggable only if visible
    if (show || element.visible) {
        makeDraggable(div, element);
    }
    
    textOverlay.appendChild(div);
}

// Animate characters one by one
function animateCharacters(element, textData) {
    const chars = element.querySelectorAll('.char');
    const underlineLine = element.querySelector('.underline-line');
    element.classList.add('writing');
    
    // Start typing sound
    typingSound.currentTime = 0;
    typingSound.play().catch(e => {
        // Ignore audio play errors
    });
    
    // Simple typing animation - one character at a time
    chars.forEach((char, index) => {
        const timeout = setTimeout(() => {
            char.classList.add('visible');
        }, index * 100); // 100ms between each character for typing effect
        
        animationTimeouts.push(timeout);
    });
    
    // Stop typing sound after text is complete
    const stopSoundTimeout = setTimeout(() => {
        typingSound.pause();
        typingSound.currentTime = 0;
    }, chars.length * 100);
    animationTimeouts.push(stopSoundTimeout);
    
    // Animate underline after text is complete
    if (underlineLine && textData.underline !== 'none') {
        const underlineTimeout = setTimeout(() => {
            underlineLine.classList.add('animating');
        }, chars.length * 100 + 100);
        animationTimeouts.push(underlineTimeout);
    }
    
    // Mark as animated after all characters and underline are shown
    const completeTimeout = setTimeout(() => {
        textData.animated = true;
        textData.visible = true;
    }, chars.length * 100 + 800);
    animationTimeouts.push(completeTimeout);
}

// Play writing animation
function playWritingAnimation() {
    if (isAnimating) {
        alert('Animation is already playing');
        return;
    }
    
    if (textElements.length === 0) {
        alert('Please add some text elements first');
        return;
    }
    
    isAnimating = true;
    
    // Clear all timeouts
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
    
    // Clear and reset all elements
    textOverlay.innerHTML = '';
    textElements.forEach(element => {
        element.animated = false;
        element.visible = false;
    });
    
    // Animate each element with delay
    let delay = 0;
    textElements.forEach((element, index) => {
        const timeout = setTimeout(() => {
            renderTextElement(element, true, false);
            
            // Check if this is the last element
            if (index === textElements.length - 1) {
                const finalTimeout = setTimeout(() => {
                    isAnimating = false;
                    // Make all elements draggable after animation
                    textElements.forEach(el => {
                        el.visible = true;
                        const div = document.getElementById(`text-${el.id}`);
                        if (div) makeDraggable(div, el);
                    });
                }, element.text.length * 100 + 500); // Wait for last animation to complete
                animationTimeouts.push(finalTimeout);
            }
        }, delay);
        animationTimeouts.push(timeout);
        
        // Calculate delay for next element based on current element's text length
        delay += (element.text.length * 100) + 1500; // Character animation time + 1.5 second pause
    });
}

// Stop animation
function stopAnimation() {
    // Clear all animation timeouts
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
    
    // Stop typing sound
    typingSound.pause();
    typingSound.currentTime = 0;
    
    isAnimating = false;
    
    // Show all elements immediately
    textElements.forEach(element => {
        element.animated = true;
        element.visible = true;
    });
    renderAllText(true); // Show all
}

// Make element draggable
function makeDraggable(element, textData) {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
        if (isAnimating) return; // Don't allow dragging during animation
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
        
        // Don't update position in data - positions are auto-calculated
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'move';
            element.style.zIndex = '';
            saveToLocalStorage();
        }
    });
}

// Render all text elements
function renderAllText(showAll = false) {
    textOverlay.innerHTML = '';
    textElements.forEach(element => {
        if (showAll) {
            element.visible = true;
        }
        renderTextElement(element, false, element.visible);
    });
}

// Update text elements list
function updateTextElementsList() {
    const list = document.getElementById('textElementsList');
    
    if (textElements.length === 0) {
        list.innerHTML = '<p class="empty-state">No text elements yet</p>';
        return;
    }
    
    list.innerHTML = textElements.map(element => `
        <div class="text-element-item">
            <span class="text-content">${element.text}</span>
            <button class="delete-btn" onclick="deleteTextElement(${element.id})">Delete</button>
        </div>
    `).join('');
}

// Delete text element
function deleteTextElement(id) {
    textElements = textElements.filter(e => e.id !== id);
    renderAllText(false);
    updateTextElementsList();
    saveToLocalStorage();
}

// Clear whiteboard
function clearWhiteboard() {
    if (confirm('Are you sure you want to clear the entire whiteboard?')) {
        textElements = [];
        textOverlay.innerHTML = '';
        updateTextElementsList();
        saveToLocalStorage();
    }
}

// Export as image
function exportAsImage() {
    // First, make sure all elements are visible
    const wasAnimating = isAnimating;
    if (wasAnimating) {
        stopAnimation();
    }
    
    // Create a temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    const rect = whiteboard.getBoundingClientRect();
    tempCanvas.width = rect.width;
    tempCanvas.height = rect.height;
    
    // Draw white background with grid
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw grid lines
    tempCtx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
    tempCtx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < tempCanvas.width; x += 30) {
        tempCtx.beginPath();
        tempCtx.moveTo(x, 0);
        tempCtx.lineTo(x, tempCanvas.height);
        tempCtx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < tempCanvas.height; y += 30) {
        tempCtx.beginPath();
        tempCtx.moveTo(0, y);
        tempCtx.lineTo(tempCanvas.width, y);
        tempCtx.stroke();
    }
    
    // Draw text elements (only visible ones)
    textElements.forEach(element => {
        if (element.visible) {
            tempCtx.font = `${element.type === 'heading' ? 'bold' : 'normal'} ${element.fontSize}px '${element.fontStyle}', cursive`;
            tempCtx.fillStyle = 'black';
            tempCtx.textBaseline = 'top';
            
            const x = (element.x / 100) * tempCanvas.width;
            const y = (element.y / 100) * tempCanvas.height;
            
            // Handle alignment
            if (element.alignment === 'center') {
                tempCtx.textAlign = 'center';
            } else if (element.alignment === 'right') {
                tempCtx.textAlign = 'right';
            } else {
                tempCtx.textAlign = 'left';
            }
            
            // Draw text
            tempCtx.fillText(element.text, x, y);
            
            // Draw underline if needed
            if (element.underline !== 'none') {
                const metrics = tempCtx.measureText(element.text);
                let underlineX = x;
                let underlineWidth = metrics.width;
                
                if (element.alignment === 'center') {
                    underlineX -= metrics.width / 2;
                } else if (element.alignment === 'right') {
                    underlineX -= metrics.width;
                }
                
                tempCtx.strokeStyle = element.underline === 'black' ? '#000' : 
                                      element.underline === 'green' ? '#4CAF50' : '#f44336';
                tempCtx.lineWidth = 3;
                tempCtx.beginPath();
                tempCtx.moveTo(underlineX, y + element.fontSize + 2);
                tempCtx.lineTo(underlineX + underlineWidth, y + element.fontSize + 2);
                tempCtx.stroke();
            }
        }
    });
    
    // Download image
    tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whiteboard-' + Date.now() + '.png';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Save to localStorage
function saveToLocalStorage() {
    const data = {
        textElements: textElements,
        lastUpdated: Date.now()
    };
    localStorage.setItem('whiteboardData', JSON.stringify(data));
}

// Load from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('whiteboardData');
    if (saved) {
        const data = JSON.parse(saved);
        textElements = data.textElements || [];
        // Don't show elements on load - wait for play button
        textElements.forEach(element => {
            element.animated = false;
            element.visible = false;
        });
        textIdCounter = textElements.length > 0 ? 
            Math.max(...textElements.map(e => e.id)) + 1 : 0;
        renderAllText(false); // Don't show on load
        updateTextElementsList();
    }
}

// Text input live preview
document.getElementById('textInput').addEventListener('input', updatePreview);
document.getElementById('fontStyle').addEventListener('change', updatePreview);
document.getElementById('fontSize').addEventListener('input', updatePreview);