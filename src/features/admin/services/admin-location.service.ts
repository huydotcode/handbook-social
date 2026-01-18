import { locationAdminApi } from '../apis/admin-location.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminLocationServiceClass {
    /**
     * Get all locations (Admin)
     */
    async getLocations(params?: AdminQueryParams) {
        return locationAdminApi.getLocations(params);
    }

    /**
     * Create location (Admin)
     */
    async createLocation(data: {
        name: string;
        slug: string;
        type: string;
        nameWithType: string;
        code: string;
    }) {
        return locationAdminApi.createLocation(data);
    }
}

export const AdminLocationService = new AdminLocationServiceClass();
