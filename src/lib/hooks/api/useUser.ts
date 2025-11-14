import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '@/lib/api/services/user.service';
import { queryKey } from '@/lib/queryKey';

export interface UserQueryParams {
    page?: number;
    page_size?: number;
}

/**
 * Hook to get all users
 */
export const useUsers = (params?: UserQueryParams) => {
    return useQuery({
        queryKey: ['users', 'list', params],
        queryFn: () => userService.getAll(params),
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
        queryFn: ({ pageParam = 1 }) =>
            userService.getFriends(userId, {
                ...params,
                page: pageParam,
            }),
        getNextPageParam: (lastPage, allPages) => {
            // If lastPage has items equal to pageSize, there might be more pages
            // Note: The API currently returns just an array, not a paginated response
            // This is a simple heuristic - if we get a full page, assume there's more
            if (Array.isArray(lastPage) && lastPage.length === pageSize) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!userId,
        initialPageParam: 1,
    });
};
