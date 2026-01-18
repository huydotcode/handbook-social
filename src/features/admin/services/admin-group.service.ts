import { groupAdminApi } from '../apis/admin-group.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminGroupServiceClass {
    /**
     * Get all groups (Admin)
     */
    async getGroups(params?: AdminQueryParams) {
        return groupAdminApi.getGroups(params);
    }
}

export const AdminGroupService = new AdminGroupServiceClass();
