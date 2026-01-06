import { aiApi } from '../apis/ai.api';
import { AIChatRequest, AIChatResponse } from '../types/ai.types';

class AiServiceClass {
    /**
     * Send message to AI
     */
    public async sendMessage(data: AIChatRequest): Promise<AIChatResponse> {
        try {
            const response = await aiApi.sendMessage(data);
            return response;
        } catch (error) {
            console.error('Error sending message to AI:', error);
            throw error;
        }
    }
}

const AIService = new AiServiceClass();
export default AIService;
