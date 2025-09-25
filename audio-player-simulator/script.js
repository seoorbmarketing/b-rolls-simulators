// Audio Player State
let currentAudio = null;
let isPlaying = false;
let currentTrackId = null;
let playlist = ['terminator', 'taxi', 'casablanca', 'starwars', 'scarface']; // Only first 5 tracks are playable
let currentIndex = 0;
let uploadedAudios = {}; // Store uploaded audio files

// Audio tracks data
const tracks = {
    terminator: {
        name: 'T-800',
        description: "I'll be back... A menacing robotic voice with metallic undertones",
        duration: '0:45'
    },
    taxi: {
        name: 'Taxi Driver',
        description: 'You talkin\' to me? Gritty New York accent with edge',
        duration: '0:38'
    },
    casablanca: {
        name: 'Casablanca',
        description: 'Here\'s looking at you, kid. Classic 1940s smooth narrator',
        duration: '0:42'
    },
    starwars: {
        name: 'Yoda',
        description: 'May the Force be with you. Epic space opera narration',
        duration: '0:50'
    },
    scarface: {
        name: 'Al Pacino',
        description: 'Say hello to my little friend! Cuban-American accent with intensity',
        duration: '0:35'
    },
    godfather: {
        name: 'Godfather style',
        description: "I'm gonna make him an offer he can't refuse",
        duration: '0:48'
    },
    bond: {
        name: 'James Bond style',
        description: "The name's Bond. James Bond.",
        duration: '0:40'
    }
};

// Get audio player element
const audioPlayer = document.getElementById('audioPlayer');

// Toggle play/pause for specific track
function togglePlay(trackId) {
    // Check if track is playable (first 5 only)
    if (!playlist.includes(trackId)) {
        alert('This is a demo track. Only the first 5 tracks are playable.');
        return;
    }

    const card = document.querySelector(`[data-audio="${trackId}"]`);
    const playBtn = card.querySelector('.play-btn');
    const icon = playBtn.querySelector('i');

    if (currentTrackId === trackId && isPlaying) {
        // Pause current track
        pauseAudio();
    } else {
        // Stop any currently playing track
        if (currentTrackId) {
            stopCurrentTrack();
        }
        // Play new track
        playTrack(trackId);
    }
}

// Play specific track
function playTrack(trackId) {
    // Check if track is in the playable list (first 5 only)
    if (!playlist.includes(trackId)) {
        // Show message for demo tracks
        alert('This is a demo track. Only the first 5 tracks are playable.');
        return;
    }

    // Update current track info
    currentTrackId = trackId;
    currentIndex = playlist.indexOf(trackId);

    // Update UI
    const card = document.querySelector(`[data-audio="${trackId}"]`);
    card.classList.add('playing');
    const playBtn = card.querySelector('.play-btn');
    playBtn.classList.add('playing');
    const icon = playBtn.querySelector('i');
    icon.className = 'fas fa-pause';

    // Update now playing section
    updateNowPlaying(trackId);

    // Update play/pause button in control panel
    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.className = 'fas fa-pause';

    // Check if there's an uploaded audio for this track
    if (uploadedAudios[trackId]) {
        playUploadedAudio(trackId);
    } else {
        // Simulate audio playing
        isPlaying = true;
        simulateProgress();
    }
}

// Pause audio
function pauseAudio() {
    isPlaying = false;

    // Pause uploaded audio if playing
    const player = document.getElementById('audioPlayer');
    if (!player.paused) {
        player.pause();
    }

    if (currentTrackId) {
        const card = document.querySelector(`[data-audio="${currentTrackId}"]`);
        const playBtn = card.querySelector('.play-btn');
        const icon = playBtn.querySelector('i');
        icon.className = 'fas fa-play';
        playBtn.classList.remove('playing');
    }

    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.className = 'fas fa-play';
}

