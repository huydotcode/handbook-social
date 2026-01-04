import type { IUser } from './user.types';
import type { IMedia } from './media.types';
import type { IMessage } from './message.types';
import type { IGroup } from './group.types';

export interface IConversation {
    _id: string;
    title: string;
    creator: IUser;
    lastMessage: IMessage;
    group?: IGroup;
    type: string;
    status: string;
    avatar: IMedia;
    pinnedMessages: IMessage[];
    isDeletedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IConversationMember {
    _id: string;
    conversation: string;
    user: IUser;
    role: 'admin' | 'member';
    createdAt: Date;
    updatedAt: Date;
}
