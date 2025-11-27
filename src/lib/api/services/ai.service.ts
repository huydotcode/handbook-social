import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface AIChatRequest {
    message: string;
}

export interface AIChatResponse {
    response: string;
    result: any;
}

export const aiService = {
    sendMessage: (data: AIChatRequest) => {
        return apiClient.post<AIChatResponse>(
            API_ENDPOINTS.AI.HANDBOOK_AI_CHAT,
            data
        );
    },
};
