import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminUserService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminUsers = (params?: AdminQueryParams) => {
    return useQuery({
        queryKey: queryKey.admin.users.index(params),
        queryFn: () => AdminUserService.getUsers(params),
        ...defaultQueryOptions,
    });
};

export const useAdminBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => AdminUserService.blockUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.users.root,
            });
        },
    });
};

export const useAdminUnblockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => AdminUserService.unblockUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.users.root,
            });
        },
    });
};

export const useAdminUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            AdminUserService.updateRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.users.root,
            });
        },
    });
};
