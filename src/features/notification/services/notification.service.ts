import {
    IConversation,
    INotification,
    IUser,
    NOTIFICATION_TYPES,
} from '@/types/entites';
import { notificationApi } from '../apis/notification.api';

class NotificationServiceClass {
    /**
     * Get notification by ID
     */
    async getById(notificationId: string): Promise<INotification | null> {
        try {
            const notification = await notificationApi.getById(notificationId);
            return notification;
        } catch (error) {
            console.error('Error getting notification by id:', error);
            throw error;
        }
    }

    /**
     * Get accept friend notification by user
     * TODO: Can use getByReceiver with filter
     */
    async getTypeAcceptFriendByUser(
        userId: string
    ): Promise<INotification | null> {
        try {
            const notifications = await notificationApi.getByReceiver(userId);
            return (
                notifications.find(
                    (n) => n.type === NOTIFICATION_TYPES.ACCEPT_FRIEND_REQUEST
                ) || null
            );
        } catch (error) {
            console.error('Error getting accept friend notification:', error);
            return null;
        }
    }

    /**
     * Send friend request
     */
    async sendRequestFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        try {
            const notification = await notificationApi.sendFriendRequest({
                receiver: receiverId,
            });
            return notification;
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    }

    /**
     * Accept friend request
     */
    async acceptFriend({
        notificationId,
    }: {
        notificationId: string;
    }): Promise<{ success: boolean; conversation?: IConversation }> {
        try {
            const result =
                await notificationApi.acceptFriendRequest(notificationId);
            return {
                success: result.success,
                conversation: result.conversation,
            };
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    }

    /**
     * Decline friend request
     */
    async declineFriend({
        notificationId,
    }: {
        notificationId: string;
    }): Promise<boolean> {
        try {
            const result =
                await notificationApi.declineFriendRequest(notificationId);
            return result.success;
        } catch (error) {
            console.error('Error declining friend request:', error);
            throw error;
        }
    }

    /**
     * Create accept friend notification
     * TODO: Server API needs POST /notifications endpoint
     */
    async createNotificationAcceptFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        try {
            const notification = await notificationApi.create({
                receiver: receiverId as unknown as IUser,
                type: NOTIFICATION_TYPES.ACCEPT_FRIEND_REQUEST,
            });
            return notification;
        } catch (error) {
            console.error('Error creating accept-friend notification:', error);
            throw error;
        }
    }

    /**
     * Create follow user notification
     */
    async createNotificationFollowUser({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        try {
            const notification = await notificationApi.createFollowNotification(
                {
                    receiver: receiverId,
                }
            );
            return notification;
        } catch (error) {
            console.error('Error creating follow notification:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<boolean> {
        try {
            const result = await notificationApi.markAllAsRead();
            return result.success;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string): Promise<boolean> {
        try {
            const result = await notificationApi.delete(notificationId);
            return result.success;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Delete notification by users
     */
    async deleteNotificationByUsers({
        senderId,
        receiverId,
        type = 'request-add-friend',
    }: {
        senderId: string;
        receiverId: string;
        type?: string;
    }): Promise<boolean> {
        try {
            const result = await notificationApi.deleteNotificationByUsers({
                sender: senderId,
                receiver: receiverId,
            });
            return result.success;
        } catch (error) {
            console.error('Error deleting notification by users:', error);
            throw error;
        }
    }
}

export const NotificationService = new NotificationServiceClass();