// Stop current track
function stopCurrentTrack() {
    // Stop uploaded audio if playing
    const player = document.getElementById('audioPlayer');
    if (!player.paused) {
        player.pause();
        player.currentTime = 0;
    }

    if (currentTrackId) {
        const card = document.querySelector(`[data-audio="${currentTrackId}"]`);
        card.classList.remove('playing');
        const playBtn = card.querySelector('.play-btn');
        playBtn.classList.remove('playing');
        const icon = playBtn.querySelector('i');
        icon.className = 'fas fa-play';
    }
    isPlaying = false;
}

// Update now playing section
function updateNowPlaying(trackId) {
    const track = tracks[trackId];
    document.getElementById('currentTrack').textContent = track.name + ' - ' + track.description;
    document.getElementById('duration').textContent = track.duration;
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('progressFill').style.width = '0%';
}

// Simulate progress bar
let progressInterval;
let progress = 0;

function simulateProgress() {
    clearInterval(progressInterval);
    progress = 0;

    progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }

        progress += 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Check if autoplay is enabled
            if (document.getElementById('autoplay').checked) {
                // Check if this is the last track
                if (currentIndex >= playlist.length - 1) {
                    // Last track, stop everything
                    stopCurrentTrack();
                    isPlaying = false;
                    currentIndex = 0;
                    document.getElementById('autoplay').checked = false;
                } else {
                    setTimeout(() => {
                        nextTrack();
                    }, 500);
                }
            } else {
                stopCurrentTrack();
                isPlaying = false;
            }
        }

        document.getElementById('progressFill').style.width = progress + '%';

        // Update time
        if (currentTrackId) {
            const duration = parseInt(tracks[currentTrackId].duration.split(':')[1]);
            const currentSeconds = Math.floor((progress / 100) * duration);
            document.getElementById('currentTime').textContent = '0:' + currentSeconds.toString().padStart(2, '0');
        }
    }, 500);
}

// Control panel functions
function playPause() {
    if (isPlaying) {
        pauseAudio();
    } else if (currentTrackId) {
        playTrack(currentTrackId);
    } else {
        // Play first track if nothing selected
        playTrack(playlist[0]);
    }
}

function nextTrack() {
    // First stop and clear current track UI properly
    if (currentTrackId) {
        const card = document.querySelector(`[data-audio="${currentTrackId}"]`);
        if (card) {
            card.classList.remove('playing');
            const playBtn = card.querySelector('.play-btn');
            if (playBtn) {
                playBtn.classList.remove('playing');
                const icon = playBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-play';
                }
            }
        }
    }

    if (document.getElementById('shuffle').checked) {
        // Random track
        currentIndex = Math.floor(Math.random() * playlist.length);
        playTrack(playlist[currentIndex]);
    } else {
        // Sequential playback
        currentIndex = currentIndex + 1;

        // Check if we've reached the end of the playlist
        if (currentIndex >= playlist.length) {
            // Stop playback - all tracks have been played
            stopAll();
            currentIndex = 0;
            document.getElementById('autoplay').checked = false;
            return;
        }

        // Play next track
        playTrack(playlist[currentIndex]);
    }
}

function previousTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    stopCurrentTrack();
    playTrack(playlist[currentIndex]);
}

// Play specific track from control panel
function playSpecific(trackId) {
    // Check if track is playable (first 5 only)
    if (!playlist.includes(trackId)) {
        alert('This is a demo track. Only the first 5 tracks are playable.');
        return;
    }
    stopCurrentTrack();
    playTrack(trackId);
}

// Play all tracks
function playAll() {
    stopCurrentTrack();
    currentIndex = 0;
    document.getElementById('autoplay').checked = true;
    document.getElementById('loop').checked = false;
    document.getElementById('shuffle').checked = false;

    // Play first track (playlist already contains only first 5)
    playTrack(playlist[0]);
}

