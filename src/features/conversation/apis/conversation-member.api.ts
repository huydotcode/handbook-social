import { IConversation, IConversationMember } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import {
    ConversationMemberDto,
    ConversationMemberRole,
} from '../types/conversation.type';

export const conversationMemberApi = {
    /**
     * List members of a conversation
     */
    list: (conversationId: string) => {
        return apiClient.get<IConversationMember[]>(
            API_ENDPOINTS.CONVERSATIONS.MEMBERS(conversationId)
        );
    },

    /**
     * Add member to conversation (uses participants route for now)
     */
    add: (conversationId: string, data: ConversationMemberDto) => {
        return apiClient.post<IConversation>(
            API_ENDPOINTS.CONVERSATIONS.ADD_MEMBER(conversationId),
            { participantId: data.userId }
        );
    },

    /**
     * Remove member from conversation
     */
    remove: (conversationId: string, userId: string) => {
        return apiClient.delete<void>(
            API_ENDPOINTS.CONVERSATIONS.REMOVE_MEMBER(conversationId, userId)
        );
    },

    /**
     * Update member role (server route pending)
     */
    setRole: (
        conversationId: string,
        userId: string,
        role: ConversationMemberRole
    ) => {
        return apiClient.put<IConversationMember>(
            API_ENDPOINTS.CONVERSATIONS.SET_MEMBER_ROLE(conversationId, userId),
            { role }
        );
    },
};
