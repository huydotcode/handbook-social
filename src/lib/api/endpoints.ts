/**
 * API Endpoints Constants
 * Centralized endpoint definitions for all API routes
 */

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
        RESET_PASSWORD: '/auth/reset-password',
    },

    // Users endpoints
    USERS: {
        LIST: '/users',
        FRIENDS: (userId: string) => `/users/${userId}/friends`,
        PROFILE: (userId: string) => `/users/${userId}/profile`,
        BIO: (userId: string) => `/users/${userId}/bio`,
        PICTURES: (userId: string) => `/users/${userId}/pictures`,
        AVATAR: (userId: string) => `/users/${userId}/avatar`,
        COVER_PHOTO: (userId: string) => `/users/${userId}/cover-photo`,
        UNFRIEND: (friendId: string) => `/users/${friendId}/unfriend`,
    },

    // Posts endpoints
    POSTS: {
        LIST: '/posts',
        CREATE: '/posts',
        BY_ID: (id: string) => `/posts/${id}`,
        NEW_FEED: '/posts/new-feed',
        NEW_FEED_GROUP: '/posts/new-feed-group',
        NEW_FEED_FRIEND: '/posts/new-feed-friend',
        SAVED: '/posts/saved',
        PROFILE: (userId: string) => `/posts/profile/${userId}`,
        GROUP: (groupId: string) => `/posts/group/${groupId}`,
        GROUP_MANAGE: (groupId: string) => `/posts/group/${groupId}/manage`,
        GROUP_MANAGE_PENDING: (groupId: string) =>
            `/posts/group/${groupId}/manage/pending`,
        GROUP_MEMBER: (groupId: string, userId: string) =>
            `/posts/group/${groupId}/member/${userId}`,
    },

    // Comments endpoints
    COMMENTS: {
        LIST: '/comments',
        CREATE: '/comments',
        BY_ID: (id: string) => `/comments/${id}`,
        BY_POST: (postId: string) => `/comments/post/${postId}`,
        COUNT: (postId: string) => `/comments/post/${postId}/count`,
        REPLY: (commentId: string) => `/comments/reply/${commentId}`,
        LOVE: (id: string) => `/comments/${id}/love`,
    },

    // Messages endpoints
    MESSAGES: {
        BY_CONVERSATION: (conversationId: string) =>
            `/messages/conversation/${conversationId}`,
        PINNED: (conversationId: string) =>
            `/messages/conversation/${conversationId}/pinned`,
        SEARCH: (conversationId: string) =>
            `/messages/conversation/${conversationId}/search`,
    },

    // Conversations endpoints
    CONVERSATIONS: {
        LIST: '/conversations',
        CREATE: '/conversations',
        BY_ID: (id: string) => `/conversations/${id}`,
        PARTICIPANTS: (id: string) => `/conversations/${id}/participants`,
        REMOVE_PARTICIPANT: (id: string, participantId: string) =>
            `/conversations/${id}/participants/${participantId}`,
        PIN: (id: string) => `/conversations/${id}/pin`,
        UNPIN: (id: string, messageId: string) =>
            `/conversations/${id}/pin/${messageId}`,
    },

    // Groups endpoints
    GROUPS: {
        JOINED: '/groups/joined',
        BY_ID: (id: string) => `/groups/${id}`,
    },

    // Items endpoints
    ITEMS: {
        LIST: '/items',
        SEARCH: '/items/search',
        BY_SELLER: (sellerId: string) => `/items/seller/${sellerId}`,
    },

    // Notifications endpoints
    NOTIFICATIONS: {
        BY_RECEIVER: (receiverId: string) =>
            `/notifications/receiver/${receiverId}`,
        BY_SENDER: (senderId: string) => `/notifications/sender/${senderId}`,
        SEND_REQUEST: '/notifications/request',
        BY_USERS: '/notifications/by-users',
        ACCEPT: (notificationId: string) =>
            `/notifications/${notificationId}/accept`,
        DECLINE: (notificationId: string) =>
            `/notifications/${notificationId}/decline`,
    },

    // Search endpoints
    SEARCH: {
        GENERAL: '/search',
        USERS: '/search/users',
        POSTS: '/search/posts',
        GROUPS: '/search/groups',
    },

    // Upload endpoints
    UPLOAD: {
        IMAGE: '/uploads/image',
        VIDEO: '/uploads/video',
    },

    // Image endpoints
    IMAGES: {
        BY_ID: (id: string) => `/images/${id}`,
        DELETE: '/images',
    },

    // Location endpoints
    LOCATIONS: {
        LIST: '/locations',
    },

    // Follow endpoints
    FOLLOWS: {
        FOLLOWINGS: (userId: string) => `/follows/${userId}/followings`,
    },

    // Categories endpoints
    CATEGORIES: {
        LIST: '/categories',
        ALL: '/categories/all',
        SEARCH: '/categories/search',
        BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
        BY_ID: (id: string) => `/categories/${id}`,
    },

    // Admin endpoints
    ADMIN: {
        USERS: '/users',
        POSTS: '/posts',
        GROUPS: '/groups',
        LOCATIONS: '/locations',
        MEDIAS: '/medias',
        CATEGORIES: '/categories',
    },

    // AI endpoints
    AI: {
        HANDBOOK_AI_CHAT: '/handbook-ai/chat',
    },
};
