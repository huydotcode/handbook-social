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
