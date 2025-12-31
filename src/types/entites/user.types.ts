// User Role Constants
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
    comparePassword(password: string): unknown;
    id: string;
    name: string;
    image: string;
    email: string;
    password: string;
}

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    role: UserRole;
    givenName: string;
    familyName: string;
    locale: string;

    friends: IUser[];
    groups: any[];
    followersCount: number;

    isOnline: boolean;
    isBlocked: boolean;
    isVerified: boolean;

    lastAccessed: Date;
    createdAt: Date;
    updatedAt: Date;
}
