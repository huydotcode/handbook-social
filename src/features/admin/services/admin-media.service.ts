import { mediaAdminApi } from '../apis/admin-media.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminMediaServiceClass {
    /**
     * Get all medias (Admin)
     */
    async getMedias(params?: AdminQueryParams) {
        return mediaAdminApi.getMedias(params);
    }

    /**
     * Delete media (Admin)
     */
    async deleteMedia(mediaId: string) {
        return mediaAdminApi.deleteMedia(mediaId);
    }
}

export const AdminMediaService = new AdminMediaServiceClass();
