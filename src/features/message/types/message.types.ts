export interface MessageQueryParams {
    page?: number;
    page_size?: number;
}

export interface SearchMessageParams {
    q: string;
}

export interface CreateMessageDto {
    conversation: string;
    text: string;
    media?: string[];
}

export interface MarkAsReadDto {
    userId: string;
}
