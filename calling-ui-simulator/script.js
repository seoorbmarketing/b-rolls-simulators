// Call state management
let callState = 'idle'; // idle, incoming, active
let callTimer = null;
let callStartTime = null;
let autoAnswerTimeout = null;
let audioFile = null;
let waveformAnimation = null;
let isRingtoneMuted = false;

// Audio visualization
let audioContext = null;
let analyser = null;
let source = null;
let dataArray = null;

// DOM Elements
const incomingCallScreen = document.getElementById('incomingCallScreen');
const activeCallScreen = document.getElementById('activeCallScreen');
const callAudio = document.getElementById('callAudio');
const ringtoneAudio = document.getElementById('ringtoneAudio');
const callDuration = document.getElementById('callDuration');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedSettings();
    loadSavedSummaryText();
    initializeWaveform();
});

// Load saved settings
function loadSavedSettings() {
    const savedSettings = localStorage.getItem('callingUISettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('inputCallerName').value = settings.callerName !== undefined ? settings.callerName : 'John Doe';
        document.getElementById('inputCallerNumber').value = settings.callerNumber !== undefined ? settings.callerNumber : '+1 (555) 123-4545';
        document.getElementById('inputCallerSubtext').value = settings.callerSubtext !== undefined ? settings.callerSubtext : 'Customer';
        document.getElementById('avatarUrl').value = settings.avatarUrl || '';
        document.getElementById('avatarType').value = settings.avatarType || 'human';
        document.getElementById('botStyle').value = settings.botStyle || 'default';
        
        // Apply avatar type selection
        if (settings.avatarType === 'bot') {
            selectAvatarType('bot');
            if (settings.botStyle) {
                selectBotStyle(settings.botStyle);
            }
        } else {
            // Show remove button if human avatar exists
            if (settings.avatarUrl) {
                document.getElementById('removeAvatarBtn').style.display = 'block';
            }
        }
        
        updateCallerInfo();
    }
    
    // Load simulation preferences
    const savedPrefs = localStorage.getItem('callingUIPreferences');
    if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.showSummary !== undefined) {
            document.getElementById('showSummary').checked = prefs.showSummary;
        }
        if (prefs.initialMinutes !== undefined) {
            document.getElementById('initialMinutes').value = prefs.initialMinutes;
        }
        if (prefs.initialSeconds !== undefined) {
            document.getElementById('initialSeconds').value = prefs.initialSeconds;
        }
    }
    
    // Load saved audio
    loadSavedAudio();
}

// Load saved audio from localStorage
function loadSavedAudio() {
    const savedAudio = localStorage.getItem('callingUIAudio');
    if (savedAudio) {
        try {
            const audioStorage = JSON.parse(savedAudio);
            
            // Set audio source
            callAudio.src = audioStorage.data;
            audioFile = true; // Mark that we have audio
            
            // Update status
            const status = document.getElementById('audioStatus');
            status.textContent = `✓ Audio loaded: ${audioStorage.name}`;
            status.classList.add('active');
            status.style.display = 'block';
        } catch (e) {
            console.log('Failed to load saved audio:', e);
        }
    }
}

// Save settings
function saveSettings() {
    const settings = {
        callerName: document.getElementById('inputCallerName').value,
        callerNumber: document.getElementById('inputCallerNumber').value,
        callerSubtext: document.getElementById('inputCallerSubtext').value,
        avatarUrl: document.getElementById('avatarUrl').value,
        avatarType: document.getElementById('avatarType').value,
        botStyle: document.getElementById('botStyle').value
    };
    localStorage.setItem('callingUISettings', JSON.stringify(settings));
}

// Save preferences (simulation options)
function savePreferences() {
    const prefs = {
        showSummary: document.getElementById('showSummary').checked,
        initialMinutes: parseInt(document.getElementById('initialMinutes').value) || 0,
        initialSeconds: parseInt(document.getElementById('initialSeconds').value) || 0
    };
    localStorage.setItem('callingUIPreferences', JSON.stringify(prefs));
}

