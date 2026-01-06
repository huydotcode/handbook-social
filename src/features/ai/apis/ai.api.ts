import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { AIChatRequest, AIChatResponse } from '../types/ai.types';

export const aiApi = {
    sendMessage: (data: AIChatRequest) => {
        return apiClient.post<AIChatResponse>(
            API_ENDPOINTS.AI.HANDBOOK_AI_CHAT,
            data
        );
    },
};
