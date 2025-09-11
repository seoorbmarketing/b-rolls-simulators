// Current animation state
let currentAnimation = 'fadeIn';
let currentBackground = 'green';
let animationTimeout = null;

// Background colors
const backgrounds = {
    green: '#00ff00',
    white: '#ffffff',
    black: '#000000'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateText();
    updateFont();
    updateFontSize();
    updateFontWeight();
    // Set initial text color to black
    document.getElementById('textContent').style.color = '#000000';
});

// Update text content
function updateText() {
    const text = document.getElementById('textInput').value;
    document.getElementById('textContent').textContent = text;
}

// Update font family
function updateFont() {
    const font = document.getElementById('fontFamily').value;
    document.getElementById('textContent').style.fontFamily = font;
}

// Update font size
function updateFontSize() {
    const size = document.getElementById('fontSize').value;
    document.getElementById('fontSizeLabel').textContent = size + 'px';
    document.getElementById('textContent').style.fontSize = size + 'px';
}

// Update font weight
function updateFontWeight() {
    const weight = document.getElementById('fontWeight').value;
    document.getElementById('textContent').style.fontWeight = weight;
}

// Select text color
function selectTextColor(color, btn) {
    // Update active state
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update color
    document.getElementById('textContent').style.color = color;
}

// Select animation
function selectAnimation(animation) {
    currentAnimation = animation;
    
    // Update active state
    document.querySelectorAll('.animation-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.animation-btn').classList.add('active');
}

// Update animation settings
function updateAnimation() {
    playAnimation();
}

// Update duration
function updateDuration() {
    const duration = document.getElementById('duration').value;
    document.getElementById('durationLabel').textContent = duration + 's';
}

// Update delay
function updateDelay() {
    const delay = document.getElementById('delay').value;
    document.getElementById('delayLabel').textContent = delay + 's';
}

// Update easing
function updateEasing() {
    // Will be applied during animation
}

// Select background
function selectBackground(bg, btn) {
    currentBackground = bg;
    
    // Update active state
    document.querySelectorAll('.bg-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update background
    const screen = document.getElementById('animationScreen');
    screen.style.background = backgrounds[bg];
    
    // Adjust text color for light backgrounds
    if (bg === 'white' || bg === 'green') {
        const currentColor = document.getElementById('textContent').style.color;
        if (!currentColor || currentColor === 'white' || currentColor === 'rgb(255, 255, 255)') {
            document.getElementById('textContent').style.color = '#333';
        }
    }
    // If background is black, ensure text is visible
    if (bg === 'black') {
        const currentColor = document.getElementById('textContent').style.color;
        if (currentColor === 'black' || currentColor === '#000000' || currentColor === 'rgb(0, 0, 0)' || currentColor === '#333' || currentColor === 'rgb(51, 51, 51)') {
            document.getElementById('textContent').style.color = '#ffffff';
        }
    }
}

// Play animation
function playAnimation() {
    const textElement = document.getElementById('textElement');
    const textContent = document.getElementById('textContent');
    const duration = parseFloat(document.getElementById('duration').value);
    const delay = parseFloat(document.getElementById('delay').value) * 1000;
    const easing = document.getElementById('easing').value;
    const direction = document.getElementById('animationDirection').value;
    
    // Clear any existing animation
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    // Remove all animation classes
    textElement.style.animation = 'none';
    textContent.classList.remove('typewriter-text');
    
    // Force reflow
    void textElement.offsetWidth;
    
    // Special handling for typewriter
    if (currentAnimation === 'typewriter') {
        textContent.classList.add('typewriter-text');
        textContent.style.animation = `typing ${duration}s steps(40, end), blink-caret 0.75s step-end infinite`;
        
        if (direction === 'reverse' || direction === 'alternate') {
            setTimeout(() => {
                textContent.style.animation = `typing ${duration}s steps(40, end) reverse, blink-caret 0.75s step-end infinite`;
            }, direction === 'alternate' ? duration * 1000 + 500 : 0);
        }
        return;
    }
    
    // Apply animation after delay
    animationTimeout = setTimeout(() => {
        let animationName = currentAnimation;
        let iterations = '1';
        
        if (direction === 'alternate') {
            iterations = '2';
        }
        
        const animationString = `${animationName} ${duration}s ${easing} ${iterations} ${direction}`;
        textElement.style.animation = animationString;
        
        // Handle animation end
        textElement.addEventListener('animationend', () => {
            if (direction === 'reverse') {
                textElement.style.opacity = '0';
            } else if (direction === 'normal' || direction === 'alternate') {
                textElement.style.opacity = '1';
            }
        }, { once: true });
    }, delay);
}

// Reset animation
function resetAnimation() {
    // Reset all inputs
    document.getElementById('textInput').value = 'Hello World';
    document.getElementById('fontFamily').selectedIndex = 0;
    document.getElementById('fontSize').value = 48;
    document.getElementById('fontWeight').value = '600';
    document.getElementById('animationDirection').value = 'normal';
    document.getElementById('duration').value = 1.5;
    document.getElementById('delay').value = 0;
    document.getElementById('easing').value = 'ease-in-out';
    
    // Update displays
    updateText();
    updateFont();
    updateFontSize();
    updateFontWeight();
    updateDuration();
    updateDelay();
    
    // Reset animation
    const textElement = document.getElementById('textElement');
    textElement.style.animation = 'none';
    textElement.style.opacity = '1';
    
    // Reset colors and background
    document.getElementById('textContent').style.color = '#000000';
    document.querySelectorAll('.color-btn:not(.bg-color-btn)').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.color-btn:not(.bg-color-btn)')[1].classList.add('active'); // Black color button
    
    const firstBgBtn = document.querySelector('.bg-color-btn');
    selectBackground('green', firstBgBtn);
    
    // Reset animation selection
    currentAnimation = 'fadeIn';
    document.querySelectorAll('.animation-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.animation-btn').classList.add('active');
}

// Export animation (placeholder)
function exportAnimation() {
    alert('Export functionality would record the animation and convert to GIF format. This requires additional libraries like gif.js or server-side processing.');
}