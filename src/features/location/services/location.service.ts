import { ILocation } from '@/types/entites';
import { locationApi } from '../apis/location.api';

class LocationServiceClass {
    /**
     * Get all locations
     */
    async getAll(): Promise<ILocation[]> {
        try {
            const locations = await locationApi.getAll();
            return locations;
        } catch (error) {
            console.error('Error getting locations:', error);
            return [];
        }
    }
}

export const LocationService = new LocationServiceClass();
