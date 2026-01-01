import { CategoryService } from '@/features/category';
import { UserService } from '@/features/user';
import { IGroup, IMedia } from '@/types/entites';
import { locationService } from './location.service';
import { postService } from './post.service';

export interface AdminQueryParams {
    page?: number;
    page_size?: number;
    limit?: number;
}

export const adminService = {
    /**
     * Get all users (Admin)
     */
    getUsers: (params?: AdminQueryParams) => {
        return UserService.getAll(params);
    },

    /**
     * Get all posts (Admin)
     */
    getPosts: (params?: AdminQueryParams) => {
        return postService.getAll(params);
    },

    /**
     * Get all groups (Admin)
     * TODO: Server API needs GET /groups endpoint (not just joined)
     */
    getGroups: (params?: AdminQueryParams) => {
        // TODO: Implement admin getGroups endpoint
        // GET /groups (admin only)
        console.warn('admin getGroups not yet implemented via REST API');
        return Promise.resolve([] as IGroup[]);
    },

    /**
     * Get all locations (Admin)
     */
    getLocations: (params?: AdminQueryParams) => {
        return locationService.getAll();
    },

    /**
     * Create location (Admin)
     * TODO: Server API needs POST /locations endpoint
     */
    createLocation: (data: {
        name: string;
        slug: string;
        type: string;
        nameWithType: string;
        code: string;
    }) => {
        // TODO: Implement createLocation endpoint in server-api
        // POST /locations
        console.warn('createLocation not yet implemented via REST API');
        throw new Error(
            'Create location endpoint not yet implemented in REST API'
        );
    },

    /**
     * Get all categories (Admin)
     */
    getCategories: (params?: AdminQueryParams) => {
        return CategoryService.getAll(params);
    },

    /**
     * Get all medias (Admin)
     * TODO: Server API needs GET /medias endpoint
     */
    getMedias: (params?: AdminQueryParams) => {
        // TODO: Implement admin getMedias endpoint
        // GET /medias (admin only)
        console.warn('admin getMedias not yet implemented via REST API');
        return Promise.resolve([] as IMedia[]);
    },

    /**
     * Delete media (Admin)
     * TODO: Server API needs DELETE /medias/:id endpoint
     */
    deleteMedia: (mediaId: string) => {
        // TODO: Implement deleteMedia endpoint in server-api
        // DELETE /medias/:id
        console.warn('deleteMedia not yet implemented via REST API');
        throw new Error(
            'Delete media endpoint not yet implemented in REST API'
        );
    },
};