// Update caller information
function updateCallerInfo() {
    const name = document.getElementById('inputCallerName').value;
    const number = document.getElementById('inputCallerNumber').value;
    const subtext = document.getElementById('inputCallerSubtext').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    
    // Mask phone number (show last 2 digits)
    const maskedNumber = maskPhoneNumber(number);
    
    // Update incoming call screen
    document.getElementById('callerName').textContent = name;
    document.getElementById('callerNumber').textContent = number; // Show full number, no masking
    document.getElementById('callerSubtext').textContent = subtext;
    
    // Update active call screen
    document.getElementById('activeCallerName').textContent = name;
    document.getElementById('activeCallerSubtext').textContent = subtext;
    
    // Update avatar display based on type
    updateAvatarDisplay();
    
    // Save settings
    saveSettings();
}

// Mask phone number
function maskPhoneNumber(number) {
    // Mask only 4 digits before the last 2 digits
    if (number.length > 6) {
        const lastTwo = number.slice(-2);
        const beforeLastTwo = number.slice(0, -2);
        const maskedPart = beforeLastTwo.slice(0, -4) + '****';
        return `${maskedPart}${lastTwo}`;
    }
    return number;
}

// Handle audio upload
function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        audioFile = file;
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioData = e.target.result;
            
            // Save to localStorage
            const audioStorage = {
                data: audioData,
                name: file.name,
                type: file.type
            };
            localStorage.setItem('callingUIAudio', JSON.stringify(audioStorage));
            
            // Set audio source
            callAudio.src = audioData;
            
            // Update status
            const status = document.getElementById('audioStatus');
            status.textContent = `✓ Audio loaded: ${file.name}`;
            status.classList.add('active');
            status.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Setup audio event listeners
function setupAudioListeners() {
    const audio = document.getElementById('callAudio');
    const progressBar = document.getElementById('audioProgress');
    const currentTimeSpan = document.getElementById('audioCurrentTime');
    const durationSpan = document.getElementById('audioDuration');
    
    // Update duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
    });
    
    // Update progress bar and time
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
    });
    
    // Seek when progress bar changes
    progressBar.addEventListener('input', () => {
        if (audio.duration) {
            const seekTime = (progressBar.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });
}

// Format time in mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play audio
function playAudio() {
    const audio = document.getElementById('callAudio');
    if (audio.src) {
        audio.play();
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'flex';
        
        // Start visualizer if in active call
        if (callState === 'active') {
            startWaveformAnimation();
        }
    }
}

// Pause audio
function pauseAudio() {
    const audio = document.getElementById('callAudio');
    audio.pause();
    document.getElementById('playBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

// Replay audio
function replayAudio() {
    const audio = document.getElementById('callAudio');
    if (audio.src) {
        audio.currentTime = 0;
        playAudio();
    }
}

// Clear audio
function clearAudio() {
    // Stop audio if playing
    const audio = document.getElementById('callAudio');
    audio.pause();
    audio.src = '';
    audioFile = null;
    
    // Clear from localStorage
    localStorage.removeItem('callingUIAudio');
    
    // Hide controls and status
    document.getElementById('audioControls').style.display = 'none';
    document.getElementById('audioStatus').style.display = 'none';
    document.getElementById('audioStatus').classList.remove('active');
    
    // Reset file input
    document.getElementById('audioUpload').value = '';
    
    // Stop visualizer if active
    if (callState === 'active') {
        stopWaveformAnimation();
        initializeWaveform();
    }
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataURL = e.target.result;
            document.getElementById('avatarUrl').value = dataURL;
            
            // Show uploaded avatar, hide default
            document.getElementById('callerAvatar').src = dataURL;
            document.getElementById('callerAvatar').style.display = 'block';
            document.getElementById('callerAvatarDefault').style.display = 'none';
            
            document.getElementById('activeCallerAvatar').src = dataURL;
            document.getElementById('activeCallerAvatar').style.display = 'block';
            document.getElementById('activeCallerAvatarDefault').style.display = 'none';
            
            // Show remove button
            document.getElementById('removeAvatarBtn').style.display = 'block';
            
            // Save to localStorage
            saveSettings();
        };
        reader.readAsDataURL(file);
    }
}

// Remove avatar function
function removeAvatar() {
    // Clear the avatar URL
    document.getElementById('avatarUrl').value = '';
    
    // Hide uploaded avatar, show default
    document.getElementById('callerAvatar').src = '';
    document.getElementById('callerAvatar').style.display = 'none';
    document.getElementById('callerAvatarDefault').style.display = 'flex';
    
    document.getElementById('activeCallerAvatar').src = '';
    document.getElementById('activeCallerAvatar').style.display = 'none';
    document.getElementById('activeCallerAvatarDefault').style.display = 'flex';
    
    // Hide remove button
    document.getElementById('removeAvatarBtn').style.display = 'none';
    
    // Clear file input
    document.getElementById('avatarUpload').value = '';
    
    // Save to localStorage
    saveSettings();
}

// Select avatar type (human or bot)
function selectAvatarType(type) {
    // Update buttons
    document.querySelectorAll('.avatar-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide options
    if (type === 'human') {
        document.getElementById('humanAvatarOptions').style.display = 'block';
        document.getElementById('botAvatarOptions').style.display = 'none';
    } else {
        document.getElementById('humanAvatarOptions').style.display = 'none';
        document.getElementById('botAvatarOptions').style.display = 'block';
    }
    
    // Update hidden input
    document.getElementById('avatarType').value = type;
    
    // Update avatar display
    updateAvatarDisplay();
    
    // Save to localStorage
    saveSettings();
}

// Select bot style
function selectBotStyle(style) {
    // Update buttons
    document.querySelectorAll('.bot-style-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === style) {
            btn.classList.add('active');
        }
    });
    
    // Update hidden input
    document.getElementById('botStyle').value = style;
    
    // Update avatar display
    updateAvatarDisplay();
    
    // Save to localStorage
    saveSettings();
}

