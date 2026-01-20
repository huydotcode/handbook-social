'use client';

import { useAuth, useSocket } from '@/core/context';
import { Avatar } from '@/shared/components/ui';
import { socketEvent } from '@/shared/constants';
import { useQueryInvalidation } from '@/shared/hooks';
import { soundManager } from '@/shared/utils/sound-manager';
import {
    INotification,
    NOTIFICATION_MESSAGES,
    NOTIFICATION_TYPES,
} from '@/types/entites';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export const useSocketNotification = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();
    const { invalidateNotifications, invalidateFriends } =
        useQueryInvalidation();

    const getMessageFromType = (type: string) => {
        let message = '';

        switch (type) {
            case NOTIFICATION_TYPES.REQUEST_ADD_FRIEND:
                message = NOTIFICATION_MESSAGES.REQUEST_ADD_FRIEND;
                break;
            case NOTIFICATION_TYPES.ACCEPT_FRIEND_REQUEST:
                message = NOTIFICATION_MESSAGES.ACCEPT_FRIEND_REQUEST;
                break;
            case NOTIFICATION_TYPES.FOLLOW_USER:
                message = NOTIFICATION_MESSAGES.FOLLOW_USER;
                break;
            case NOTIFICATION_TYPES.LIKE_POST:
                message = NOTIFICATION_MESSAGES.LIKE_POST;
                break;
            case NOTIFICATION_TYPES.CREATE_POST:
                message = NOTIFICATION_MESSAGES.CREATE_POST;
                break;
            case NOTIFICATION_TYPES.MESSAGE:
                message = NOTIFICATION_MESSAGES.MESSAGE;
                break;
            case NOTIFICATION_TYPES.COMMENT_POST:
                message = NOTIFICATION_MESSAGES.COMMENT_POST;
                break;
            case NOTIFICATION_TYPES.LIKE_COMMENT:
                message = NOTIFICATION_MESSAGES.LIKE_COMMENT;
                break;
            case NOTIFICATION_TYPES.REPLY_COMMENT:
                message = NOTIFICATION_MESSAGES.REPLY_COMMENT;
                break;
        }

        return message;
    };

    const handleMessageNotification = useCallback(
        (notification: INotification, message: string) => {
            toast(
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => {
                        if (
                            notification.type ==
                                NOTIFICATION_TYPES.CREATE_POST ||
                            (notification.type ==
                                NOTIFICATION_TYPES.COMMENT_POST &&
                                notification?.extra?.postId) ||
                            (notification.type ==
                                NOTIFICATION_TYPES.LIKE_COMMENT &&
                                notification?.extra?.postId) ||
                            (notification.type ==
                                NOTIFICATION_TYPES.REPLY_COMMENT &&
                                notification?.extra?.postId)
                        ) {
                            router.push(`/posts/${notification.extra?.postId}`);
                        }
                    }}
                >
                    <Avatar
                        width={40}
                        height={40}
                        imgSrc={notification.sender.avatar}
                        userUrl={notification.sender._id}
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {notification.sender.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {message}
                        </span>
                    </div>
                </div>,
                {
                    id: notification._id,
                    position: 'bottom-left',
                }
            );

            if (notification.type === NOTIFICATION_TYPES.MESSAGE) {
                soundManager.play('message');
            }
        },
        [router]
    );

    const handleReceiveNotification = useCallback(
        async (notification: INotification) => {
            if (!user) return;

            const notificationType = notification?.type;

            // Map notification type to message
            let message = getMessageFromType(notificationType);
            if (message) handleMessageNotification(notification, message);

            if (notificationType === NOTIFICATION_TYPES.ACCEPT_FRIEND_REQUEST)
                invalidateFriends(user.id);

            invalidateNotifications(user.id);
        },
        [
            user,
            handleMessageNotification,
            invalidateFriends,
            invalidateNotifications,
        ]
    );

    useEffect(() => {
        if (!user?.id || !socket) return;

        socket.on(socketEvent.RECEIVE_NOTIFICATION, handleReceiveNotification);

        return () => {
            socket.off(
                socketEvent.RECEIVE_NOTIFICATION,
                handleReceiveNotification
            );
        };
    }, [
        socket,
        user?.id,
        router,
        invalidateNotifications,
        handleReceiveNotification,
    ]);
};
