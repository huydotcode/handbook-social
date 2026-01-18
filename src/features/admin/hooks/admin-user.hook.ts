import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useQuery } from '@tanstack/react-query';
import { AdminUserService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminUsers = (params?: AdminQueryParams) => {
    return useQuery({
        queryKey: queryKey.admin.users.index,
        queryFn: () => AdminUserService.getUsers(params),
        ...defaultQueryOptions,
    });
};
