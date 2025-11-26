import { notificationService as apiNotificationService } from '../api/services/notification.service';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface INotificationService {
    getById: (notificationId: string) => Promise<INotification | null>;

    getTypeAcceptFriendByUser(userId: string): Promise<INotification | null>;

    sendRequestFriend: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<INotification | null>;

    acceptFriend: ({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }) => Promise<boolean>;

    declineFriend: ({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }) => Promise<boolean>;

    createNotificationAcceptFriend: ({
        senderId,
        receiverId,
        message,
        type,
    }: {
        senderId: string;
        receiverId: string;
        message: string;
        type: string;
    }) => Promise<INotification | null>;

    createNotificationFollowUser: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<INotification | null>;

    markAllAsRead: (userId: string) => Promise<boolean>;

    deleteNotification: (notificationId: string) => Promise<boolean>;
    deleteNotificationByUsers: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<boolean>;
}

class NotificationServiceClass implements INotificationService {
    /**
     * Get notification by ID
     * TODO: Server API needs GET /notifications/:id endpoint
     */
    async getById(notificationId: string): Promise<INotification | null> {
        // TODO: Implement getById endpoint in server-api
        // GET /notifications/:id
        console.warn('getById notification not yet implemented via REST API');
        return null;
    }

    /**
     * Get accept friend notification by user
     * TODO: Can use getByReceiver with filter
     */
    async getTypeAcceptFriendByUser(
        userId: string
    ): Promise<INotification | null> {
        try {
            const notifications =
                await apiNotificationService.getByReceiver(userId);
            return (
                notifications.find((n) => n.type === 'accept-friend') || null
            );
        } catch (error) {
            console.error('Error getting accept friend notification:', error);
            return null;
        }
    }

    /**
     * Send friend request
     * TODO: Server API needs POST /notifications/request endpoint
     */
    async sendRequestFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        // TODO: Implement sendRequestFriend endpoint in server-api
        // POST /notifications/request
        console.warn('sendRequestFriend not yet implemented via REST API');
        throw new Error(
            'Send friend request endpoint not yet implemented in REST API'
        );
    }

    /**
     * Accept friend request
     * TODO: Server API needs POST /notifications/:id/accept endpoint
     */
    async acceptFriend({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }): Promise<boolean> {
        // TODO: Implement acceptFriend endpoint in server-api
        // POST /notifications/:id/accept
        console.warn('acceptFriend not yet implemented via REST API');
        throw new Error(
            'Accept friend endpoint not yet implemented in REST API'
        );
    }

    /**
     * Decline friend request
     * TODO: Server API needs POST /notifications/:id/decline endpoint
     */
    async declineFriend({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }): Promise<boolean> {
        // TODO: Implement declineFriend endpoint in server-api
        // POST /notifications/:id/decline
        console.warn('declineFriend not yet implemented via REST API');
        throw new Error(
            'Decline friend endpoint not yet implemented in REST API'
        );
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
        // TODO: Implement createNotification endpoint in server-api
        // POST /notifications
        console.warn(
            'createNotificationAcceptFriend not yet implemented via REST API'
        );
        throw new Error(
            'Create notification endpoint not yet implemented in REST API'
        );
    }

    /**
     * Create follow user notification
     * TODO: Server API needs POST /notifications endpoint
     */
    async createNotificationFollowUser({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        // TODO: Implement createNotification endpoint in server-api
        // POST /notifications
        console.warn(
            'createNotificationFollowUser not yet implemented via REST API'
        );
        throw new Error(
            'Create notification endpoint not yet implemented in REST API'
        );
    }

    /**
     * Mark all notifications as read
     * TODO: Server API needs PUT /notifications/read-all endpoint
     */
    async markAllAsRead(): Promise<boolean> {
        // TODO: Implement markAllAsRead endpoint in server-api
        // PUT /notifications/read-all
        console.warn('markAllAsRead not yet implemented via REST API');
        throw new Error(
            'Mark all as read endpoint not yet implemented in REST API'
        );
    }

    /**
     * Delete a notification
     * TODO: Server API needs DELETE /notifications/:id endpoint
     */
    async deleteNotification(notificationId: string): Promise<boolean> {
        // TODO: Implement deleteNotification endpoint in server-api
        // DELETE /notifications/:id
        console.warn('deleteNotification not yet implemented via REST API');
        throw new Error(
            'Delete notification endpoint not yet implemented in REST API'
        );
    }

    /**
     * Delete notification by users
     * TODO: Server API needs DELETE /notifications?sender_id=:senderId&receiver_id=:receiverId endpoint
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
        // TODO: Implement deleteNotificationByUsers endpoint in server-api
        // DELETE /notifications?sender_id=:senderId&receiver_id=:receiverId&type=:type
        console.warn(
            'deleteNotificationByUsers not yet implemented via REST API'
        );
        throw new Error(
            'Delete notification by users endpoint not yet implemented in REST API'
        );
    }
}

const NotificationService = new NotificationServiceClass();
export default NotificationService;
