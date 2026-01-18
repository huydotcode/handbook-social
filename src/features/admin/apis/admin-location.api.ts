import { LocationService } from '@/features/location';
import { AdminQueryParams } from '../types/admin.types';

export const locationAdminApi = {
    /**
     * Get all locations (Admin)
     */
    getLocations: (params?: AdminQueryParams) => {
        return LocationService.getAll();
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
};
