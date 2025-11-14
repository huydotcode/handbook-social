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
};
