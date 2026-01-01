import { IMessage } from '@/types/entites';

import { conversationApi } from '@/features/conversation';
import { messageService as apiMessageService } from '../api/services/message.service';

class MessageServiceClass {
    /**
     * Send a message via REST API
     */
    async send({
        roomId,
        text,
        images,
    }: {
        roomId: string;
        text: string;
        images?: string[];
    }): Promise<IMessage | null> {
        try {
            return await apiMessageService.create({
                conversation: roomId,
                text: text || '',
                media: images || [],
            });
        } catch (error: any) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    /**
     * Delete a message via REST API
     */
    async delete({
        messageId,
        prevMessageId,
        conversationId,
    }: {
        messageId: string;
        conversationId: string;
        prevMessageId?: string | null;
    }): Promise<boolean> {
        try {
            await apiMessageService.delete(messageId);
            return true;
        } catch (error: any) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    /**
     * Pin a message
     * Note: Pin/unpin is handled via conversation endpoints
     * @deprecated Use conversationService.addPinMessage instead for better control
     */
    async pin(messageId: string, conversationId?: string): Promise<boolean> {
        if (!conversationId) {
            console.error('conversationId is required for pinning message');
            throw new Error(
                'conversationId is required. Use conversationService.addPinMessage instead'
            );
        }

        try {
            await conversationApi.pinMessage(conversationId, {
                messageId: messageId,
            });
            return true;
        } catch (error: any) {
            console.error('Error pinning message:', error);
            throw error;
        }
    }

    /**
     * Unpin a message
     * Note: Pin/unpin is handled via conversation endpoints
     * @deprecated Use conversationService.removePinMessage instead for better control
     */
    async unpin(messageId: string, conversationId?: string): Promise<boolean> {
        if (!conversationId) {
            console.error('conversationId is required for unpinning message');
            throw new Error(
                'conversationId is required. Use conversationService.removePinMessage instead'
            );
        }

        try {
            await conversationApi.unpinMessage(conversationId, messageId);
            return true;
        } catch (error: any) {
            console.error('Error unpinning message:', error);
            throw error;
        }
    }

    /**
     * Mark messages as read
     * TODO: Server API needs PATCH /api/messages/:roomId/read endpoint
     */
    async markAsRead(roomId: string, userId: string): Promise<boolean> {
        try {
            await apiMessageService.markAsRead(roomId, { userId });
            return true;
        } catch (error: any) {
            console.warn(
                'markAsRead endpoint not yet implemented in server-api'
            );
            return false;
        }
    }
}

const MessageService = new MessageServiceClass();
export default MessageService;
