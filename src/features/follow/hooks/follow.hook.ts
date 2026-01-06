import { queryKey } from '@/lib/react-query/query-key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FollowService } from '../services/follow.service';

/**
 * Hook to get followings of a user
 */
export const useFollowings = (
    userId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.follows.followings(userId),
        queryFn: () => FollowService.getFollowings(userId),
        enabled: options?.enabled !== false && !!userId,
    });
};

/**
 * Hook to follow a user
 */
export const useFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => FollowService.follow(userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.follows.followings(data.follower._id),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.user.followers(data.following._id),
            });
        },
    });
};

/**
 * Hook to unfollow a user
 */
export const useUnfollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => FollowService.unfollow(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.follows.followings(userId),
            });
        },
    });
};
