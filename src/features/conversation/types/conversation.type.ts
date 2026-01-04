export interface CreateConversationDto {
    type: string;
    participants: string[];
    name?: string;
}

export interface UpdateConversationDto {
    name?: string;
    type?: string;
}

export interface ConversationQueryParams {
    user_id?: string;
    page?: number;
    page_size?: number;
}

export interface PrivateConversationQueryParams {
    user_id?: string;
    friend_id: string;
}

export interface AddParticipantDto {
    participantId: string;
}

export interface PinMessageDto {
    messageId: string;
}
