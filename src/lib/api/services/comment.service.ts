import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface CreateCommentDto {
    post: string;
    text: string;
    replyComment?: string;
    media?: string[];
}

export interface UpdateCommentDto {
    text?: string;
    media?: string[];
}

export interface CommentQueryParams {
    page?: number;
    page_size?: number;
}

export const commentService = {
    /**
     * Get comment by ID
     */
    getById: (id: string) => {
        return apiClient.get<IComment>(API_ENDPOINTS.COMMENTS.BY_ID(id));
    },

    /**
     * Get comments by post
     */
    getByPost: (postId: string, params?: CommentQueryParams) => {
        return apiClient.get<IComment[]>(
            API_ENDPOINTS.COMMENTS.BY_POST(postId),
            { params }
        );
    },

    /**
     * Get comment count by post
     */
    getCountByPost: (postId: string) => {
        return apiClient.get<{ count: number }>(
            API_ENDPOINTS.COMMENTS.COUNT(postId)
        );
    },

    /**
     * Get reply comments
     */
    getReplies: (commentId: string, params?: CommentQueryParams) => {
        return apiClient.get<IComment[]>(
            API_ENDPOINTS.COMMENTS.REPLY(commentId),
            { params }
        );
    },

    /**
     * Create a new comment
     */
    create: (data: CreateCommentDto) => {
        return apiClient.post<IComment>(API_ENDPOINTS.COMMENTS.CREATE, data);
    },

    /**
     * Update a comment
     */
    update: (id: string, data: UpdateCommentDto) => {
        return apiClient.put<IComment>(API_ENDPOINTS.COMMENTS.BY_ID(id), data);
    },

    /**
     * Delete a comment
     */
    delete: (id: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.COMMENTS.BY_ID(id));
    },

    /**
     * Add love to a comment
     */
    addLove: (id: string) => {
        return apiClient.post<IComment>(API_ENDPOINTS.COMMENTS.LOVE(id));
    },

    /**
     * Remove love from a comment
     */
    removeLove: (id: string) => {
        return apiClient.delete<IComment>(API_ENDPOINTS.COMMENTS.LOVE(id));
    },
};
