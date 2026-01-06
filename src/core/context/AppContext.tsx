'use client';
import { CategoryService } from '@/features/category';
import GroupService from '@/features/group/services/group.service';
// import { LocationService } from '@/features/location';
import {
    notificationApi,
    NotificationQueryParams,
} from '@/features/notification';
import queryKey from '@/lib/react-query/query-key';
import { soundManager } from '@/shared/utils/sound-manager';
import { notificationType, socketEvent } from '@/shared/constants';
import { useQueryInvalidation } from '@/shared/hooks';
import { ICategory, ILocation, INotification } from '@/types/entites';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (!user?.id || !socket) return;

        socket.on(
            socketEvent.RECEIVE_NOTIFICATION,
            async (notification: INotification) => {
                if (notification.type === notificationType.ACCEPT_FRIEND) {
                    toast.success(
                        `${notification.sender.name} đã chấp nhận lời mời kết bạn`,
                        {
                            id: notification._id,
                            position: 'bottom-left',
                            className: 'text-sm',
                        }
                    );
                }

                await invalidateFriends(user.id);
                await invalidateNotifications(user.id);
            }
        );
    }, [socket, user?.id, invalidateFriends, invalidateNotifications]);

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
