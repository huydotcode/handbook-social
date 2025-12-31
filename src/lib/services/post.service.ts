import { IPost } from '@/types/entites';
import { postService as apiPostService } from '../api/services/post.service';

class PostServiceClass {
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

        const normalizedStatus =
            type && ['active', 'pending', 'rejected'].includes(type)
                ? (type as 'active' | 'pending' | 'rejected')
                : undefined;

        return await apiPostService.create({
            author: authorId,
            text: content,
            media: mediaIds,
            group: groupId || undefined,
            tags: tags,
            option: option,
            status: normalizedStatus,
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
     * Toggles like state: adds like if not liked, removes like if already liked
     */
    async sendReaction(
        postId: string
    ): Promise<{ action: 'added' | 'removed' }> {
        try {
            const result = await apiPostService.like(postId);
            return { action: result.action };
        } catch (error) {
            console.error('Error sending reaction:', error);
            throw error;
        }
    }

    /**
     * Share a post
     * Toggles share state: adds share if not shared, removes share if already shared
     */
    async share(postId: string): Promise<{ action: 'added' | 'removed' }> {
        try {
            const result = await apiPostService.share(postId);
            return { action: result.action };
        } catch (error) {
            console.error('Error sharing post:', error);
            throw error;
        }
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
     */
    async updateStatus({
        postId,
        status,
    }: {
        postId: string;
        status: string;
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
     * Toggles save state: adds save if not saved, removes save if already saved
     */
    async savePost(postId: string): Promise<boolean> {
        try {
            const result = await apiPostService.save(postId);
            return result.action === 'added';
        } catch (error) {
            console.error('Error saving post:', error);
            throw error;
        }
    }

    /**
     * Unsave a post
     * Toggles save state: removes save if saved, adds save if not saved
     */
    async unsavePost(postId: string): Promise<boolean> {
        try {
            const result = await apiPostService.save(postId);
            return result.action === 'removed';
        } catch (error) {
            console.error('Error unsaving post:', error);
            throw error;
        }
    }
}

const PostService = new PostServiceClass();
export default PostService;
