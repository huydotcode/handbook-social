import { useQuery } from '@tanstack/react-query';
import { groupService } from '@/lib/api/services/group.service';
import { queryKey } from '@/lib/queryKey';

export interface GroupQueryParams {
    user_id?: string;
}

/**
 * Hook to get joined groups
 */
export const useJoinedGroups = (
    params?: GroupQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.user.groups(params?.user_id),
        queryFn: () => groupService.getJoined(params),
        enabled: options?.enabled !== false,
    });
};

/**
 * Hook to get a group by ID
 */
export const useGroup = (groupId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['group', groupId],
        queryFn: () => groupService.getById(groupId),
        enabled: options?.enabled !== false && !!groupId,
    });
};
