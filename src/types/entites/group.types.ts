import type { IUser } from './user.types';
import type { IMedia } from './media.types';

// Group Role Constants
export const GROUP_ROLES = {
    MEMBER: 'MEMBER',
    ADMIN: 'ADMIN',
} as const;

export type GroupRole = (typeof GROUP_ROLES)[keyof typeof GROUP_ROLES];

export interface IGroup {
    _id: string;
    name: string;
    description: string;
    avatar: IMedia;
    members: IMemberGroup[];
    creator: IUser;
    coverPhoto: string;
    type: string;
    introduction: string;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMemberGroup {
    _id: string;
    user: IUser;
    role: GroupRole;
    joinedAt: Date;
}
