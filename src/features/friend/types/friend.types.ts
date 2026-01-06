export interface FriendWithConversation {
    _id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
}

export interface FriendConversation {
    _id: string;
    type: 'private';
    friend: FriendWithConversation;
    lastMessage?: {
        content: string;
        sender: string;
        createdAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface GroupConversation {
    _id: string;
    type: 'group';
    title: string;
    avatar?: {
        url: string;
    };
    group?: {
        name: string;
        avatar: {
            url: string;
        };
    };
    lastMessage?: {
        content: string;
        sender: string;
        createdAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface FriendsWithConversationsResponse {
    friends: FriendWithConversation[];
    friendConversations: FriendConversation[];
    groupConversations: GroupConversation[];
}
