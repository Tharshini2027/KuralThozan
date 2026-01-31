// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const recordIcon = document.getElementById('recordIcon');
const recordText = document.getElementById('recordText');
const timer = document.getElementById('timer');
const audioPlayer = document.getElementById('audioPlayer');
const entryForm = document.getElementById('entryForm');
const entryDate = document.getElementById('entryDate');
const entryCategory = document.getElementById('entryCategory');
const entryNotes = document.getElementById('entryNotes');
const saveBtn = document.getElementById('saveBtn');

// Set today's date as default
const today = new Date().toISOString().split('T')[0];
entryDate.value = today;

// Variables for recording
let mediaRecorder;
let audioChunks = [];
let recording = false;
let startTime;
let timerInterval;
let currentAudioBlob = null;

// Tamil translations
const tamilText = {
    recording: "பதிவு நடக்கிறது",
    startRecording: "பதிவைத் தொடங்கு",
    stopRecording: "பதிவை நிறுத்து",
    saveEntry: "பதிவைச் சேமிக்கவும்",
    noEntries: "இன்னும் பதிவுகள் இல்லை. உங்கள் முதல் விவசாய குறிப்பைப் பதிவு செய்யவும்!",
    delete: "அழி",
    confirmDelete: "இந்த பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
    entrySaved: "பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது!",
    recordingError: "மைக்ரோஃபோனை அணுகுவதில் பிழை. உங்கள் அனுமதிகளைச் சரிபார்க்கவும் மீண்டும் முயற்சிக்கவும்.",
    noAudioError: "முதலில் ஒரு குரல் குறிப்பைப் பதிவு செய்யவும்."
};

// Check for browser support
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("உங்கள் உலாவி ஆடியோ பதிவை ஆதரிக்காது. Chrome, Firefox, அல்லது Edge போன்ற நவீன உலாவியை முயற்சிக்கவும்.");
}

// Initialize the app
function init() {
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    recordBtn.addEventListener('click', toggleRecording);
    entryForm.addEventListener('submit', saveEntry);
}

// Toggle recording state
function toggleRecording() {
    if (!recording) {
        startRecording();
    } else {
        stopRecording();
    }
}

// Start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            currentAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(currentAudioBlob);
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = 'block';
            
            // Enable save button
            saveBtn.disabled = false;
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        recording = true;
        recordBtn.classList.add('recording');
        recordIcon.textContent = '⏹️';
        recordText.textContent = tamilText.stopRecording;
        
        // Start timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        
    } catch (error) {
        console.error('Error starting recording:', error);
        alert(tamilText.recordingError);
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && recording) {
        mediaRecorder.stop();
        recording = false;
        recordBtn.classList.remove('recording');
        recordIcon.textContent = '🎤';
        recordText.textContent = tamilText.startRecording;
        
        // Stop timer
        clearInterval(timerInterval);
    }
}

// Update timer display
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
}

// Save entry to local storage
function saveEntry(e) {
    e.preventDefault();
    
    if (!currentAudioBlob) {
        alert(tamilText.noAudioError);
        return;
    }
    
    // Create entry object
    const entry = {
        id: Date.now().toString(),
        date: entryDate.value,
        category: entryCategory.value,
        notes: entryNotes.value,
        audioBlob: currentAudioBlob,
        timestamp: new Date().toISOString()
    };
    
    // Convert blob to base64 for storage
    const reader = new FileReader();
    reader.onload = function() {
        entry.audioData = reader.result;
        
        // Save to local storage
        const entries = getEntries();
        entries.push(entry);
        localStorage.setItem('farmVoiceEntries', JSON.stringify(entries));
        
        // Reset form
        resetForm();
        alert(tamilText.entrySaved);
    };
    reader.readAsDataURL(currentAudioBlob);
}

// Get entries from local storage
function getEntries() {
    const entriesJSON = localStorage.getItem('farmVoiceEntries');
    return entriesJSON ? JSON.parse(entriesJSON) : [];
}

// Reset form after saving
function resetForm() {
    entryForm.reset();
    entryDate.value = today;
    audioPlayer.style.display = 'none';
    saveBtn.disabled = true;
    timer.textContent = '00:00';
    audioChunks = [];
    currentAudioBlob = null;
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'planting': 'நடவு',
        'harvesting': 'அறுவடை',
        'irrigation': 'பாசனம்',
        'fertilizer': 'உரம்',
        'pest-control': 'பூச்சி மற்றும் நோய் கட்டுப்பாடு',
        'weather': 'வானிலை',
        'livestock': 'கால்நடை',
        'equipment': 'கருவிகள்',
        'other': 'மற்றவை'
    };
    return categoryMap[category] || category;
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', init);