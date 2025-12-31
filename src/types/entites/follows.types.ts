import type { IUser } from './user.types';

export interface IFollows {
    _id: string;
    follower: IUser;
    following: IUser;
    createdAt: Date;
    updatedAt: Date;
}
