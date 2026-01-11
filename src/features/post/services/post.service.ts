import { IPost } from '@/types/entites';
import { postApi } from '../apis/post.api';

class PostServiceClass {
    /**
     * Get post by ID using REST API
     */
    async getById(id: string): Promise<IPost | null> {
        try {
            return await postApi.getById(id);
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
            return await postApi.getSaved();
        } catch (error) {
            console.error('Error getting saved posts:', error);
            return [];
        }
    }

    /**
     * Create a new post using REST API
     */
    async create(data: FormData): Promise<IPost> {
        return await postApi.create(data);
    }

    /**
     * Update a post using REST API
     */
    async update(postId: string, data: FormData): Promise<IPost> {
        return await postApi.update(postId, data);
    }

    /**
     * Send reaction (like) to a post
     * Toggles like state: adds like if not liked, removes like if already liked
     */
    async sendReaction(
        postId: string
    ): Promise<{ action: 'added' | 'removed' }> {
        try {
            const result = await postApi.like(postId);
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
            const result = await postApi.share(postId);
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
            await postApi.delete(postId);
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
            const formData = new FormData();
            formData.append('status', status);

            // Use update endpoint with status field
            await postApi.update(postId, formData);
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
            const result = await postApi.save(postId);
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
            const result = await postApi.save(postId);
            return result.action === 'removed';
        } catch (error) {
            console.error('Error unsaving post:', error);
            throw error;
        }
    }
}

export const PostService = new PostServiceClass();