// Stop all
function stopAll() {
    stopCurrentTrack();
    clearInterval(progressInterval);
    document.getElementById('currentTrack').textContent = 'No track selected';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
    currentTrackId = null;
    isPlaying = false;

    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.className = 'fas fa-play';
}

// Reset player
function resetPlayer() {
    stopAll();
    document.getElementById('autoplay').checked = true;
    document.getElementById('loop').checked = false;
    document.getElementById('shuffle').checked = false;
    document.getElementById('volumeSlider').value = 50;
    document.getElementById('volumeValue').textContent = '50%';
}

// Volume control
document.getElementById('volumeSlider').addEventListener('input', function() {
    document.getElementById('volumeValue').textContent = this.value + '%';
});

// Loop functionality
document.getElementById('loop').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('autoplay').checked = false;
    }
});

// Handle loop in progress simulation
setInterval(() => {
    if (isPlaying && progress >= 100 && document.getElementById('loop').checked) {
        progress = 0;
        simulateProgress();
    }
}, 100);

// Search functionality
document.querySelector('.search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.audio-card');

    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Store event listeners to prevent duplicates
let timeUpdateHandler = null;
let endedHandler = null;

// Play uploaded audio
function playUploadedAudio(trackId) {
    const audio = uploadedAudios[trackId];
    const player = document.getElementById('audioPlayer');

    // Remove previous event listeners if they exist
    if (timeUpdateHandler) {
        player.removeEventListener('timeupdate', timeUpdateHandler);
    }
    if (endedHandler) {
        player.removeEventListener('ended', endedHandler);
    }

    player.src = audio.url;
    player.volume = document.getElementById('volumeSlider').value / 100;
    player.play();
    isPlaying = true;

    // Create new timeupdate handler
    timeUpdateHandler = function() {
        if (player.duration) {
            const progress = (player.currentTime / player.duration) * 100;
            document.getElementById('progressFill').style.width = progress + '%';

            // Update current time
            const currentMinutes = Math.floor(player.currentTime / 60);
            const currentSeconds = Math.floor(player.currentTime % 60);
            document.getElementById('currentTime').textContent =
                `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;

            // Update duration
            const durationMinutes = Math.floor(player.duration / 60);
            const durationSeconds = Math.floor(player.duration % 60);
            document.getElementById('duration').textContent =
                `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        }
    };

    // Create new ended handler
    endedHandler = function() {
        if (document.getElementById('loop').checked) {
            // Loop current track
            player.currentTime = 0;
            player.play();
        } else if (document.getElementById('autoplay').checked) {
            // Check if this is the last track
            if (currentIndex >= playlist.length - 1 && !document.getElementById('shuffle').checked) {
                // This is the last track, stop everything
                setTimeout(() => {
                    stopAll();
                    currentIndex = 0;
                    document.getElementById('autoplay').checked = false;
                }, 500);
            } else {
                // Move to next track with small delay
                setTimeout(() => {
                    nextTrack();
                }, 500);
            }
        } else {
            stopCurrentTrack();
            isPlaying = false;
        }
    };

    // Add event listeners
    player.addEventListener('timeupdate', timeUpdateHandler);
    player.addEventListener('ended', endedHandler);
}

// Upload audio file
function uploadAudio(trackId, input) {
    const file = input.files[0];
    if (file && file.type.startsWith('audio/')) {
        // Convert file to base64 for localStorage
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Audio = e.target.result;

            // Store in uploadedAudios
            const url = URL.createObjectURL(file);
            uploadedAudios[trackId] = {
                url: url,
                file: file,
                name: file.name,
                base64: base64Audio
            };

            // Save to localStorage
            saveAudioToStorage(trackId, base64Audio, file.name);

            // Update status
            const status = document.getElementById(`status-${trackId}`);
            status.textContent = '✓';
            status.classList.remove('error');

            // Update track duration if possible
            const tempAudio = new Audio(url);
            tempAudio.addEventListener('loadedmetadata', function() {
                const minutes = Math.floor(tempAudio.duration / 60);
                const seconds = Math.floor(tempAudio.duration % 60);
                tracks[trackId].duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                // Save duration to localStorage
                const savedAudios = JSON.parse(localStorage.getItem('uploadedAudios') || '{}');
                if (savedAudios[trackId]) {
                    savedAudios[trackId].duration = tracks[trackId].duration;
                    localStorage.setItem('uploadedAudios', JSON.stringify(savedAudios));
                }
            });
        };
        reader.readAsDataURL(file);
    } else {
        const status = document.getElementById(`status-${trackId}`);
        status.textContent = '✗';
        status.classList.add('error');
    }
}

