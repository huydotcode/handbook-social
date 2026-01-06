import { handleApiError } from '@/shared';
import { useMutation } from '@tanstack/react-query';
import AIService from '../services/ai.service';
import { AIChatRequest } from '../types/ai.types';

/**
 * Hook for sending message to AI
 */
export const useSendMessageMutation = () => {
    return useMutation({
        mutationFn: (data: AIChatRequest) => AIService.sendMessage(data),
    });
};
