import { userAdminApi } from '../apis/admin-user.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminUserServiceClass {
    /**
     * Get all users (Admin)
     */
    async getUsers(params?: AdminQueryParams) {
        return userAdminApi.getUsers(params);
    }

    async blockUser(userId: string) {
        return userAdminApi.blockUser(userId);
    }

    async unblockUser(userId: string) {
        return userAdminApi.unblockUser(userId);
    }

    async updateRole(userId: string, role: string) {
        return userAdminApi.updateRole(userId, role);
    }
}

export const AdminUserService = new AdminUserServiceClass();
