'use client';
import { CategoryService } from '@/features/category';
import GroupService from '@/features/group/services/group.service';
import {
    notificationApi,
    NotificationQueryParams,
} from '@/features/notification';
import queryKey from '@/lib/react-query/query-key';
import { Avatar } from '@/shared/components/ui';
import { socketEvent } from '@/shared/constants';
import { useQueryInvalidation } from '@/shared/hooks';
import { soundManager } from '@/shared/utils/sound-manager';
import {
    ICategory,
    INotification,
    NOTIFICATION_MESSAGES,
    NOTIFICATION_TYPES,
} from '@/types/entites';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSocket } from '.';
import { useAuth } from './AuthContext';
import { SidebarCollapseContext } from './SidebarContext';

const PAGE_SIZE = 10;

export const useNotifications = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.notifications(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const params: NotificationQueryParams = {
                page: pageParam,
                page_size: PAGE_SIZE,
            };
            return notificationApi.getByReceiver(userId, params);
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

export const useCategories = () =>
    useQuery<ICategory[]>({
        queryKey: queryKey.categories.list(),
        queryFn: async () => {
            return CategoryService.getAll();
        },
    });

export const useGroupsJoined = (userId: string | undefined) => {
    return useInfiniteQuery({
        queryKey: queryKey.user.groups(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            return GroupService.getJoined({
                user_id: userId,
                page: pageParam,
                page_size: PAGE_SIZE,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useRequests = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.requests(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const params: NotificationQueryParams = {
                page: pageParam,
                page_size: PAGE_SIZE,
            };
            return notificationApi.getBySender(userId, params);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

// export const useLocations = () =>
//     useQuery<ILocation[]>({
//         queryKey: queryKey.locations.list(),
//         queryFn: async () => {
//             return LocationService.getAll();
//         },
//         refetchInterval: false,
//         refetchOnWindowFocus: false,
//     });

function AppProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { invalidateFriends, invalidateNotifications } =
        useQueryInvalidation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { socket } = useSocket();
    const router = useRouter();

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (!user?.id || !socket) return;

        socket.on(
            socketEvent.RECEIVE_NOTIFICATION,
            async (notification: INotification) => {
                console.log('Notificaiton', notification);

                // Map notification type to message
                let message = '';
                switch (notification.type) {
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
                }

                if (message) {
                    toast(
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => {
                                if (
                                    notification.type ==
                                        NOTIFICATION_TYPES.CREATE_POST &&
                                    notification?.extra?.postId
                                ) {
                                    router.push(
                                        `/posts/${notification.extra.postId}`
                                    );
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
                }

                await invalidateFriends(user.id);
                await invalidateNotifications(user.id);
            }
        );
    }, [socket, user?.id, invalidateFriends, invalidateNotifications, router]);

    // Preload các âm thanh
    useEffect(() => {
        soundManager.preload(
            'message',
            '/assets/sounds/message-notification.mp3'
        );
        soundManager.preload('phone-ring', '/assets/sounds/phone-ringing.mp3');
    }, []);

    return (
        <SidebarCollapseContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
            }}
        >
            {children}
        </SidebarCollapseContext.Provider>
    );
}

export default AppProvider;
