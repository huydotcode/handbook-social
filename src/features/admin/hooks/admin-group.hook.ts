import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useQuery } from '@tanstack/react-query';
import { AdminGroupService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminGroups = (params?: AdminQueryParams) => {
    return useQuery({
        queryKey: queryKey.admin.groups.index,
        queryFn: () => AdminGroupService.getGroups(params),
        ...defaultQueryOptions,
    });
};
