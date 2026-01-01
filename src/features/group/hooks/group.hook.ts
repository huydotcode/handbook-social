import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKey } from '@/lib/queryKey';
import { defaultQueryOptions } from '@/lib/react-query';
import { handleApiError, showSuccessToast } from '@/shared';
import { IGroup } from '@/types/entites';
import GroupService from '../services/group.service';
import { CreateGroupPayload, GroupQueryParams } from '../types/group.types';

/**
 * Hook to get joined groups
 */
export const useJoinedGroups = (
    params?: GroupQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.user.groups(params?.user_id),
        queryFn: () => GroupService.getJoined(params),
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
        queryFn: () => GroupService.getById(groupId),
        enabled: options?.enabled !== false && !!groupId,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to check if user has access to a group
 */
export const useCheckGroupAccess = (
    groupId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['groups', 'access', groupId],
        queryFn: () => GroupService.checkAccess(groupId),
        enabled: options?.enabled !== false && !!groupId,
        retry: false,
        staleTime: 0,
    });
};

/**
 * Hook to check if user is admin or creator of a group
 */
export const useCheckGroupAdmin = (
    groupId: string,
    userId?: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['groups', 'admin', groupId, userId],
        queryFn: async () => {
            if (!userId) return { isAdmin: false, isCreator: false };

            const group = await GroupService.getById(groupId);

            // Check if creator
            if (group.creator._id === userId) {
                return { isAdmin: true, isCreator: true };
            }

            // Check if admin via members
            let page = 1;
            const pageSize = 50;
            let isAdmin = false;

            while (true) {
                const res = await GroupService.getMembers(groupId, {
                    page,
                    page_size: pageSize,
                });

                const member = res.data.find((mem) => mem.user._id === userId);
                if (member && member.role === 'ADMIN') {
                    isAdmin = true;
                    break;
                }

                if (!res.pagination?.hasNext) break;
                page += 1;
            }

            return { isAdmin, isCreator: false };
        },
        enabled: options?.enabled !== false && !!groupId && !!userId,
        retry: false,
        staleTime: 60000, // Cache for 1 minute
    });
};

/**
 * Hook to create a group
 */
export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroupPayload) => GroupService.create(data),
        onSuccess: (data) => {
            // Invalidate group caches (joined lists, detail, etc.)
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.groups.index,
            });
            queryClient.setQueryData(queryKey.groups.id(data._id), data);
            showSuccessToast('Tạo nhóm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể tạo nhóm');
        },
    });
};

/**
 * Hook to update a group
 */
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            data,
        }: {
            groupId: string;
            data: Partial<IGroup>;
        }) =>
            GroupService.update({
                description: data.description || '',
                groupId,
                name: data.name || '',
                type: data.type || 'public',
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(data._id),
            });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            showSuccessToast('Cập nhật nhóm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể cập nhật nhóm');
        },
    });
};

/**
 * Hook to delete a group
 */
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (groupId: string) => GroupService.delete(groupId),
        onSuccess: (_data, groupId) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(groupId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.groups.index,
            });
            showSuccessToast('Xóa nhóm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa nhóm');
        },
    });
};

/**
 * Hook to join a group
 */
export const useJoinGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (groupId: string) => GroupService.join({ groupId }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(data._id),
            });
            showSuccessToast('Tham gia nhóm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể tham gia nhóm');
        },
    });
};

/**
 * Hook to leave a group
 */
export const useLeaveGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (groupId: string) => GroupService.leave({ groupId }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(data._id),
            });
            showSuccessToast('Rời nhóm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể rời nhóm');
        },
    });
};

/**
 * Hook to get members of a group (paginated)
 */
export const useGroupMembers = (
    groupId: string,
    params?: { page?: number; pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;

    return useQuery({
        queryKey: queryKey.groups.members(groupId, { page, pageSize }),
        queryFn: () =>
            GroupService.getMembers(groupId, {
                page,
                page_size: pageSize,
            }),
        enabled: options?.enabled !== false && !!groupId,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to get a specific member from a group
 * Searches through paginated results to find the member
 */
export const useGroupMember = (
    groupId: string,
    memberId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['groups', 'member', groupId, memberId],
        queryFn: async () => {
            const pageSize = 50;
            let page = 1;

            while (true) {
                const res = await GroupService.getMembers(groupId, {
                    page,
                    page_size: pageSize,
                });

                const found = res.data.find((m) => m.user._id === memberId);

                if (found) return found;
                if (!res.pagination?.hasNext) break;

                page += 1;
            }

            return null;
        },
        enabled: options?.enabled !== false && !!groupId && !!memberId,
        retry: false,
        staleTime: 60000, // Cache for 1 minute
    });
};

/**
 * Hook to add a member (admin/creator)
 */
export const useAddGroupMember = (groupId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => GroupService.addMember(groupId, userId),
        onSuccess: () => {
            // Invalidate members list and group detail
            queryClient.invalidateQueries({
                queryKey: ['groups', 'members', groupId],
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(groupId),
            });
            // Invalidate group-related caches (covers joined lists)
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            showSuccessToast('Thêm thành viên thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể thêm thành viên');
        },
    });
};

/**
 * Hook to remove a member (admin/creator)
 */
export const useRemoveGroupMember = (groupId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) =>
            GroupService.removeMember(groupId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['groups', 'members', groupId],
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(groupId),
            });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            showSuccessToast('Xóa thành viên thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa thành viên');
        },
    });
};

/**
 * Hook to update a member's role (admin/creator)
 */
export const useUpdateGroupMemberRole = (groupId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            role,
        }: {
            userId: string;
            role: 'ADMIN' | 'MEMBER';
        }) => GroupService.updateMemberRole(groupId, userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['groups', 'members', groupId],
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.groups.id(groupId),
            });
            showSuccessToast('Cập nhật quyền thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể cập nhật quyền thành viên');
        },
    });
};
