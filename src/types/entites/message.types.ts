import type { IUser } from './user.types';
import type { IMedia } from './media.types';

export interface IMessage {
    _id: string;
    text: string;
    media: IMedia[];
    sender: IUser;
    conversation: any;
    isPin: boolean;
    readBy: {
        user: IUser;
        readAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
