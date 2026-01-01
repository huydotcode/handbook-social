import { API_ENDPOINTS, apiClient } from '@/core/api';
import { PaginationResult } from '@/types';
import { IGroup, IMemberGroup } from '@/types/entites';
import { CreateGroupPayload, GroupQueryParams } from '../types/group.types';

export const groupApi = {
    /**
     * Get joined groups
     */
    getJoined: (params?: GroupQueryParams) => {
        return apiClient.get<IGroup[]>(API_ENDPOINTS.GROUPS.JOINED, { params });
    },

    /**
     * Get group by ID
     */
    getById: (id: string) => {
        return apiClient.get<IGroup>(API_ENDPOINTS.GROUPS.BY_ID(id));
    },

    /**
     * Check if user has access to group
     */
    checkAccess: (id: string) => {
        return apiClient.get<{ hasAccess: boolean }>(
            API_ENDPOINTS.GROUPS.CHECK_ACCESS(id)
        );
    },

    /**
     * Create a new group
     */
    create: (data: CreateGroupPayload) => {
        return apiClient.post<IGroup>(API_ENDPOINTS.GROUPS.CREATE, data);
    },

    /**
     * Update a group
     */
    update: (id: string, data: Partial<IGroup>) => {
        return apiClient.put<IGroup>(API_ENDPOINTS.GROUPS.UPDATE(id), data);
    },

    /**
     * Delete a group
     */
    delete: (id: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.GROUPS.DELETE(id));
    },

    /**
     * Join a group (authenticated user)
     */
    join: (id: string) => {
        return apiClient.post<IGroup>(API_ENDPOINTS.GROUPS.JOIN(id));
    },

    /**
     * Leave a group (authenticated user)
     */
    leave: (id: string) => {
        return apiClient.post<IGroup>(API_ENDPOINTS.GROUPS.LEAVE(id));
    },

    /**
     * Get group members (paginated)
     */
    getMembers: (id: string, params?: GroupQueryParams) => {
        return apiClient.getPaginated<IMemberGroup>(
            API_ENDPOINTS.GROUPS.MEMBERS(id),
            {
                params,
            }
        );
    },

    /**
     * Get recommended groups for a user
     */
    getRecommended: (params?: { user_id?: string }) => {
        return apiClient.get<IGroup[]>(API_ENDPOINTS.GROUPS.RECOMMENDED, {
            params,
        });
    },

    /**
     * Update group cover photo
     */
    updateCoverPhoto: (id: string, coverPhoto: string) => {
        return apiClient.put<IGroup>(
            API_ENDPOINTS.GROUPS.UPDATE_COVER_PHOTO(id),
            { coverPhoto }
        );
    },

    /**
     * Update group avatar
     */
    updateAvatar: (id: string, avatar: string) => {
        return apiClient.put<IGroup>(API_ENDPOINTS.GROUPS.UPDATE_AVATAR(id), {
            avatar,
        });
    },

    /**
     * Add a member (admin/creator)
     */
    addMember: (id: string, userId: string) => {
        return apiClient.post<IGroup>(API_ENDPOINTS.GROUPS.MEMBERS(id), {
            user: userId,
        });
    },

    /**
     * Remove a member (admin/creator)
     */
    removeMember: (id: string, userId: string) => {
        return apiClient.delete<IGroup>(
            API_ENDPOINTS.GROUPS.REMOVE_MEMBER(id, userId)
        );
    },

    /**
     * Update a member's role (admin/creator)
     */
    updateMemberRole: (
        id: string,
        userId: string,
        role: 'ADMIN' | 'MEMBER'
    ) => {
        return apiClient.put<IGroup>(
            API_ENDPOINTS.GROUPS.UPDATE_MEMBER_ROLE(id, userId),
            { role }
        );
    },

    /**
     * Admin: list all groups (paginated)
     */
    getAllAdmin: (params?: GroupQueryParams) => {
        return apiClient.get<PaginationResult<IGroup>>(
            API_ENDPOINTS.ADMIN.GROUPS,
            { params }
        );
    },
};
