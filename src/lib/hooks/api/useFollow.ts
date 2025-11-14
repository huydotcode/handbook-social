import { useQuery } from '@tanstack/react-query';
import { followService } from '@/lib/api/services/follow.service';
import { queryKey } from '@/lib/queryKey';

/**
 * Hook to get followings of a user
 */
export const useFollowings = (
    userId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.follows.followings(userId),
        queryFn: () => followService.getFollowings(userId),
        enabled: options?.enabled !== false && !!userId,
    });
};
