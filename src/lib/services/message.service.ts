class MessageServiceClass {
    /**
     * Send a message
     * TODO: Server API needs POST /messages endpoint
     * For now, messages are sent via Socket.IO
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
        // TODO: Implement send message endpoint in server-api
        // POST /messages with { conversationId, text, media }
        // For now, messages are sent via Socket.IO, so this might not be needed
        console.warn(
            'send message not yet implemented via REST API (using Socket.IO)'
        );
        throw new Error(
            'Send message endpoint not yet implemented in REST API'
        );
    }

    /**
     * Delete a message
     * TODO: Server API needs DELETE /messages/:id endpoint
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
        // TODO: Implement delete message endpoint in server-api
        // DELETE /messages/:id
        console.warn('delete message not yet implemented via REST API');
        throw new Error(
            'Delete message endpoint not yet implemented in REST API'
        );
    }

    /**
     * Pin a message using REST API (via conversation endpoint)
     */
    async pin(messageId: string): Promise<boolean> {
        // Note: Pin/unpin is handled via conversation endpoints
        // This method signature doesn't match the API, but keeping for compatibility
        console.warn(
            'pin message should use conversationService.pinMessage instead'
        );
        throw new Error('Use conversationService.pinMessage instead');
    }

    /**
     * Unpin a message using REST API (via conversation endpoint)
     */
    async unpin(messageId: string): Promise<boolean> {
        // Note: Pin/unpin is handled via conversation endpoints
        // This method signature doesn't match the API, but keeping for compatibility
        console.warn(
            'unpin message should use conversationService.unpinMessage instead'
        );
        throw new Error('Use conversationService.unpinMessage instead');
    }
}

const MessageService = new MessageServiceClass();
export default MessageService;
