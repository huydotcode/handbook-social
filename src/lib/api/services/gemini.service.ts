import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface GeminiChatRequest {
    message: string;
}

export interface GeminiChatResponse {
    response: string;
    result: any;
}

export const geminiService = {
    sendMessage: (data: GeminiChatRequest) => {
        return apiClient.post<GeminiChatResponse>(
            API_ENDPOINTS.AI.HANDBOOK_AI_CHAT,
            data
        );
    },
};
