import { useQuery } from '@tanstack/react-query';
import { groupService } from '@/lib/api/services/group.service';
import { queryKey } from '@/lib/queryKey';
import { defaultQueryOptions } from '../utils';

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
        ...defaultQueryOptions,
    });
};

/**
 * Hook to get a group by ID
 */
export const useGroup = (groupId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: queryKey.groups.id(groupId),
        queryFn: () => groupService.getById(groupId),
        enabled: options?.enabled !== false && !!groupId,
        ...defaultQueryOptions,
    });
};
