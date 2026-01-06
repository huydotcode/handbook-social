import { conversationMemberApi } from '../apis/conversation-member.api';
import {
    ConversationMemberDto,
    ConversationMemberRole,
} from '../types/conversation.type';

class ConversationMemberServiceClass {
    /**
     * List members of a conversation
     */
    public async list(conversationId: string) {
        return await conversationMemberApi.list(conversationId);
    }

    /**
     * Add member to conversation (uses participants route for now)
     */
    public async add(conversationId: string, data: ConversationMemberDto) {
        return await conversationMemberApi.add(conversationId, data);
    }

    /**
     * Remove member from conversation
     */
    public async remove(conversationId: string, userId: string) {
        return await conversationMemberApi.remove(conversationId, userId);
    }

    /**
     * Update member role (server route pending)
     */
    public async setRole(
        conversationId: string,
        userId: string,
        role: ConversationMemberRole
    ) {
        return await conversationMemberApi.setRole(
            conversationId,
            userId,
            role
        );
    }
}

export const ConversationMemberService = new ConversationMemberServiceClass();
