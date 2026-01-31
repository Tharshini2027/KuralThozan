// Chat functionality
class ChatManager {
    constructor() {
        this.currentChatUser = null;
        this.isRecording = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('sendMessageBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        document.getElementById('voiceRecordBtn').addEventListener('click', () => this.toggleRecording());
        document.getElementById('backToMessages').addEventListener('click', () => navigation.showPage('messagePage'));
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        
        if (text) {
            this.sendTextMessage(text);
            input.value = '';
            document.getElementById('sendMessageBtn').disabled = true;
        }
    }

    sendTextMessage(text) {
        if (!this.currentChatUser) return;

        if (!storage.chatConversations[this.currentChatUser]) {
            storage.chatConversations[this.currentChatUser] = [];
        }

        const timeString = this.getCurrentTime();
        
        storage.chatConversations[this.currentChatUser].push({
            type: 'sent',
            content: text,
            time: timeString
        });

        storage.saveAllData();
        this.renderChatMessages();

        // Simulate reply
        this.simulateReply();
    }

    renderChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        if (!this.currentChatUser || !storage.chatConversations[this.currentChatUser]) return;

        storage.chatConversations[this.currentChatUser].forEach(msg => {
            const messageElement = this.createMessageElement(msg);
            chatMessages.appendChild(messageElement);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    createMessageElement(msg) {
        // Create and return message HTML element
    }

    simulateReply() {
        // Simulate AI reply logic
    }

    toggleRecording() {
        // Voice recording logic
    }

    getCurrentTime() {
        const now = new Date();
        return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
}