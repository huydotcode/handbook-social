import {
    commentApi,
    CommentQueryParams,
    CreateCommentDto,
    UpdateCommentDto,
} from '../apis/comment.api';

class CommentServiceClass {
    /**
     * Get comment by ID
     */
    public async getById(id: string) {
        return await commentApi.getById(id);
    }

    /**
     * Get comments by post
     */
    public async getByPost(postId: string, params?: CommentQueryParams) {
        return await commentApi.getByPost(postId, params);
    }

    /**
     * Get comment count by post
     */
    public async getCountByPost(postId: string) {
        return await commentApi.getCountByPost(postId);
    }

    /**
     * Get reply comments
     */
    public async getReplies(commentId: string, params?: CommentQueryParams) {
        return await commentApi.getReplies(commentId, params);
    }

    /**
     * Create a new comment using REST API
     */
    public async create(data: CreateCommentDto) {
        return await commentApi.create(data);
    }

    /**
     * Update a comment
     */
    public async update(id: string, data: UpdateCommentDto) {
        return await commentApi.update(id, data);
    }

    /**
     * Delete a comment using REST API
     */
    public async delete(commentId: string) {
        await commentApi.delete(commentId);
    }

    /**
     * Add love to a comment using REST API
     */
    public async love(commentId: string) {
        await commentApi.addLove(commentId);
    }

    /**
     * Remove love from a comment
     */
    public async removeLove(commentId: string) {
        await commentApi.removeLove(commentId);
    }
}

const CommentService = new CommentServiceClass();
export default CommentService;
