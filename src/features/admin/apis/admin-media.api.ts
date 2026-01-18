import { IMedia } from '@/types/entites';
import { AdminQueryParams } from '../types/admin.types';

export const mediaAdminApi = {
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