// Update avatar display based on type and style
function updateAvatarDisplay() {
    const avatarType = document.getElementById('avatarType').value;
    const botStyle = document.getElementById('botStyle').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    
    const callerAvatarContainer = document.getElementById('callerAvatarContainer');
    const activeCallerAvatarContainer = document.getElementById('activeCallerAvatarContainer');
    
    if (avatarType === 'bot') {
        // Clear any existing content and add bot avatar
        const botIcons = {
            'default': 'fas fa-robot',
            'circuit': 'fas fa-microchip',
            'assistant': 'fas fa-headset',
            'ai': 'fas fa-brain'
        };
        
        // Update incoming call avatar
        callerAvatarContainer.innerHTML = `
            <div class="avatar-bot bot-${botStyle}">
                <i class="${botIcons[botStyle]}"></i>
            </div>
        `;
        
        // Update active call avatar
        activeCallerAvatarContainer.innerHTML = `
            <div class="avatar-bot bot-${botStyle}">
                <i class="${botIcons[botStyle]}"></i>
            </div>
        `;
    } else {
        // Restore human avatar structure
        if (avatarUrl) {
            callerAvatarContainer.innerHTML = `
                <img id="callerAvatar" src="${avatarUrl}" alt="Caller" style="display: block;">
                <div id="callerAvatarDefault" class="avatar-default" style="display: none;">
                    <i class="fas fa-user"></i>
                </div>
            `;
            activeCallerAvatarContainer.innerHTML = `
                <img id="activeCallerAvatar" src="${avatarUrl}" alt="Caller" style="display: block;">
                <div id="activeCallerAvatarDefault" class="avatar-default-small" style="display: none;">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            callerAvatarContainer.innerHTML = `
                <img id="callerAvatar" src="" alt="Caller" style="display: none;">
                <div id="callerAvatarDefault" class="avatar-default" style="display: flex;">
                    <i class="fas fa-user"></i>
                </div>
            `;
            activeCallerAvatarContainer.innerHTML = `
                <img id="activeCallerAvatar" src="" alt="Caller" style="display: none;">
                <div id="activeCallerAvatarDefault" class="avatar-default-small" style="display: flex;">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
    }
}

// Start incoming call
function startIncomingCall() {
    if (callState !== 'idle') {
        return;
    }
    
    callState = 'incoming';
    incomingCallScreen.style.display = 'flex';
    activeCallScreen.style.display = 'none';
    
    // Start ringtone and vibration
    startRingtone();
    startVibration();
    
    // Auto-answer if enabled
    if (document.getElementById('autoAnswer').checked) {
        const delay = parseInt(document.getElementById('autoAnswerDelay').value) * 1000;
        autoAnswerTimeout = setTimeout(() => {
            acceptCall();
        }, delay);
    }
}

// Accept call
function acceptCall() {
    if (callState !== 'incoming') {
        return;
    }
    
    clearTimeout(autoAnswerTimeout);
    
    // Add swipe animation to accept button
    const acceptBtn = document.querySelector('.accept-btn');
    if (acceptBtn) {
        acceptBtn.classList.add('swiping');
    }
    
    // Wait for animation to complete before transitioning
    setTimeout(() => {
        // Stop ringtone and vibration when swipe completes
        stopRingtone();
        stopVibration();
        
        callState = 'active';
        
        // Transition to active call
        incomingCallScreen.style.display = 'none';
        activeCallScreen.style.display = 'flex';
        
        // Remove swiping class for next time
        if (acceptBtn) {
            acceptBtn.classList.remove('swiping');
        }
        
        // Start call timer
        startCallTimer();
        
        // Add 1 second delay before playing audio
        setTimeout(() => {
            // Play audio if uploaded
            if (audioFile && callAudio.src) {
                callAudio.play().catch(e => console.log('Audio play failed:', e));
                startWaveformAnimation();
            }
        }, 1000); // 1 second delay before audio starts
    }, 400); // Wait for swipe animation
}

// End call
function endCall() {
    if (callState !== 'active') {
        return;
    }
    
    callState = 'idle';
    
    // Stop everything
    stopCallTimer();
    stopRingtone();
    callAudio.pause();
    callAudio.currentTime = 0;
    stopWaveformAnimation();
    
    // Reset screens
    incomingCallScreen.style.display = 'flex';
    activeCallScreen.style.display = 'none';
}

// Auto hangup and show summary
function autoHangupAndShowSummary() {
    if (callState !== 'active') {
        return;
    }
    
    // Check if summary should be shown
    const showSummary = document.getElementById('showSummary').checked;
    
    if (showSummary) {
        // Get call duration
        const duration = document.getElementById('callDuration').textContent;
        
        callState = 'summary';
        
        // Stop everything
        stopCallTimer();
        callAudio.pause();
        callAudio.currentTime = 0;
        stopWaveformAnimation();
        
        // Hide active call, show summary
        activeCallScreen.style.display = 'none';
        document.getElementById('summaryScreen').style.display = 'flex';
        
        // Set date
        const now = new Date();
        document.getElementById('summaryDate').textContent = now.toLocaleDateString();
        
        // Generate and type summary
        generateAndTypeSummary(duration);
    } else {
        // Just end the call without showing summary
        endCall();
    }
}

// Generate and type summary with typing effect
function generateAndTypeSummary(duration) {
    const callerName = document.getElementById('inputCallerName').value;
    const callerNumber = document.getElementById('inputCallerNumber').value;
    
    // Check if custom summary text exists
    const customSummary = localStorage.getItem('customSummaryText');
    
    let summaryContent;
    if (customSummary && customSummary.trim() !== '') {
        // Use custom summary text if provided
        summaryContent = customSummary;
    } else {
        // Generate default summary text - shorter to fit in view
        summaryContent = `Meeting with ${callerName}
${callerNumber} • ${duration}

Summary:
Call handled by AI assistant. Customer inquiry resolved successfully.

Key Points:
• Customer verified
• Issue addressed
• Information provided
• Next steps confirmed

Action Items:
□ Send follow-up email
□ Update CRM notes
□ Schedule callback

Resolution: Successful
Satisfaction: High`;
    }
    
    // Display the summary immediately without typing effect
    const summaryElement = document.getElementById('summaryText');
    const cursor = document.getElementById('typingCursor');
    summaryElement.textContent = summaryContent;
    cursor.style.display = 'none';
}

// Save custom summary text
function saveSummaryText() {
    const summaryText = document.getElementById('customSummaryText').value;
    localStorage.setItem('customSummaryText', summaryText);
    
    // Show confirmation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = '#34c759';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Load saved summary text on page load
function loadSavedSummaryText() {
    const savedSummary = localStorage.getItem('customSummaryText');
    if (savedSummary) {
        document.getElementById('customSummaryText').value = savedSummary;
    }
}

// Removed typing effect function - no longer needed

// Reset for new call
function resetForNewCall() {
    // Hide summary screen
    document.getElementById('summaryScreen').style.display = 'none';
    
    // Reset to incoming call screen
    incomingCallScreen.style.display = 'flex';
    callState = 'idle';
    
    // Reset call duration
    document.getElementById('callDuration').textContent = '00:00';
}

// Reset simulator - just reload the page
function resetSimulator() {
    location.reload();
}

// Start call timer
function startCallTimer() {
    // Get initial duration from inputs
    const initialMinutes = parseInt(document.getElementById('initialMinutes').value) || 0;
    const initialSeconds = parseInt(document.getElementById('initialSeconds').value) || 0;
    const initialDurationMs = (initialMinutes * 60 + initialSeconds) * 1000;
    
    // Set start time adjusted by initial duration
    callStartTime = Date.now() - initialDurationMs;
    
    // Update duration immediately to show initial time
    updateCallDuration();
    
    // Start the interval
    callTimer = setInterval(updateCallDuration, 1000);
}

// Stop call timer
function stopCallTimer() {
    clearInterval(callTimer);
    callTimer = null;
    callStartTime = null;
    callDuration.textContent = '00:00';
}

// Update call duration
function updateCallDuration() {
    if (!callStartTime) return;
    
    const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    callDuration.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Initialize waveform visualization
function initializeWaveform() {
    // Initialize voice waveform for active call
    const voiceCanvas = document.getElementById('voiceWaveform');
    if (voiceCanvas) {
        const ctx = voiceCanvas.getContext('2d');
        voiceCanvas.width = 320;
        voiceCanvas.height = 60;
        drawStaticVoiceWaveform(ctx, voiceCanvas);
    }
}

// Draw static voice waveform - centered
function drawStaticVoiceWaveform(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const barWidth = 3;
    const barSpacing = 2;
    const barsPerSide = 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    // Draw center bar
    const height = 4;
    ctx.fillRect(centerX - barWidth/2, centerY - height/2, barWidth, height);
    
    // Draw side bars
    for (let i = 1; i <= barsPerSide; i++) {
        const y = centerY - height / 2;
        
        // Right side bars
        const rightX = centerX + (i * (barWidth + barSpacing)) - barSpacing/2;
        if (rightX < canvas.width) {
            ctx.fillRect(rightX, y, barWidth, height);
        }
        
        // Left side bars
        const leftX = centerX - (i * (barWidth + barSpacing)) - barWidth + barSpacing/2;
        if (leftX > 0) {
            ctx.fillRect(leftX, y, barWidth, height);
        }
    }
}

// Start waveform animation with audio sync
function startWaveformAnimation() {
    const voiceCanvas = document.getElementById('voiceWaveform');
    if (!voiceCanvas) return;
    
    const ctx = voiceCanvas.getContext('2d');
    
    // Initialize audio context and analyser if we have audio
    if (callAudio.src && !audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(callAudio);
            
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        } catch (e) {
            console.log('Audio context setup failed, falling back to visual animation');
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
        
        const centerX = voiceCanvas.width / 2;
        const centerY = voiceCanvas.height / 2;
        const barWidth = 3;
        const barSpacing = 2;
        const barsPerSide = 20; // Number of bars on each side of center
        
        if (analyser && dataArray) {
            // Use real audio data
            analyser.getByteFrequencyData(dataArray);
            
            // Draw center bar first - use lower frequency for better response
            // Average the first few frequency bins for more reliable center animation
            let centerAudioValue = 0;
            for (let j = 0; j < 5; j++) {
                centerAudioValue += dataArray[j] || 0;
            }
            centerAudioValue = centerAudioValue / 5;
            
            const centerHeight = Math.max(3, (centerAudioValue / 255) * 40);
            const centerOpacity = 0.4 + (centerAudioValue / 255) * 0.6;
            ctx.fillStyle = `rgba(255, 255, 255, ${centerOpacity})`;
            ctx.fillRect(centerX - barWidth/2, centerY - centerHeight/2, barWidth, centerHeight);
            
            // Draw bars from center outward
            for (let i = 1; i <= barsPerSide; i++) {
                // Map bar index to frequency data
                const dataIndex = Math.floor(i * dataArray.length / barsPerSide);
                const audioValue = dataArray[dataIndex] || 0;
                
                // Scale audio value to visual height
                const height = Math.max(3, (audioValue / 255) * 40);
                const y = centerY - height / 2;
                
                // Opacity based on intensity
                const opacity = 0.4 + (audioValue / 255) * 0.6;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                
                // Right side bars
                const rightX = centerX + (i * (barWidth + barSpacing)) - barSpacing/2;
                if (rightX < voiceCanvas.width) {
                    ctx.fillRect(rightX, y, barWidth, height);
                }
                
                // Left side bars
                const leftX = centerX - (i * (barWidth + barSpacing)) - barWidth + barSpacing/2;
                if (leftX > 0) {
                    ctx.fillRect(leftX, y, barWidth, height);
                }
            }
            
        } else {
            // Fallback animation when no audio - center-based
            // Generate random values for animation
            const randomValues = [];
            for (let i = 0; i <= barsPerSide; i++) {
                randomValues.push(Math.random());
            }
            
            // Draw center bar with animation
            const centerHeight = 3 + randomValues[0] * 10;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(centerX - barWidth/2, centerY - centerHeight/2, barWidth, centerHeight);
            
            // Draw side bars
            for (let i = 1; i <= barsPerSide; i++) {
                const height = 3 + randomValues[i] * 10;
                const y = centerY - height / 2;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                
                // Right side bars
                const rightX = centerX + (i * (barWidth + barSpacing)) - barSpacing/2;
                if (rightX < voiceCanvas.width) {
                    ctx.fillRect(rightX, y, barWidth, height);
                }
                
                // Left side bars (use same height for symmetry)
                const leftX = centerX - (i * (barWidth + barSpacing)) - barWidth + barSpacing/2;
                if (leftX > 0) {
                    ctx.fillRect(leftX, y, barWidth, height);
                }
            }
        }
        
        waveformAnimation = requestAnimationFrame(animate);
    }
    
    animate();
}

// Stop waveform animation
function stopWaveformAnimation() {
    if (waveformAnimation) {
        cancelAnimationFrame(waveformAnimation);
        waveformAnimation = null;
        
        // Clean up audio context
        if (audioContext) {
            audioContext.close();
            audioContext = null;
            analyser = null;
            source = null;
            dataArray = null;
        }
        
        initializeWaveform();
    }
}

// Load templates
function loadTemplate(type) {
    switch(type) {
        case 'support':
            document.getElementById('inputCallerName').value = 'Tech Support';
            document.getElementById('inputCallerNumber').value = '+1 (800) 555-1234';
            document.getElementById('inputCallerSubtext').value = 'Customer Service';
            break;
        case 'sales':
            document.getElementById('inputCallerName').value = 'Sales Team';
            document.getElementById('inputCallerNumber').value = '+1 (888) 123-4567';
            document.getElementById('inputCallerSubtext').value = 'Sales Department';
            break;
        case 'personal':
            document.getElementById('inputCallerName').value = 'Mom';
            document.getElementById('inputCallerNumber').value = '+1 (555) 987-6543';
            document.getElementById('inputCallerSubtext').value = 'Mobile';
            break;
    }
    updateCallerInfo();
}

// Handle button clicks from incoming call screen
document.addEventListener('DOMContentLoaded', () => {
    // Accept button
    const acceptBtn = document.querySelector('.accept-btn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptCall);
    }
    
    // Decline button
    const declineBtn = document.querySelector('.decline-btn');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            clearTimeout(autoAnswerTimeout);
            stopRingtone();
            stopVibration();
            callState = 'idle';
            // Could add decline animation here
        });
    }
    
    // Audio ended event
    callAudio.addEventListener('ended', () => {
        // Wait 3 seconds after audio ends, then auto-hangup and show summary
        if (callState === 'active') {
            setTimeout(() => {
                autoHangupAndShowSummary();
            }, 3000); // 3 seconds delay
        }
    });
});

