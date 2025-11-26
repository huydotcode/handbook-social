'use client';
import {
    conversationService,
    ConversationQueryParams,
} from '@/lib/api/services/conversation.service';
import { followService } from '@/lib/api/services/follow.service';
import { messageService } from '@/lib/api/services/message.service';
import { userService, UserQueryParams } from '@/lib/api/services/user.service';
import queryKey from '@/lib/queryKey';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const PAGE_SIZE = 10;

export const useFriends = (userId: string | undefined) =>
    useQuery<IFriend[]>({
        queryKey: queryKey.user.friends(userId),
        queryFn: async () => {
            if (!userId) return [];

            const params: UserQueryParams = { page: 1, page_size: 100 };
            return userService.getFriends(userId, params);
        },
        enabled: !!userId,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useConversations = (userId: string | undefined) =>
    useQuery<IConversation[]>({
        queryKey: queryKey.conversations.userId(userId),
        queryFn: async () => {
            if (!userId) return [];

            const params: ConversationQueryParams = {
                user_id: userId,
                page: 1,
                page_size: PAGE_SIZE,
            };
            return conversationService.getAll(params);
        },
        enabled: !!userId,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useConversation = (conversationId: string | undefined) => {
    const { user } = useAuth();

    return useQuery<IConversation | null>({
        queryKey: queryKey.conversations.id(conversationId),
        queryFn: async () => {
            try {
                if (!conversationId) return null;
                return conversationService.getById(conversationId);
            } catch (error) {
                return null;
            }
        },
        enabled: !!conversationId && !!user?.id,
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useMessages = (conversationId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.messages.conversationId(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            return messageService.getByConversation(conversationId, {
                page: pageParam,
                page_size: PAGE_SIZE,
            });
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        // Seclect data thành một mảng
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

export const useFollowing = (userId: string | undefined) =>
    useQuery<IFollow[]>({
        queryKey: queryKey.user.followings(userId),
        queryFn: async () => {
            if (!userId) return [];

            return followService.getFollowings(userId);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

function SocialProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { socketEmitor, isConnected } = useSocket();
    const { data: conversations } = useConversations(user?.id);

    useEffect(() => {
        if (!user?.id || !conversations || !isConnected) return;

        conversations.forEach((conversation) => {
            if (!conversation.participants.some((p) => p._id === user.id))
                return;
            if (conversation.isDeletedBy?.includes(user.id)) return;

            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: user.id,
            });
        });

        return () => {
            conversations.forEach((conversation) => {
                socketEmitor.leaveRoom({
                    roomId: conversation._id,
                    userId: user.id,
                });
            });
        };
    }, [conversations, user?.id, socketEmitor, isConnected]);

    return <>{children}</>;
}

export default SocialProvider;
