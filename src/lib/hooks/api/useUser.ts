import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '@/lib/api/services/user.service';
import { friendshipService } from '@/lib/api/services/friendship.service';
import { queryKey } from '@/lib/queryKey';
import {
    createGetNextPageParam,
    defaultQueryOptions,
    defaultInfiniteQueryOptions,
} from '../utils';
import UserService from '@/lib/services/user.service';

export interface UserQueryParams {
    page?: number;
    page_size?: number;
}

/**
 * Hook to get all users
 */
export const useUsers = (params?: UserQueryParams) => {
    return useQuery({
        queryKey: queryKey.users.list(params),
        queryFn: () => userService.getAll(params),
        ...defaultQueryOptions,
    });
};

/**
 * Hook to get a single user by ID
 */
export const useUser = (userId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: queryKey.users.byId(userId),
        queryFn: async () => {
            return UserService.getById(userId);
        },
        enabled: options?.enabled !== false && !!userId,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to get friends of a user
 */
export const useUserFriends = (
    userId: string,
    params?: UserQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.user.friends(userId),
        queryFn: async ({ pageParam = 1 }) => {
            const all = await friendshipService.getFriends(userId);
            const start = (pageParam - 1) * pageSize;
            const end = start + pageSize;
            return all.slice(start, end);
        },
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!userId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};
