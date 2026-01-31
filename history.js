// DOM Elements
const entriesList = document.getElementById('entriesList');
const filterCategory = document.getElementById('filterCategory');
const filterDate = document.getElementById('filterDate');

// Tamil translations
const tamilText = {
    noEntries: "இன்னும் பதிவுகள் இல்லை. உங்கள் முதல் விவசாய குறிப்பைப் பதிவு செய்யவும்!",
    delete: "அழி",
    confirmDelete: "இந்த பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
    allCategories: "அனைத்து வகைகள்"
};

// Initialize the app
function init() {
    loadEntries();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    filterCategory.addEventListener('change', loadEntries);
    filterDate.addEventListener('change', loadEntries);
}

// Get entries from local storage
function getEntries() {
    const entriesJSON = localStorage.getItem('farmVoiceEntries');
    return entriesJSON ? JSON.parse(entriesJSON) : [];
}

// Load and display entries with filters
function loadEntries() {
    const entries = getEntries();
    const categoryFilter = filterCategory.value;
    const dateFilter = filterDate.value;
    
    // Filter entries
    let filteredEntries = entries;
    
    if (categoryFilter !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.category === categoryFilter);
    }
    
    if (dateFilter) {
        filteredEntries = filteredEntries.filter(entry => entry.date === dateFilter);
    }
    
    if (filteredEntries.length === 0) {
        entriesList.innerHTML = `<div class="no-entries tamil-text">${tamilText.noEntries}</div>`;
        return;
    }
    
    // Sort entries by date (newest first)
    filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML for entries
    entriesList.innerHTML = filteredEntries.map(entry => `
        <div class="entry-item">
            <div class="entry-header">
                <span class="entry-date">${formatDate(entry.date)}</span>
                <span class="entry-category tamil-text">${formatCategory(entry.category)}</span>
            </div>
            ${entry.notes ? `<div class="entry-notes tamil-text">${entry.notes}</div>` : ''}
            <audio class="entry-audio" controls src="${entry.audioData}"></audio>
            <button class="delete-btn tamil-text" onclick="deleteEntry('${entry.id}')">
                <span>🗑️</span> ${tamilText.delete}
            </button>
        </div>
    `).join('');
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ta-IN', options);
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

// Delete an entry
function deleteEntry(id) {
    if (confirm(tamilText.confirmDelete)) {
        const entries = getEntries();
        const filteredEntries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('farmVoiceEntries', JSON.stringify(filteredEntries));
        loadEntries();
    }
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', init);