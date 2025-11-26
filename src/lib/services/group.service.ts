import { groupService as apiGroupService } from '../api/services/group.service';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface IGroupService {
    create: ({
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
        members: string[];
    }) => Promise<IGroup>;
    getById: (groupId: string) => Promise<IGroup>;
    getByUserId: ({
        userId,
        page,
        pageSize,
    }: {
        userId: string;
        page: number;
        pageSize: number;
    }) => Promise<IGroup[]>;
    getRecommendedGroups: (userId: string) => Promise<IGroup[]>;
    getMembers: (groupId: string) => Promise<IMemberGroup[]>;

    updateCoverPhoto: ({
        groupId,
        coverPhoto,
        path,
    }: {
        groupId: string;
        coverPhoto: string;
        path: string;
    }) => Promise<void>;
    updateAvatar: ({
        groupId,
        avatarId,
        path,
    }: {
        groupId: string;
        avatarId: string;
        path: string;
    }) => Promise<void>;
    update: ({
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
    }) => Promise<void>;

    join: ({
        groupId,
        userId,
    }: {
        groupId: string;
        userId: string;
    }) => Promise<void>;
    leave: ({
        groupId,
        userId,
        path,
    }: {
        groupId: string;
        userId: string;
        path?: string;
    }) => Promise<void>;
    delete: (groupId: string) => Promise<void>;
}

class GroupServiceClass implements IGroupService {
    /**
     * Create a new group
     * TODO: Server API needs POST /groups endpoint
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
        members: string[];
    }) {
        // TODO: Implement create group endpoint in server-api
        // POST /groups
        console.warn('create group not yet implemented via REST API');
        throw new Error('Create group endpoint not yet implemented in REST API');
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
     * TODO: Server API needs GET /groups/recommended endpoint
     */
    public async getRecommendedGroups(userId: string) {
        // TODO: Implement getRecommendedGroups endpoint in server-api
        // GET /groups/recommended?user_id=:userId
        console.warn('getRecommendedGroups not yet implemented via REST API');
        return [] as IGroup[];
    }

    /**
     * Get members of a group
     * TODO: Server API needs GET /groups/:id/members endpoint
     */
    public async getMembers(groupId: string): Promise<IMemberGroup[]> {
        // TODO: Implement getMembers endpoint in server-api
        // GET /groups/:id/members
        console.warn('getMembers not yet implemented via REST API');
        return [] as IMemberGroup[];
    }

    /**
     * Update cover photo
     * TODO: Server API needs PUT /groups/:id/cover-photo endpoint
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
        // TODO: Implement updateCoverPhoto endpoint in server-api
        // PUT /groups/:id/cover-photo
        console.warn('updateCoverPhoto not yet implemented via REST API');
        throw new Error('Update cover photo endpoint not yet implemented in REST API');
    }

    /**
     * Update avatar
     * TODO: Server API needs PUT /groups/:id/avatar endpoint
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
        // TODO: Implement updateAvatar endpoint in server-api
        // PUT /groups/:id/avatar
        console.warn('updateAvatar not yet implemented via REST API');
        throw new Error('Update avatar endpoint not yet implemented in REST API');
    }

    /**
     * Update group
     * TODO: Server API needs PUT /groups/:id endpoint
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
        // TODO: Implement update group endpoint in server-api
        // PUT /groups/:id
        console.warn('update group not yet implemented via REST API');
        throw new Error('Update group endpoint not yet implemented in REST API');
    }

    /**
     * Join a group
     * TODO: Server API needs POST /groups/:id/join endpoint
     */
    public async join({
        groupId,
        userId,
    }: {
        groupId: string;
        userId: string;
    }) {
        // TODO: Implement join group endpoint in server-api
        // POST /groups/:id/join
        console.warn('join group not yet implemented via REST API');
        throw new Error('Join group endpoint not yet implemented in REST API');
    }

    /**
     * Leave a group
     * TODO: Server API needs POST /groups/:id/leave endpoint
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
        // TODO: Implement leave group endpoint in server-api
        // POST /groups/:id/leave
        console.warn('leave group not yet implemented via REST API');
        throw new Error('Leave group endpoint not yet implemented in REST API');
    }

    /**
     * Delete a group
     * TODO: Server API needs DELETE /groups/:id endpoint
     */
    public async delete(groupId: string) {
        // TODO: Implement delete group endpoint in server-api
        // DELETE /groups/:id
        console.warn('delete group not yet implemented via REST API');
        throw new Error('Delete group endpoint not yet implemented in REST API');
    }
}

const GroupService = new GroupServiceClass();
export default GroupService;