// Save audio to localStorage
function saveAudioToStorage(trackId, base64Audio, fileName) {
    const savedAudios = JSON.parse(localStorage.getItem('uploadedAudios') || '{}');
    savedAudios[trackId] = {
        base64: base64Audio,
        name: fileName,
        timestamp: Date.now()
    };
    localStorage.setItem('uploadedAudios', JSON.stringify(savedAudios));
}

// Load saved audio from localStorage
function loadSavedAudios() {
    const savedAudios = JSON.parse(localStorage.getItem('uploadedAudios') || '{}');

    for (const trackId in savedAudios) {
        if (savedAudios[trackId] && savedAudios[trackId].base64) {
            // Convert base64 back to blob
            fetch(savedAudios[trackId].base64)
                .then(res => res.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    uploadedAudios[trackId] = {
                        url: url,
                        file: null,
                        name: savedAudios[trackId].name,
                        base64: savedAudios[trackId].base64
                    };

                    // Update status
                    const status = document.getElementById(`status-${trackId}`);
                    if (status) {
                        status.textContent = '✓';
                        status.classList.remove('error');
                    }

                    // Update duration if saved
                    if (savedAudios[trackId].duration) {
                        tracks[trackId].duration = savedAudios[trackId].duration;
                    }
                });
        }
    }
}

// Clear all uploaded audio
function clearAllAudio() {
    // Stop current playback
    const player = document.getElementById('audioPlayer');
    player.pause();
    player.src = '';

    // Clear all uploaded files
    for (let trackId in uploadedAudios) {
        if (uploadedAudios[trackId].url) {
            URL.revokeObjectURL(uploadedAudios[trackId].url);
        }
        const status = document.getElementById(`status-${trackId}`);
        if (status) {
            status.textContent = '';
            status.classList.remove('error');
        }
    }
    uploadedAudios = {};

    // Clear from localStorage
    localStorage.removeItem('uploadedAudios');

    // Reset durations
    tracks.terminator.duration = '0:45';
    tracks.taxi.duration = '0:38';
    tracks.casablanca.duration = '0:42';
    tracks.starwars.duration = '0:50';
    tracks.scarface.duration = '0:35';

    // Stop any current playback
    if (isPlaying) {
        stopAll();
    }
}

// Update card name
function updateCardName(trackId, newName) {
    if (newName && newName.trim()) {
        // Update the track data
        tracks[trackId].name = newName.trim();

        // Save custom names to localStorage
        saveCustomNames();

        // Update the card title in the UI
        const card = document.querySelector(`[data-audio="${trackId}"]`);
        if (card) {
            const titleElement = card.querySelector('.card-title');
            if (titleElement) {
                titleElement.textContent = newName.trim();
            }
        }

        // Update the quick play button text
        const quickPlayButtons = document.querySelectorAll('.quick-play-btn');
        quickPlayButtons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(`'${trackId}'`)) {
                const text = btn.childNodes[1];
                if (text && text.nodeType === 3) {
                    text.textContent = ' ' + newName.trim().replace(' style', '');
                }
            }
        });

        // Update now playing if this track is currently playing
        if (currentTrackId === trackId) {
            updateNowPlaying(trackId);
        }
    }
}

