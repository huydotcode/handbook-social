import { IConversation, INotification, IUser } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { NotificationQueryParams } from '../types/notification.types';

export const notificationApi = {
    /**
     * Get notification by ID
     */
    getById: (notificationId: string) => {
        return apiClient.get<INotification>(
            API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId)
        );
    },

    /**
     * Get notifications by receiver
     */
    getByReceiver: (receiverId: string, params?: NotificationQueryParams) => {
        return apiClient.get<INotification[]>(
            API_ENDPOINTS.NOTIFICATIONS.BY_RECEIVER(receiverId),
            { params }
        );
    },

    /**
     * Get requests by sender
     */
    getBySender: (senderId: string, params?: NotificationQueryParams) => {
        return apiClient.get<INotification[]>(
            API_ENDPOINTS.NOTIFICATIONS.BY_SENDER(senderId),
            { params }
        );
    },

    /**
     * Send friend request
     */
    sendFriendRequest: (data: { receiver: string }) => {
        return apiClient.post<INotification>(
            API_ENDPOINTS.NOTIFICATIONS.SEND_REQUEST,
            data
        );
    },

    /**
     * Create follow user notification
     */
    createFollowNotification: (data: { receiver: string }) => {
        return apiClient.post<INotification>(
            API_ENDPOINTS.NOTIFICATIONS.FOLLOW,
            data
        );
    },

    /**
     * Create notification (generic)
     */
    create: (data: Partial<INotification>) => {
        return apiClient.post<INotification>(
            API_ENDPOINTS.NOTIFICATIONS.CREATE,
            data
        );
    },

    /**
     * Delete notification by users (sender and receiver)
     */
    deleteNotificationByUsers: (data: { sender: string; receiver: string }) => {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.NOTIFICATIONS.BY_USERS,
            {
                data,
            }
        );
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: () => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.NOTIFICATIONS.READ_ALL
        );
    },

    /**
     * Accept friend request
     */
    acceptFriendRequest: (notificationId: string) => {
        return apiClient.post<{
            success: boolean;
            notification: INotification;
            conversation?: IConversation;
        }>(API_ENDPOINTS.NOTIFICATIONS.ACCEPT(notificationId));
    },

    /**
     * Decline friend request
     */
    declineFriendRequest: (notificationId: string) => {
        return apiClient.post<{ success: boolean }>(
            API_ENDPOINTS.NOTIFICATIONS.DECLINE(notificationId)
        );
    },

    /**
     * Delete a notification
     */
    delete: (notificationId: string) => {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId)
        );
    },
};
