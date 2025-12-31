import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

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

export const messageService = {
    /**
     * Get messages by conversation
     */
    getByConversation: (
        conversationId: string,
        params?: MessageQueryParams
    ) => {
        return apiClient.get<IMessage[]>(
            API_ENDPOINTS.MESSAGES.BY_CONVERSATION(conversationId),
            { params }
        );
    },

    /**
     * Get pinned messages by conversation
     */
    getPinned: (conversationId: string, params?: MessageQueryParams) => {
        return apiClient.get<IMessage[]>(
            API_ENDPOINTS.MESSAGES.PINNED(conversationId),
            { params }
        );
    },

    /**
     * Search messages in conversation
     */
    search: (conversationId: string, params: SearchMessageParams) => {
        return apiClient.get<IMessage[]>(
            API_ENDPOINTS.MESSAGES.SEARCH(conversationId),
            { params }
        );
    },

    /**
     * Create a new message
     */
    create: (data: CreateMessageDto) => {
        return apiClient.post<IMessage>(API_ENDPOINTS.MESSAGES.CREATE, data);
    },

    /**
     * Delete a message
     */
    delete: (messageId: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.MESSAGES.BY_ID(messageId));
    },

    /**
     * Mark messages as read in a conversation
     * TODO: Server API needs this endpoint
     */
    markAsRead: (roomId: string, data: MarkAsReadDto) => {
        return apiClient.patch<void>(API_ENDPOINTS.MESSAGES.READ(roomId), data);
    },
};
