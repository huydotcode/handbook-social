import { commentService as apiCommentService } from '../api/services/comment.service';

class CommentServiceClass {
    /**
     * Create a new comment using REST API
     */
    public async create({
        content,
        replyTo,
        postId,
    }: {
        content: string;
        replyTo: string | null;
        postId: string;
    }) {
        return await apiCommentService.create({
            post: postId,
            text: content,
            parent: replyTo || undefined,
        });
    }

    /**
     * Add love to a comment using REST API
     */
    public async love(commentId: string) {
        await apiCommentService.addLove(commentId);
    }

    /**
     * Delete a comment using REST API
     */
    public async delete(commentId: string) {
        await apiCommentService.delete(commentId);
    }
}

const CommentService = new CommentServiceClass();
export default CommentService;
