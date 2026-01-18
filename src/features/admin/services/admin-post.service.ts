import { postAdminApi } from '../apis/admin-post.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminPostServiceClass {
    /**
     * Get all posts (Admin)
     */
    async getPosts(params?: AdminQueryParams) {
        return postAdminApi.getPosts(params);
    }
}

export const AdminPostService = new AdminPostServiceClass();
