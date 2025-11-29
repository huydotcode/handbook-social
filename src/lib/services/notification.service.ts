import { notificationService as apiNotificationService } from '../api/services/notification.service';

class NotificationServiceClass {
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
     */
    async sendRequestFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        try {
            const notification = await apiNotificationService.sendFriendRequest(
                {
                    receiver: receiverId,
                }
            );
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
                await apiNotificationService.acceptFriendRequest(
                    notificationId
                );
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
                await apiNotificationService.declineFriendRequest(
                    notificationId
                );
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
     */
    async createNotificationFollowUser({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        try {
            const notification =
                await apiNotificationService.createFollowNotification({
                    receiver: receiverId,
                });
            return notification;
        } catch (error) {
            console.error('Error creating follow notification:', error);
            throw error;
        }
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
            const result =
                await apiNotificationService.deleteNotificationByUsers({
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

const NotificationService = new NotificationServiceClass();
export default NotificationService;
