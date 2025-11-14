import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface MessageQueryParams {
    page?: number;
    page_size?: number;
}

export interface SearchMessageParams {
    q: string;
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
};
