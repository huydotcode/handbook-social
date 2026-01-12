'use client';
import { useAuth, useSocket } from '@/core/context';
import { NotificationService } from '@/features/notification';
import { cn } from '@/lib/utils';
import { Avatar } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useQueryInvalidation } from '@/shared/hooks';
import {
    INotification,
    NOTIFICATION_MESSAGES,
    NOTIFICATION_TYPES,
} from '@/types/entites';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import Icons from '../ui/Icons';

const NotificationItem = ({
    data: notification,
    showMessage = true,
}: {
    data: INotification;
    showMessage?: boolean;
}) => {
    const { user } = useAuth();
    const { socket, socketEmitor } = useSocket();
    const { invalidateNotifications, invalidateFriends } =
        useQueryInvalidation();

    const [showRemove, setShowRemove] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);

    // Chấp nhận lời mời kết bạn
    const handleAcceptFriend = useCallback(async () => {
        if (!user || isAccepting) return;

        setIsAccepting(true);
        try {
            // Chấp nhận lời mời kết bạn sử dụng notification hiện tại
            // Server sẽ tự động tạo conversation khi accept friend request
            const result = await NotificationService.acceptFriend({
                notificationId: notification._id,
            });

            if (!result.success) {
                toast.error('Chấp nhận lời mời kết bạn thất bại!');
                return;
            }

            // Cập nhật lại danh sách bạn bè và notifications
            // Server đã tự tạo accept notification và conversation rồi
            await invalidateNotifications(user.id);
            await invalidateFriends(user.id);

            // Join room chỉ cho current user nếu conversation đã được tạo
            if (socket && result.conversation && user?.id) {
                socketEmitor.joinRoom({
                    roomId: result.conversation._id,
                    userId: user.id,
                });
            }

            toast.success('Đã chấp nhận lời mời kết bạn');
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toast.error(
                'Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại!'
            );
        } finally {
            setIsAccepting(false);
        }
    }, [
        user,
        isAccepting,
        notification,
        invalidateFriends,
        invalidateNotifications,
        socket,
        socketEmitor,
    ]);

    // Từ chối lời mời kết bạn
    const handleDeclineFriend = async () => {
        if (!user || isDeclining) return;

        setIsDeclining(true);
        try {
            await NotificationService.declineFriend({
                notificationId: notification._id,
            });

            await invalidateNotifications(user.id);
            await invalidateFriends(user.id);
            toast.success('Đã từ chối lời mời kết bạn');
        } catch (error) {
            console.error('Error declining friend request:', error);
            toast.error('Không thể từ chối lời mời kết bạn. Vui lòng thử lại!');
        } finally {
            setIsDeclining(false);
        }
    };

    const removeNotification = async () => {
        if (!user) return;

        try {
            await NotificationService.deleteNotification(notification._id);

            await invalidateNotifications(user.id);
            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error removing notification:', error);
            toast.error('Không thể xóa thông báo. Vui lòng thử lại!');
        }
    };

    return (
        <>
            <div
                className="relative flex w-full items-center p-2"
                onMouseEnter={() => setShowRemove(true)}
                onMouseLeave={() => setShowRemove(false)}
            >
                <div className="relative mr-2 h-full min-w-[40px]">
                    <Avatar
                        width={40}
                        height={40}
                        imgSrc={notification.sender.avatar}
                        userUrl={notification.sender._id}
                    />
                </div>

                <div className="flex-1">
                    <p
                        className={cn(
                            'text-sm dark:text-dark-primary-1',
                            notification.isRead && 'text-secondary-1'
                        )}
                    >
                        <strong>{notification.sender.name}</strong>{' '}
                        {notification.type ===
                            NOTIFICATION_TYPES.REQUEST_ADD_FRIEND && (
                            <span>
                                {NOTIFICATION_MESSAGES.REQUEST_ADD_FRIEND}
                            </span>
                        )}
                        {notification.type ===
                            NOTIFICATION_TYPES.ACCEPT_FRIEND_REQUEST && (
                            <span>
                                {NOTIFICATION_MESSAGES.ACCEPT_FRIEND_REQUEST}
                            </span>
                        )}
                        {notification.type ===
                            NOTIFICATION_TYPES.FOLLOW_USER && (
                            <span>{NOTIFICATION_MESSAGES.FOLLOW_USER}</span>
                        )}
                        {notification.type === NOTIFICATION_TYPES.LIKE_POST && (
                            <span>{NOTIFICATION_MESSAGES.LIKE_POST}</span>
                        )}
                        {notification.type ===
                            NOTIFICATION_TYPES.CREATE_POST && (
                            <span>{NOTIFICATION_MESSAGES.CREATE_POST}</span>
                        )}
                    </p>
                    {notification.type ===
                        NOTIFICATION_TYPES.REQUEST_ADD_FRIEND && (
                        <div className="mt-2 flex items-center">
                            <Button
                                className="mr-2"
                                variant={'primary'}
                                size={'xs'}
                                onClick={handleAcceptFriend}
                                disabled={isAccepting || isDeclining}
                            >
                                {isAccepting ? (
                                    <Icons.Loading />
                                ) : showMessage ? (
                                    'Chấp nhận'
                                ) : (
                                    <Icons.Tick />
                                )}
                            </Button>
                            <Button
                                size={'xs'}
                                onClick={handleDeclineFriend}
                                disabled={isAccepting || isDeclining}
                            >
                                {isDeclining ? (
                                    <Icons.Loading />
                                ) : showMessage ? (
                                    'Từ chối'
                                ) : (
                                    <Icons.Close />
                                )}
                            </Button>
                        </div>
                    )}
                    {notification.type === NOTIFICATION_TYPES.CREATE_POST &&
                        notification?.extra?.postId && (
                            <div className="mt-2 flex items-center">
                                <Button
                                    className="mr-2"
                                    variant={'primary'}
                                    size={'xs'}
                                    href={`/posts/${notification.extra?.postId}`}
                                >
                                    Xem bài viết
                                </Button>
                            </div>
                        )}
                </div>

                <Button
                    className={cn(
                        'absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 transition-all duration-200 ease-in-out',
                        !showRemove && 'opacity-0',
                        showRemove && 'opacity-100'
                    )}
                    onClick={removeNotification}
                >
                    <Icons.Close />
                </Button>
            </div>
        </>
    );
};

export default NotificationItem;
