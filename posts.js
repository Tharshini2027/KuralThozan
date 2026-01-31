// Posts management
class PostsManager {
    constructor() {
        this.postsContainer = document.getElementById('postsContainer');
        this.postForm = document.getElementById('postForm');
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPosts();
    }

    bindEvents() {
        this.postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        
        // Image and video preview events
        document.getElementById('postImage').addEventListener('change', this.handleImagePreview);
        document.getElementById('postVideo').addEventListener('change', this.handleVideoPreview);
    }

    handlePostSubmit(e) {
        e.preventDefault();
        const content = document.getElementById('postContent').value.trim();
        const imageFile = document.getElementById('postImage').files[0];
        const videoFile = document.getElementById('postVideo').files[0];

        if (content || imageFile || videoFile) {
            this.createPost(content, imageFile, videoFile);
        } else {
            alert("பதிவு உள்ளடக்கம், படம் அல்லது வீடியோவை சேர்க்கவும்!");
        }
    }

    createPost(content, imageFile, videoFile) {
        const postId = Date.now();
        const newPost = {
            id: postId,
            name: storage.currentUser,
            content: content,
            time: "இப்போது",
            liked: false,
            likes: 0,
            comments: [],
            image: null,
            video: null
        };

        // Handle media files
        if (imageFile) {
            this.readFileAsDataURL(imageFile, (result) => {
                newPost.image = result;
                this.finalizePost(newPost);
            });
        } else if (videoFile) {
            this.readFileAsDataURL(videoFile, (result) => {
                newPost.video = result;
                newPost.videoType = videoFile.type;
                this.finalizePost(newPost);
            });
        } else {
            this.finalizePost(newPost);
        }
    }

    finalizePost(newPost) {
        storage.addPost(newPost);
        storage.addNotification("புதிய பதிவு", `${newPost.name} ஒரு புதிய பதிவை உருவாக்கியுள்ளார்`);
        this.renderPosts();
        this.postForm.reset();
        this.clearPreviews();
        navigation.showPage('homePage');
    }

    renderPosts() {
        this.postsContainer.innerHTML = '';
        storage.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.postsContainer.appendChild(postElement);
            this.addPostInteractivity(post.id);
        });
    }

    createPostElement(post) {
        // Create and return post HTML element
        // (Copy the post creation logic from your original code)
    }

    addPostInteractivity(postId) {
        // Add like, comment, message functionality
        // (Copy the interactivity logic from your original code)
    }

    // Helper methods for file reading and previews
    readFileAsDataURL(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => callback(e.target.result);
        reader.readAsDataURL(file);
    }

    handleImagePreview(e) {
        // Image preview logic
    }

    handleVideoPreview(e) {
        // Video preview logic
    }

    clearPreviews() {
        // Clear preview containers
    }
}