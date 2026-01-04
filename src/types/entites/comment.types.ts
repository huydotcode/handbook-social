import type { IUser } from './user.types';

export interface IComment {
    _id: string;
    text: string;
    author: IUser;
    replyComment: string;
    loves: IUser[];
    post: string;
    isDeleted: boolean;
    hasReplies: boolean;
    createdAt: Date;
    updatedAt: Date;
}
