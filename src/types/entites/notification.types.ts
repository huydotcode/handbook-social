import type { IUser } from './user.types';

// Notification Types Constants
export const NOTIFICATION_TYPES = {
    REQUEST_ADD_FRIEND: 'request-add-friend',
    ACCEPT_FRIEND_REQUEST: 'accept-friend-request',
    REJECT_FRIEND_REQUEST: 'reject-friend-request',
    MESSAGE: 'message',
    FOLLOW_USER: 'follow-user',
    LIKE_POST: 'like-post',
} as const;

export type NotificationType =
    (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// Notification Messages Constants
export const NOTIFICATION_MESSAGES = {
    REQUEST_ADD_FRIEND: 'đã gửi cho bạn một lời mời kết bạn',
    ACCEPT_FRIEND_REQUEST: 'đã chấp nhận lời mời kết bạn của bạn',
    REJECT_FRIEND_REQUEST: 'đã từ chối lời mời kết bạn của bạn',
    MESSAGE: 'đã gửi cho bạn một tin nhắn',
    FOLLOW_USER: 'đã theo dõi bạn',
    LIKE_POST: 'đã thích bài viết của bạn',
} as const;

export type NotificationMessage =
    (typeof NOTIFICATION_MESSAGES)[keyof typeof NOTIFICATION_MESSAGES];

export interface INotification {
    _id: string;

    sender: IUser;
    receiver: IUser;
    message: string;
    isRead: boolean;
    type: NotificationType;

    extra?: {
        postId?: string;
        commentId?: string;
        groupId?: string;
        messageId?: string;
        notificationId?: string;

        [key: string]: any;
    };

    isDeleted: boolean;
    deletedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}
