// Data storage management
class StorageManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('kuralthozhan_posts')) || [];
        this.messages = JSON.parse(localStorage.getItem('kuralthozhan_messages')) || [];
        this.notifications = JSON.parse(localStorage.getItem('kuralthozhan_notifications')) || [];
        this.chatConversations = JSON.parse(localStorage.getItem('kuralthozhan_chats')) || {};
        this.currentUser = "விவசாயி";
    }

    saveAllData() {
        localStorage.setItem('kuralthozhan_posts', JSON.stringify(this.posts));
        localStorage.setItem('kuralthozhan_messages', JSON.stringify(this.messages));
        localStorage.setItem('kuralthozhan_notifications', JSON.stringify(this.notifications));
        localStorage.setItem('kuralthozhan_chats', JSON.stringify(this.chatConversations));
    }

    addPost(post) {
        this.posts.unshift(post);
        this.saveAllData();
    }

    addNotification(title, content) {
        const newNotification = {
            title: title,
            content: content,
            time: "இப்போது"
        };
        this.notifications.unshift(newNotification);
        this.saveAllData();
        return newNotification;
    }

    // Add more storage methods as needed...
}

const storage = new StorageManager();