// Save custom names to localStorage
function saveCustomNames() {
    const customNames = {};
    for (const trackId in tracks) {
        customNames[trackId] = tracks[trackId].name;
    }
    localStorage.setItem('customTrackNames', JSON.stringify(customNames));
}

// Load custom names from localStorage
function loadCustomNames() {
    const customNames = JSON.parse(localStorage.getItem('customTrackNames') || '{}');

    for (const trackId in customNames) {
        if (tracks[trackId]) {
            tracks[trackId].name = customNames[trackId];

            // Update UI
            const card = document.querySelector(`[data-audio="${trackId}"]`);
            if (card) {
                const titleElement = card.querySelector('.card-title');
                if (titleElement) {
                    titleElement.textContent = customNames[trackId];
                }
            }

            // Update quick play buttons
            const quickPlayButtons = document.querySelectorAll('.quick-play-btn');
            quickPlayButtons.forEach(btn => {
                if (btn.onclick && btn.onclick.toString().includes(`'${trackId}'`)) {
                    const text = btn.childNodes[1];
                    if (text && text.nodeType === 3) {
                        text.textContent = ' ' + customNames[trackId].replace(' style', '');
                    }
                }
            });

            // Update input placeholder
            const nameInput = document.getElementById(`name-${trackId}`);
            if (nameInput) {
                nameInput.value = '';
            }
        }
    }
}

// Reset all names to default
function resetAllNames() {
    // Reset track names
    tracks.terminator.name = 'T-800';
    tracks.taxi.name = 'Taxi Driver';
    tracks.casablanca.name = 'Casablanca';
    tracks.starwars.name = 'Yoda';
    tracks.scarface.name = 'Al Pacino';
    tracks.godfather.name = 'Godfather style';
    tracks.bond.name = 'James Bond style';

    // Clear custom names from localStorage
    localStorage.removeItem('customTrackNames');

    // Clear input fields
    document.getElementById('name-terminator').value = '';
    document.getElementById('name-taxi').value = '';
    document.getElementById('name-casablanca').value = '';
    document.getElementById('name-starwars').value = '';
    document.getElementById('name-scarface').value = '';
    document.getElementById('name-godfather').value = '';
    document.getElementById('name-bond').value = '';

    // Update all card titles
    const cards = [
        {id: 'terminator', name: 'T-800', btnText: 'T-800'},
        {id: 'taxi', name: 'Taxi Driver', btnText: 'Taxi Driver'},
        {id: 'casablanca', name: 'Casablanca', btnText: 'Casablanca'},
        {id: 'starwars', name: 'Yoda', btnText: 'Yoda'},
        {id: 'scarface', name: 'Al Pacino', btnText: 'Al Pacino'},
        {id: 'godfather', name: 'Godfather style', btnText: 'Godfather'},
        {id: 'bond', name: 'James Bond style', btnText: 'Bond'}
    ];

    cards.forEach(cardData => {
        const card = document.querySelector(`[data-audio="${cardData.id}"]`);
        if (card) {
            const titleElement = card.querySelector('.card-title');
            if (titleElement) {
                titleElement.textContent = cardData.name;
            }
        }

        // Update quick play button
        const quickPlayButtons = document.querySelectorAll('.quick-play-btn');
        quickPlayButtons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(`'${cardData.id}'`)) {
                const text = btn.childNodes[1];
                if (text && text.nodeType === 3) {
                    text.textContent = ' ' + cardData.btnText;
                }
            }
        });
    });

    // Update now playing if needed
    if (currentTrackId) {
        updateNowPlaying(currentTrackId);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial volume
    document.getElementById('volumeValue').textContent = '50%';

    // Handle volume changes for uploaded audio
    document.getElementById('volumeSlider').addEventListener('input', function() {
        const player = document.getElementById('audioPlayer');
        player.volume = this.value / 100;
    });

    // Load saved audio files from localStorage
    loadSavedAudios();

    // Load custom names from localStorage
    loadCustomNames();
});