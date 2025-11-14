import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface CreatePostDto {
    author: string;
    text: string;
    media?: string[];
    group?: string;
    tags?: string[];
    option?: string;
    status?: string;
}

export interface UpdatePostDto {
    text?: string;
    media?: string[];
    tags?: string[];
    option?: string;
    status?: string;
}

export interface PostQueryParams {
    page?: number;
    page_size?: number;
}

export const postService = {
    /**
     * Get all posts
     */
    getAll: (params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.LIST, { params });
    },

    /**
     * Get post by ID
     */
    getById: (id: string) => {
        return apiClient.get<IPost>(API_ENDPOINTS.POSTS.BY_ID(id));
    },

    /**
     * Get new feed posts (from followings and friends)
     */
    getNewFeed: (params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.NEW_FEED, { params });
    },

    /**
     * Get new feed posts from groups
     */
    getNewFeedGroup: (params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.NEW_FEED_GROUP, {
            params,
        });
    },

    /**
     * Get new feed posts from friends
     */
    getNewFeedFriend: (params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.NEW_FEED_FRIEND, {
            params,
        });
    },

    /**
     * Get saved posts
     */
    getSaved: (params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.SAVED, {
            params,
        });
    },

    /**
     * Get profile posts
     */
    getProfilePosts: (userId: string, params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.PROFILE(userId), {
            params,
        });
    },

    /**
     * Get group posts
     */
    getGroupPosts: (groupId: string, params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.POSTS.GROUP(groupId), {
            params,
        });
    },

    /**
     * Get manage group posts (active status)
     */
    getManageGroupPosts: (groupId: string, params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(
            API_ENDPOINTS.POSTS.GROUP_MANAGE(groupId),
            { params }
        );
    },

    /**
     * Get manage group posts (pending status)
     */
    getManageGroupPostsPending: (groupId: string, params?: PostQueryParams) => {
        return apiClient.get<IPost[]>(
            API_ENDPOINTS.POSTS.GROUP_MANAGE_PENDING(groupId),
            { params }
        );
    },

    /**
     * Get posts by member in a group
     */
    getPostByMember: (
        groupId: string,
        userId: string,
        params?: PostQueryParams
    ) => {
        return apiClient.get<IPost[]>(
            API_ENDPOINTS.POSTS.GROUP_MEMBER(groupId, userId),
            { params }
        );
    },

    /**
     * Create a new post
     */
    create: (data: CreatePostDto) => {
        return apiClient.post<IPost>(API_ENDPOINTS.POSTS.CREATE, data);
    },

    /**
     * Update a post
     */
    update: (id: string, data: UpdatePostDto) => {
        return apiClient.put<IPost>(API_ENDPOINTS.POSTS.BY_ID(id), data);
    },

    /**
     * Delete a post
     */
    delete: (id: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.POSTS.BY_ID(id));
    },
};