// Ringtone functions
function startRingtone() {
    const ringtoneEnabled = document.getElementById('ringtoneEnabled').checked;
    if (ringtoneEnabled && !isRingtoneMuted) {
        ringtoneAudio.currentTime = 0;
        ringtoneAudio.play().catch(e => console.log('Ringtone play failed:', e));
    }
}

function stopRingtone() {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
}

function toggleRingtoneMute() {
    const muteButton = document.getElementById('muteRingtone');
    const muteIcon = muteButton.querySelector('i');
    
    isRingtoneMuted = !isRingtoneMuted;
    
    if (isRingtoneMuted) {
        muteButton.classList.add('muted');
        muteIcon.className = 'fas fa-volume-mute';
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute';
        stopRingtone();
    } else {
        muteButton.classList.remove('muted');
        muteIcon.className = 'fas fa-volume-up';
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i> Mute';
        // If call is incoming, restart ringtone
        if (callState === 'incoming') {
            startRingtone();
        }
    }
}

// Vibration functions
function startVibration() {
    const phoneScreen = document.querySelector('.phone-screen');
    if (phoneScreen) {
        phoneScreen.classList.add('vibrating');
    }
}

function stopVibration() {
    const phoneScreen = document.querySelector('.phone-screen');
    if (phoneScreen) {
        phoneScreen.classList.remove('vibrating');
    }
}