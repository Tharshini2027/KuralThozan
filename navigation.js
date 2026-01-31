// Navigation management
class NavigationManager {
    constructor() {
        this.pages = {
            homePage: document.getElementById('homePage'),
            postPage: document.getElementById('postPage'),
            messagePage: document.getElementById('messagePage'),
            notificationPage: document.getElementById('notificationPage'),
            profilePage: document.getElementById('profilePage'),
            chatPage: document.getElementById('chatPage')
        };
        
        this.navItems = {
            homeNav: document.getElementById('homeNav'),
            postNav: document.getElementById('postNav'),
            notificationNav: document.getElementById('notificationNav'),
            messageNav: document.getElementById('messageNav'),
            profileNav: document.getElementById('profileNav')
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Bind navigation clicks
        Object.keys(this.navItems).forEach(navKey => {
            this.navItems[navKey].addEventListener('click', () => {
                const pageKey = navKey.replace('Nav', 'Page');
                this.showPage(pageKey);
            });
        });
    }

    showPage(pageKey) {
        // Hide all pages
        Object.values(this.pages).forEach(page => page.classList.add('hidden'));
        
        // Show target page
        if (this.pages[pageKey]) {
            this.pages[pageKey].classList.remove('hidden');
        }

        // Update active nav
        this.updateActiveNav(pageKey);
    }

    updateActiveNav(pageKey) {
        Object.values(this.navItems).forEach(nav => nav.classList.remove('active'));
        
        const navKey = pageKey.replace('Page', 'Nav');
        if (this.navItems[navKey]) {
            this.navItems[navKey].classList.add('active');
        }
    }
}