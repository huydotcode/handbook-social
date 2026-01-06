import { conversationApi } from '@/features/conversation';
import { IMessage } from '@/types/entites';
import { messageApi } from '../apis/message.api';
import {
    MessageQueryParams,
    SearchMessageParams,
} from '../types/message.types';

class MessageServiceClass {
    /**
     * Get messages by conversation
     */
    async getByConversation(
        conversationId: string,
        params?: MessageQueryParams
    ): Promise<IMessage[]> {
        try {
            return await messageApi.getByConversation(conversationId, params);
        } catch (error: any) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }

    /**
     * Get pinned messages by conversation
     */
    async getPinned(
        conversationId: string,
        params?: MessageQueryParams
    ): Promise<IMessage[]> {
        try {
            return await messageApi.getPinned(conversationId, params);
        } catch (error: any) {
            console.error('Error getting pinned messages:', error);
            throw error;
        }
    }

    /**
     * Search messages in conversation
     */
    async search(
        conversationId: string,
        params: SearchMessageParams
    ): Promise<IMessage[]> {
        try {
            return await messageApi.search(conversationId, params);
        } catch (error: any) {
            console.error('Error searching messages:', error);
            throw error;
        }
    }

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
            return await messageApi.create({
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
            await messageApi.delete(messageId);
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
            await messageApi.markAsRead(roomId, { userId });
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
