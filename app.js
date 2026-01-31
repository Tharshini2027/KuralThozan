// Main application initialization
class App {
    constructor() {
        this.navigation = null;
        this.postsManager = null;
        this.chatManager = null;
        this.init();
    }

    init() {
        // Initialize all managers
        this.navigation = new NavigationManager();
        this.postsManager = new PostsManager();
        this.chatManager = new ChatManager();

        // Load initial data
        this.initializeData();
        
        console.log('Kural Thozhan app initialized!');
    }

    initializeData() {
        if (storage.posts.length === 0) {
            // Load sample data
            this.loadSampleData();
        }
        
        // Initial rendering
        this.postsManager.renderPosts();
        this.renderMessages();
        this.renderNotifications();
        this.updateBadges();
    }

    loadSampleData() {
        // Sample data loading logic
        // (Copy from your original initializeData function)
    }

    renderMessages() {
        // Messages rendering logic
    }

    renderNotifications() {
        // Notifications rendering logic
    }

    updateBadges() {
        // Badge update logic
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});