import { userAdminApi } from '../apis/admin-user.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminUserServiceClass {
    /**
     * Get all users (Admin)
     */
    async getUsers(params?: AdminQueryParams) {
        return userAdminApi.getUsers(params);
    }
}

export const AdminUserService = new AdminUserServiceClass();
