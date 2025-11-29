import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface NotificationQueryParams {
    page?: number;
    page_size?: number;
}

export const notificationService = {
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
};
