import { conversationService as apiConversationService } from '../api/services/conversation.service';

class ConversationServiceClass {
    /**
     * Get conversation by ID using REST API
     */
    public async getById(conversationId: string) {
        try {
            return await apiConversationService.getById(conversationId);
        } catch (error) {
            console.error('Error getting conversation by ID:', error);
            throw error;
        }
    }

    /**
     * Get conversations by group ID
     * TODO: Server API needs GET /conversations?group_id=:groupId endpoint
     */
    public async getByGroupId(groupId: string) {
        // TODO: Implement getByGroupId endpoint in server-api
        // GET /conversations?group_id=:groupId
        console.warn('getByGroupId not yet implemented via REST API');
        return [] as IConversation[];
    }

    /**
     * Get private conversation between two users
     * Returns existing conversation or creates a new one
     */
    public async getPrivateConversation({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }): Promise<{ isNew: boolean; conversation: IConversation | null }> {
        try {
            const result = await apiConversationService.getPrivateConversation({
                user_id: userId,
                friend_id: friendId,
            });
            return {
                isNew: result.isNew,
                conversation: result.conversation,
            };
        } catch (error) {
            console.error('Error getting private conversation:', error);
            throw error;
        }
    }

    /**
     * Create a new conversation using REST API
     */
    public async create({
        creator,
        participantsUserId,
        status = 'active',
        title,
        groupId = null,
        type = 'private',
    }: {
        participantsUserId: string[];
        creator: string;
        title?: string;
        status?: string;
        groupId?: string | null;
        type?: string;
    }) {
        return await apiConversationService.create({
            type: type || 'private',
            participants: participantsUserId,
            name: title,
        });
    }

    /**
     * Create conversation after accepting friend request
     * TODO: This can use the regular create method
     */
    public async createAfterAcceptFriend({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }) {
        // Use regular create method
        return await this.create({
            creator: userId,
            participantsUserId: [userId, friendId],
            type: 'private',
        });
    }

    /**
     * Join a conversation (add member) using REST API
     */
    public async join({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await apiConversationService.addParticipant(conversationId, {
            participantId: userId,
        });
    }

    /**
     * Delete a conversation using REST API
     */
    public async delete(conversationId: string) {
        await apiConversationService.delete(conversationId);
    }

    /**
     * Delete conversation by user (soft delete)
     */
    public async deleteByUser({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        try {
            await apiConversationService.removeParticipant(
                conversationId,
                userId
            );
        } catch (error) {
            console.error('Error deleting conversation by user:', error);
            throw error;
        }
    }

    /**
     * Pin a message in conversation using REST API
     */
    public async addPinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }) {
        await apiConversationService.pinMessage(conversationId, {
            messageId,
        });
    }

    /**
     * Unpin a message in conversation using REST API
     */
    public async removePinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }) {
        await apiConversationService.unpinMessage(conversationId, messageId);
    }

    /**
     * Leave a conversation (remove participant) using REST API
     */
    public async leaveConversation({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await apiConversationService.removeParticipant(conversationId, userId);
    }

    /**
     * Undelete conversation by user
     * TODO: Server API needs POST /conversations/:id/restore endpoint
     */
    public async undeleteConversationByUserId({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        // TODO: Implement undeleteConversationByUserId endpoint in server-api
        // POST /conversations/:id/restore or re-add participant
        // For now, re-add the user as participant
        try {
            await apiConversationService.addParticipant(conversationId, {
                participantId: userId,
            });
        } catch (error) {
            console.error('Error undeleting conversation:', error);
            throw error;
        }
    }
}

const ConversationService = new ConversationServiceClass();
export default ConversationService;
