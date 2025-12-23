import { groupService as apiGroupService } from '../api/services/group.service';

class GroupServiceClass {
    /**
     * Create a new group
     */
    public async create({
        name,
        description,
        avatar,
        type,
        members,
    }: {
        name: string;
        description: string;
        avatar: string;
        type: string;
        members?: Array<
            | string
            | { user?: string; userId?: string; role?: 'ADMIN' | 'MEMBER' }
        >;
    }) {
        try {
            const payload = {
                name,
                description,
                avatar: avatar as any,
                type,
                // pass through members for server-side optional initial additions
                ...(members ? { members } : {}),
            };
            return await apiGroupService.create(payload as any);
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    }

    /**
     * Get group by ID using REST API
     */
    public async getById(groupId: string): Promise<IGroup> {
        try {
            return await apiGroupService.getById(groupId);
        } catch (error) {
            console.error('Error getting group by ID:', error);
            throw error;
        }
    }

    /**
     * Check if user has access to group
     */
    public async checkAccess(groupId: string): Promise<boolean> {
        try {
            const result = await apiGroupService.checkAccess(groupId);
            return result.hasAccess;
        } catch (error) {
            console.error('Error checking group access:', error);
            return false;
        }
    }

    /**
     * Get groups by user ID using REST API
     */
    public async getByUserId({
        userId,
        page,
        pageSize,
    }: {
        userId: string;
        page: number;
        pageSize: number;
    }) {
        try {
            return await apiGroupService.getJoined({
                user_id: userId,
            });
        } catch (error) {
            console.error('Error getting groups by user ID:', error);
            return [];
        }
    }

    /**
     * Get recommended groups
     */
    public async getRecommendedGroups(userId: string) {
        try {
            return await apiGroupService.getRecommended({ user_id: userId });
        } catch (error) {
            console.error('Error getting recommended groups:', error);
            return [] as IGroup[];
        }
    }

    /**
     * Get members of a group
     */
    public async getMembers(groupId: string): Promise<IMemberGroup[]> {
        try {
            const result = await apiGroupService.getMembers(groupId, {
                page: 1,
                page_size: 20,
            });
            return result.data as IMemberGroup[];
        } catch (error) {
            console.error('Error getting group members:', error);
            return [] as IMemberGroup[];
        }
    }

    /**
     * Update cover photo
     */
    public async updateCoverPhoto({
        groupId,
        coverPhoto,
        path,
    }: {
        groupId: string;
        coverPhoto: string;
        path: string;
    }) {
        try {
            return await apiGroupService.updateCoverPhoto(groupId, coverPhoto);
        } catch (error) {
            console.error('Error updating cover photo:', error);
            throw error;
        }
    }

    /**
     * Update avatar
     */
    public async updateAvatar({
        groupId,
        avatarId,
        path,
    }: {
        groupId: string;
        avatarId: string;
        path: string;
    }) {
        try {
            return await apiGroupService.updateAvatar(groupId, avatarId);
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * Update group
     */
    public async update({
        groupId,
        name,
        description,
        type,
        path,
    }: {
        groupId: string;
        name: string;
        description: string;
        type: string;
        path?: string;
    }) {
        try {
            const payload: Partial<IGroup> = {
                name,
                description,
                type,
            };
            return await apiGroupService.update(groupId, payload);
        } catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    }

    /**
     * Join a group
     */
    public async join({
        groupId,
        userId,
    }: {
        groupId: string;
        userId: string;
    }) {
        try {
            // server uses authenticated user; userId not required
            return await apiGroupService.join(groupId);
        } catch (error) {
            console.error('Error joining group:', error);
            throw error;
        }
    }

    /**
     * Leave a group
     */
    public async leave({
        groupId,
        userId,
        path,
    }: {
        groupId: string;
        userId: string;
        path?: string;
    }) {
        try {
            // server uses authenticated user; userId not required
            return await apiGroupService.leave(groupId);
        } catch (error) {
            console.error('Error leaving group:', error);
            throw error;
        }
    }

    /**
     * Delete a group
     */
    public async delete(groupId: string) {
        try {
            await apiGroupService.delete(groupId);
            return true;
        } catch (error) {
            console.error('Error deleting group:', error);
            throw error;
        }
    }

    /**
     * Admin/creator: add a member to the group
     */
    public async addMember(groupId: string, userId: string) {
        try {
            return await apiGroupService.addMember(groupId, userId);
        } catch (error) {
            console.error('Error adding member:', error);
            throw error;
        }
    }

    /**
     * Admin/creator: remove a member from the group
     */
    public async removeMember(groupId: string, userId: string) {
        try {
            return await apiGroupService.removeMember(groupId, userId);
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }

    /**
     * Admin/creator: update a member's role
     */
    public async updateMemberRole(
        groupId: string,
        userId: string,
        role: 'ADMIN' | 'MEMBER'
    ) {
        try {
            return await apiGroupService.updateMemberRole(
                groupId,
                userId,
                role
            );
        } catch (error) {
            console.error('Error updating member role:', error);
            throw error;
        }
    }
}

const GroupService = new GroupServiceClass();
export default GroupService;
