// Social Media Platform JavaScript
class SocialMediaApp {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.posts = [];
        this.comments = [];
        this.notifications = [];
        this.followers = [];
        this.currentView = 'home';
        this.currentProfileUser = null;
        
        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.setupEventListeners();
        this.checkAuth();
        this.generateSampleData();
    }

    // Generate sample data for demonstration
    generateSampleData() {
        if (this.users.length === 0) {
            const sampleUsers = [
                {
                    id: this.generateId(),
                    name: 'John Doe',
                    username: 'johndoe',
                    email: 'john@example.com',
                    password: 'password123',
                    bio: 'Web developer passionate about creating amazing user experiences.',
                    location: 'San Francisco, CA',
                    avatar: 'JD',
                    followers: [],
                    following: [],
                    posts: [],
                    joinedAt: new Date('2023-01-15').toISOString()
                },
                {
                    id: this.generateId(),
                    name: 'Jane Smith',
                    username: 'janesmith',
                    email: 'jane@example.com',
                    password: 'password123',
                    bio: 'UI/UX Designer | Coffee enthusiast | Travel lover',
                    location: 'New York, NY',
                    avatar: 'JS',
                    followers: [],
                    following: [],
                    posts: [],
                    joinedAt: new Date('2023-02-20').toISOString()
                },
                {
                    id: this.generateId(),
                    name: 'Mike Johnson',
                    username: 'mikej',
                    email: 'mike@example.com',
                    password: 'password123',
                    bio: 'Full-stack developer | Tech blogger | Open source contributor',
                    location: 'Austin, TX',
                    avatar: 'MJ',
                    followers: [],
                    following: [],
                    posts: [],
                    joinedAt: new Date('2023-03-10').toISOString()
                }
            ];
            
            this.users = sampleUsers;
            this.saveDataToStorage();
        }
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Data persistence
    saveDataToStorage() {
        const data = {
            users: this.users,
            posts: this.posts,
            comments: this.comments,
            notifications: this.notifications,
            followers: this.followers,
            currentUser: this.currentUser
        };
        localStorage.setItem('socialMediaData', JSON.stringify(data));
    }

    loadDataFromStorage() {
        const savedData = localStorage.getItem('socialMediaData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.users = data.users || [];
            this.posts = data.posts || [];
            this.comments = data.comments || [];
            this.notifications = data.notifications || [];
            this.followers = data.followers || [];
            this.currentUser = data.currentUser || null;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Auth form listeners
        document.getElementById('loginTab').addEventListener('click', () => this.showLoginForm());
        document.getElementById('registerTab').addEventListener('click', () => this.showRegisterForm());
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Navigation listeners
        document.getElementById('homeBtn').addEventListener('click', () => this.showHomeFeed());
        document.getElementById('profileBtn').addEventListener('click', () => this.showProfile(this.currentUser.id));
        document.getElementById('notificationsBtn').addEventListener('click', () => this.showNotifications());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Post creation
        document.getElementById('createPostBtn').addEventListener('click', () => this.createPost());

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Modal close listeners
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Edit profile
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfileModal());
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));
    }

    // Authentication
    checkAuth() {
        if (this.currentUser) {
            this.showApp();
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        document.getElementById('authModal').style.display = 'block';
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
    }

    showApp() {
        document.getElementById('app').classList.remove('hidden');
        this.hideAuthModal();
        this.updateUserInterface();
        this.showHomeFeed();
    }

    showLoginForm() {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('registerTab').classList.remove('active');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    }

    showRegisterForm() {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveDataToStorage();
            this.showApp();
            this.showToast('Welcome back!', 'success');
        } else {
            this.showToast('Invalid credentials', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Check if user already exists
        if (this.users.find(u => u.email === email || u.username === username)) {
            this.showToast('User already exists', 'error');
            return;
        }

        const newUser = {
            id: this.generateId(),
            name,
            username,
            email,
            password,
            bio: '',
            location: '',
            avatar: name.charAt(0).toUpperCase(),
            followers: [],
            following: [],
            posts: [],
            joinedAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveDataToStorage();
        this.showApp();
        this.showToast('Account created successfully!', 'success');
    }

    logout() {
        this.currentUser = null;
        this.saveDataToStorage();
        document.getElementById('app').classList.add('hidden');
        this.showAuthModal();
        this.showToast('Logged out successfully', 'info');
    }

    // UI Updates
    updateUserInterface() {
        // Update sidebar user info
        document.getElementById('sidebarAvatar').textContent = this.currentUser.avatar;
        document.getElementById('sidebarName').textContent = this.currentUser.name;
        document.getElementById('sidebarUsername').textContent = `@${this.currentUser.username}`;
        
        // Update create post avatar
        document.getElementById('createPostAvatar').textContent = this.currentUser.avatar;
        
        // Update stats
        this.updateUserStats();
        
        // Load suggested users
        this.loadSuggestedUsers();
        
        // Load notifications
        this.updateNotificationCount();
    }

    updateUserStats() {
        const userPosts = this.posts.filter(p => p.authorId === this.currentUser.id);
        const userFollowers = this.followers.filter(f => f.followedId === this.currentUser.id);
        const userFollowing = this.followers.filter(f => f.followerId === this.currentUser.id);

        document.getElementById('sidebarPosts').textContent = userPosts.length;
        document.getElementById('sidebarFollowers').textContent = userFollowers.length;
        document.getElementById('sidebarFollowing').textContent = userFollowing.length;
    }

    // Navigation
    showHomeFeed() {
        this.currentView = 'home';
        this.setActiveNavButton('homeBtn');
        this.hideAllSections();
        document.getElementById('homeFeed').classList.remove('hidden');
        this.loadHomeFeed();
    }

    showProfile(userId) {
        this.currentView = 'profile';
        this.currentProfileUser = this.users.find(u => u.id === userId);
        this.setActiveNavButton('profileBtn');
        this.hideAllSections();
        document.getElementById('profileSection').classList.remove('hidden');
        this.loadProfile(userId);
    }

    showNotifications() {
        this.currentView = 'notifications';
        this.setActiveNavButton('notificationsBtn');
        this.hideAllSections();
        document.getElementById('notificationsSection').classList.remove('hidden');
        this.loadNotifications();
    }

    setActiveNavButton(activeId) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(activeId).classList.add('active');
    }

    hideAllSections() {
        document.querySelectorAll('.feed-section').forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Posts
    createPost() {
        const content = document.getElementById('postContent').value.trim();
        if (!content) {
            this.showToast('Please enter some content', 'error');
            return;
        }

        const newPost = {
            id: this.generateId(),
            authorId: this.currentUser.id,
            content: content,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            shares: 0
        };

        this.posts.unshift(newPost);
        this.currentUser.posts.push(newPost.id);
        this.saveDataToStorage();
        
        document.getElementById('postContent').value = '';
        this.loadHomeFeed();
        this.updateUserStats();
        this.showToast('Post created successfully!', 'success');
    }

    loadHomeFeed() {
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = '';

        // Get posts from followed users and own posts
        const followingIds = this.followers
            .filter(f => f.followerId === this.currentUser.id)
            .map(f => f.followedId);
        
        const relevantPosts = this.posts.filter(post => 
            followingIds.includes(post.authorId) || post.authorId === this.currentUser.id
        );

        if (relevantPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="text-center p-20">
                    <h3>No posts yet</h3>
                    <p class="text-muted">Follow some users to see their posts in your feed!</p>
                </div>
            `;
            return;
        }

        relevantPosts.forEach(post => {
            this.renderPost(post, postsContainer);
        });
    }

    loadProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // Update profile header
        document.getElementById('profileAvatar').textContent = user.avatar;
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileUsername').textContent = `@${user.username}`;
        document.getElementById('profileBio').textContent = user.bio || 'No bio available';

        // Show/hide edit profile or follow button
        if (user.id === this.currentUser.id) {
            document.getElementById('editProfileBtn').classList.remove('hidden');
            document.getElementById('followBtn').classList.add('hidden');
        } else {
            document.getElementById('editProfileBtn').classList.add('hidden');
            const followBtn = document.getElementById('followBtn');
            followBtn.classList.remove('hidden');
            
            const isFollowing = this.followers.some(f => 
                f.followerId === this.currentUser.id && f.followedId === user.id
            );
            
            followBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';
            followBtn.onclick = () => this.toggleFollow(user.id);
        }

        // Update profile stats
        const userPosts = this.posts.filter(p => p.authorId === user.id);
        const userFollowers = this.followers.filter(f => f.followedId === user.id);
        const userFollowing = this.followers.filter(f => f.followerId === user.id);

        document.getElementById('profilePosts').textContent = userPosts.length;
        document.getElementById('profileFollowers').textContent = userFollowers.length;
        document.getElementById('profileFollowing').textContent = userFollowing.length;

        // Load user's posts
        const profilePostsContainer = document.getElementById('profilePosts');
        profilePostsContainer.innerHTML = '';
        
        userPosts.forEach(post => {
            this.renderPost(post, profilePostsContainer);
        });
    }

    renderPost(post, container) {
        const author = this.users.find(u => u.id === post.authorId);
        if (!author) return;

        const timeAgo = this.getTimeAgo(post.createdAt);
        const isLiked = post.likes.includes(this.currentUser.id);
        const postComments = this.comments.filter(c => c.postId === post.id);

        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="user-avatar" onclick="socialApp.showProfile('${author.id}')">${author.avatar}</div>
                <div class="post-author">
                    <div class="author-name" onclick="socialApp.showProfile('${author.id}')">${author.name}</div>
                    <div class="author-username">@${author.username}</div>
                </div>
                <div class="post-time">${timeAgo}</div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <div class="post-action-group">
                    <button class="post-action ${isLiked ? 'liked' : ''}" onclick="socialApp.toggleLike('${post.id}')">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes.length}</span>
                    </button>
                    <button class="post-action" onclick="socialApp.showComments('${post.id}')">
                        <i class="fas fa-comment"></i>
                        <span>${postComments.length}</span>
                    </button>
                    <button class="post-action" onclick="socialApp.sharePost('${post.id}')">
                        <i class="fas fa-share"></i>
                        <span>${post.shares}</span>
                    </button>
                </div>
            </div>
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list"></div>
                <div class="comment-form">
                    <div class="user-avatar">${this.currentUser.avatar}</div>
                    <input type="text" class="comment-input" placeholder="Write a comment..." 
                           onkeypress="if(event.key==='Enter') socialApp.addComment('${post.id}', this.value)">
                    <button class="comment-submit" onclick="socialApp.addComment('${post.id}', this.previousElementSibling.value)">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(postElement);
    }

    // Post interactions
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const likeIndex = post.likes.indexOf(this.currentUser.id);
        if (likeIndex === -1) {
            post.likes.push(this.currentUser.id);
            this.addNotification(post.authorId, `${this.currentUser.name} liked your post`, 'like');
        } else {
            post.likes.splice(likeIndex, 1);
        }

        this.saveDataToStorage();
        this.refreshCurrentView();
    }

    showComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        const isVisible = commentsSection.style.display !== 'none';
        
        commentsSection.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.loadComments(postId);
        }
    }

    loadComments(postId) {
        const postComments = this.comments.filter(c => c.postId === postId);
        const commentsContainer = document.querySelector(`#comments-${postId} .comments-list`);
        
        commentsContainer.innerHTML = '';
        
        postComments.forEach(comment => {
            const author = this.users.find(u => u.id === comment.authorId);
            if (!author) return;

            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="user-avatar">${author.avatar}</div>
                <div class="comment-content">
                    <div class="comment-author">${author.name}</div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-time">${this.getTimeAgo(comment.createdAt)}</div>
                </div>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
    }

    addComment(postId, content) {
        if (!content.trim()) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const newComment = {
            id: this.generateId(),
            postId: postId,
            authorId: this.currentUser.id,
            content: content.trim(),
            createdAt: new Date().toISOString()
        };

        this.comments.push(newComment);
        post.comments.push(newComment.id);
        
        // Add notification
        if (post.authorId !== this.currentUser.id) {
            this.addNotification(post.authorId, `${this.currentUser.name} commented on your post`, 'comment');
        }

        this.saveDataToStorage();
        this.loadComments(postId);
        
        // Clear input
        const commentInput = document.querySelector(`#comments-${postId} .comment-input`);
        commentInput.value = '';
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        post.shares++;
        
        if (post.authorId !== this.currentUser.id) {
            this.addNotification(post.authorId, `${this.currentUser.name} shared your post`, 'share');
        }

        this.saveDataToStorage();
        this.refreshCurrentView();
        this.showToast('Post shared!', 'success');
    }

    // Follow system
    toggleFollow(userId) {
        const existingFollow = this.followers.find(f => 
            f.followerId === this.currentUser.id && f.followedId === userId
        );

        if (existingFollow) {
            // Unfollow
            this.followers = this.followers.filter(f => f.id !== existingFollow.id);
            this.showToast('Unfollowed successfully', 'info');
        } else {
            // Follow
            const newFollow = {
                id: this.generateId(),
                followerId: this.currentUser.id,
                followedId: userId,
                createdAt: new Date().toISOString()
            };
            this.followers.push(newFollow);
            
            this.addNotification(userId, `${this.currentUser.name} started following you`, 'follow');
            this.showToast('Following successfully', 'success');
        }

        this.saveDataToStorage();
        this.loadProfile(userId);
        this.updateUserStats();
    }

    // Notifications
    addNotification(userId, message, type) {
        const notification = {
            id: this.generateId(),
            userId: userId,
            message: message,
            type: type,
            read: false,
            createdAt: new Date().toISOString()
        };

        this.notifications.push(notification);
        this.saveDataToStorage();
        this.updateNotificationCount();
    }

    updateNotificationCount() {
        const unreadNotifications = this.notifications.filter(n => 
            n.userId === this.currentUser.id && !n.read
        );
        
        const badge = document.getElementById('notificationCount');
        if (unreadNotifications.length > 0) {
            badge.textContent = unreadNotifications.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    loadNotifications() {
        const userNotifications = this.notifications
            .filter(n => n.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const notificationsContainer = document.getElementById('notificationsList');
        notificationsContainer.innerHTML = '';

        if (userNotifications.length === 0) {
            notificationsContainer.innerHTML = `
                <div class="text-center p-20">
                    <h3>No notifications</h3>
                    <p class="text-muted">You're all caught up!</p>
                </div>
            `;
            return;
        }

        userNotifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item ${!notification.read ? 'unread' : ''}`;
            notificationElement.innerHTML = `
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                <div class="notification-content">
                    <div class="notification-text">${notification.message}</div>
                    <div class="notification-time">${this.getTimeAgo(notification.createdAt)}</div>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            `;

            notificationElement.addEventListener('click', () => {
                this.markNotificationAsRead(notification.id);
            });

            notificationsContainer.appendChild(notificationElement);
        });

        // Mark all as read after viewing
        setTimeout(() => {
            userNotifications.forEach(n => n.read = true);
            this.saveDataToStorage();
            this.updateNotificationCount();
        }, 2000);
    }

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveDataToStorage();
            this.updateNotificationCount();
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'like': 'heart',
            'comment': 'comment',
            'follow': 'user-plus',
            'share': 'share'
        };
        return icons[type] || 'bell';
    }

    // Search functionality
    handleSearch(query) {
        if (query.length < 2) return;

        const searchResults = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(searchResults);
    }

    displaySearchResults(results) {
        // For now, just log the results
        // In a real app, you would show a dropdown with results
        console.log('Search results:', results);
    }

    // Profile editing
    showEditProfileModal() {
        document.getElementById('editName').value = this.currentUser.name;
        document.getElementById('editUsername').value = this.currentUser.username;
        document.getElementById('editBio').value = this.currentUser.bio || '';
        document.getElementById('editLocation').value = this.currentUser.location || '';
        
        document.getElementById('editProfileModal').style.display = 'block';
    }

    handleEditProfile(e) {
        e.preventDefault();
        
        const name = document.getElementById('editName').value;
        const username = document.getElementById('editUsername').value;
        const bio = document.getElementById('editBio').value;
        const location = document.getElementById('editLocation').value;

        // Check if username is already taken by another user
        const existingUser = this.users.find(u => 
            u.username === username && u.id !== this.currentUser.id
        );

        if (existingUser) {
            this.showToast('Username already taken', 'error');
            return;
        }

        // Update user data
        this.currentUser.name = name;
        this.currentUser.username = username;
        this.currentUser.bio = bio;
        this.currentUser.location = location;
        this.currentUser.avatar = name.charAt(0).toUpperCase();

        // Update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser };
        }

        this.saveDataToStorage();
        document.getElementById('editProfileModal').style.display = 'none';
        this.updateUserInterface();
        this.loadProfile(this.currentUser.id);
        this.showToast('Profile updated successfully!', 'success');
    }

    // Suggested users
    loadSuggestedUsers() {
        const followingIds = this.followers
            .filter(f => f.followerId === this.currentUser.id)
            .map(f => f.followedId);

        const suggestedUsers = this.users
            .filter(user => 
                user.id !== this.currentUser.id && 
                !followingIds.includes(user.id)
            )
            .slice(0, 3);

        const suggestedContainer = document.getElementById('suggestedUsers');
        suggestedContainer.innerHTML = '';

        suggestedUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'suggestion-user';
            userElement.innerHTML = `
                <div class="user-avatar">${user.avatar}</div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${user.name}</div>
                    <div class="suggestion-username">@${user.username}</div>
                </div>
                <button class="follow-btn" onclick="socialApp.toggleFollow('${user.id}')">Follow</button>
            `;

            userElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('follow-btn')) {
                    this.showProfile(user.id);
                }
            });

            suggestedContainer.appendChild(userElement);
        });
    }

    // Activity feed (right sidebar)
    loadActivityFeed() {
        const activityContainer = document.getElementById('activityFeed');
        const recentPosts = this.posts.slice(0, 5);

        activityContainer.innerHTML = '';

        recentPosts.forEach(post => {
            const author = this.users.find(u => u.id === post.authorId);
            if (!author) return;

            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <div class="user-avatar">${author.avatar}</div>
                <div class="activity-info">
                    <div class="activity-text">${author.name} posted something</div>
                    <div class="activity-time">${this.getTimeAgo(post.createdAt)}</div>
                </div>
            `;

            activityContainer.appendChild(activityElement);
        });
    }

    // Online users (simulated)
    loadOnlineUsers() {
        const onlineContainer = document.getElementById('onlineUsersList');
        const onlineUsers = this.users
            .filter(u => u.id !== this.currentUser.id)
            .slice(0, 4);

        onlineContainer.innerHTML = '';

        onlineUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'online-user';
            userElement.innerHTML = `
                <div class="user-avatar">
                    ${user.avatar}
                    <div class="online-indicator"></div>
                </div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${user.name}</div>
                    <div class="suggestion-username">@${user.username}</div>
                </div>
            `;

            userElement.addEventListener('click', () => {
                this.showProfile(user.id);
            });

            onlineContainer.appendChild(userElement);
        });
    }

    // Utility functions
    refreshCurrentView() {
        switch(this.currentView) {
            case 'home':
                this.loadHomeFeed();
                break;
            case 'profile':
                this.loadProfile(this.currentProfileUser.id);
                break;
            case 'notifications':
                this.loadNotifications();
                break;
        }
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        
        return date.toLocaleDateString();
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div>${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the app
const socialApp = new SocialMediaApp();

// Additional event listeners for window events
window.addEventListener('load', () => {
    // Load activity feed and online users after app initialization
    setTimeout(() => {
        if (socialApp.currentUser) {
            socialApp.loadActivityFeed();
            socialApp.loadOnlineUsers();
        }
    }, 1000);
});

// Handle modal clicks outside content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'postContent') {
            socialApp.createPost();
        }
    }
});

// Auto-refresh feed every 30 seconds (simulating real-time updates)
setInterval(() => {
    if (socialApp.currentUser && socialApp.currentView === 'home') {
        socialApp.loadHomeFeed();
    }
}, 30000);