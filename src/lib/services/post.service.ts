import { postService as apiPostService } from '../api/services/post.service';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface IPostService {
    getById(id: string): Promise<IPost | null>;
    getSavedByUserId?(userId: string): Promise<IPost[]>;
    create: ({
        content,
        mediaIds,
        option,
        groupId,
        type,
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        groupId?: string | null;
        type?: string;
    }) => Promise<IPost>;
    update: ({
        content,
        mediaIds,
        option,
        postId,
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        postId: string;
    }) => Promise<IPost>;
    sendReaction: (postId: string) => Promise<boolean>;
    delete: (postId: string) => Promise<boolean>;

    updateStatus: ({
        postId,
        status,
        path,
    }: {
        postId: string;
        status: string;
        path: string;
    }) => Promise<boolean>;

    savePost: ({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }) => Promise<boolean>;

    unsavePost: ({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }) => Promise<boolean>;
}

class PostServiceClass implements IPostService {
    /**
     * Get post by ID using REST API
     */
    async getById(id: string): Promise<IPost | null> {
        try {
            return await apiPostService.getById(id);
        } catch (error) {
            console.error('Error getting post by ID:', error);
            return null;
        }
    }

    /**
     * Get saved posts by user ID using REST API
     */
    async getSavedByUserId(userId: string): Promise<IPost[]> {
        try {
            return await apiPostService.getSaved();
        } catch (error) {
            console.error('Error getting saved posts:', error);
            return [];
        }
    }

    /**
     * Create a new post using REST API
     */
    async create({
        content,
        mediaIds,
        option,
        groupId = null,
        tags = [],
        type = 'default',
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        groupId?: string | null;
        type?: string;
        tags?: string[];
    }): Promise<IPost> {
        // Get current user ID from localStorage token
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('accessToken')
                : null;
        let authorId = '';

        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(
                            (c) =>
                                '%' +
                                ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        )
                        .join('')
                );
                const decoded = JSON.parse(jsonPayload);
                authorId = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        return await apiPostService.create({
            author: authorId,
            text: content,
            media: mediaIds,
            group: groupId || undefined,
            tags: tags,
            option: option,
            status: type,
        });
    }

    /**
     * Update a post using REST API
     */
    async update({
        content,
        mediaIds,
        option,
        postId,
        tags = [],
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        postId: string;
        tags?: string[];
    }): Promise<IPost> {
        return await apiPostService.update(postId, {
            text: content,
            media: mediaIds,
            option: option,
            tags: tags,
        });
    }

    /**
     * Send reaction (like) to a post
     * TODO: Server API needs POST /posts/:id/like endpoint
     */
    async sendReaction(postId: string): Promise<boolean> {
        // TODO: Implement like endpoint in server-api
        // POST /posts/:id/like
        console.warn('sendReaction not yet implemented via REST API');
        throw new Error('Like endpoint not yet implemented in REST API');
    }

    /**
     * Share a post
     * TODO: Server API needs POST /posts/:id/share endpoint
     */
    async share(postId: string): Promise<boolean> {
        // TODO: Implement share endpoint in server-api
        // POST /posts/:id/share
        console.warn('share not yet implemented via REST API');
        throw new Error('Share endpoint not yet implemented in REST API');
    }

    /**
     * Delete a post using REST API
     */
    async delete(postId: string): Promise<boolean> {
        try {
            await apiPostService.delete(postId);
            return true;
        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    }

    /**
     * Update post status
     * TODO: Server API needs PUT /posts/:id/status endpoint or include in update
     */
    async updateStatus({
        postId,
        status,
        path,
    }: {
        postId: string;
        status: string;
        path: string;
    }): Promise<boolean> {
        try {
            // Use update endpoint with status field
            await apiPostService.update(postId, {
                status: status,
            });
            return true;
        } catch (error) {
            console.error('Error updating post status:', error);
            return false;
        }
    }

    /**
     * Save a post
     * TODO: Server API needs POST /posts/:id/save endpoint
     */
    async savePost({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement save endpoint in server-api
        // POST /posts/:id/save
        console.warn('savePost not yet implemented via REST API');
        throw new Error('Save post endpoint not yet implemented in REST API');
    }

    /**
     * Unsave a post
     * TODO: Server API needs DELETE /posts/:id/save endpoint
     */
    async unsavePost({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement unsave endpoint in server-api
        // DELETE /posts/:id/save
        console.warn('unsavePost not yet implemented via REST API');
        throw new Error('Unsave post endpoint not yet implemented in REST API');
    }
}

const PostService = new PostServiceClass();
export default PostService;
