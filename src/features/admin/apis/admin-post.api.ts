import { postApi } from '@/features/post';
import { AdminQueryParams } from '../types/admin.types';

export const postAdminApi = {
    /**
     * Get all posts (Admin)
     */
    getPosts: (params?: AdminQueryParams) => {
        return postApi.getAll(params);
    },
};
