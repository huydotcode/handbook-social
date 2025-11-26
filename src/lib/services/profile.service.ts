import { locationService as apiLocationService } from '../api/services/location.service';

class ProfileServiceClass {
    /**
     * Get profile by user ID
     * TODO: Server API needs GET /users/:id/profile endpoint
     */
    async getByUserId(userId: string): Promise<IProfile | null> {
        // TODO: Implement getByUserId endpoint in server-api
        // GET /users/:id/profile
        console.warn('getByUserId profile not yet implemented via REST API');
        return null;
    }

    /**
     * Update bio
     * TODO: Server API needs PUT /users/:id/bio endpoint
     */
    async updateBio({
        newBio,
        path,
        userId,
    }: {
        userId: string;
        newBio: any;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement updateBio endpoint in server-api
        // PUT /users/:id/bio
        console.warn('updateBio not yet implemented via REST API');
        throw new Error('Update bio endpoint not yet implemented in REST API');
    }

    /**
     * Get profile pictures
     * TODO: Server API needs GET /users/:id/pictures endpoint
     */
    async getProfilePicturesAction(userId: string): Promise<IMedia[]> {
        // TODO: Implement getProfilePictures endpoint in server-api
        // GET /users/:id/pictures
        console.warn(
            'getProfilePicturesAction not yet implemented via REST API'
        );
        return [];
    }

    /**
     * Update profile info
     * TODO: Server API needs PUT /users/:id/profile endpoint
     */
    async updateInfo({
        profileId,
        dateOfBirth,
        education,
        location,
        work,
        path,
    }: {
        profileId: string;
        work: string;
        education: string;
        location: string;
        dateOfBirth: Date;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement updateInfo endpoint in server-api
        // PUT /users/:id/profile
        console.warn('updateInfo not yet implemented via REST API');
        throw new Error(
            'Update profile info endpoint not yet implemented in REST API'
        );
    }

    /**
     * Get locations using REST API
     */
    async getLocations(): Promise<ILocation[]> {
        try {
            return await apiLocationService.getAll();
        } catch (error) {
            console.error('Error getting locations:', error);
            return [];
        }
    }

    /**
     * Update avatar
     * TODO: Server API needs PUT /users/:id/avatar endpoint
     */
    async updateAvatar({
        userId,
        avatar,
        path,
    }: {
        userId: string;
        avatar: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement updateAvatar endpoint in server-api
        // PUT /users/:id/avatar
        console.warn('updateAvatar not yet implemented via REST API');
        throw new Error(
            'Update avatar endpoint not yet implemented in REST API'
        );
    }

    /**
     * Update cover photo
     * TODO: Server API needs PUT /users/:id/cover-photo endpoint
     */
    async updateCoverPhoto({
        userId,
        coverPhoto,
        path,
    }: {
        userId: string;
        coverPhoto: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement updateCoverPhoto endpoint in server-api
        // PUT /users/:id/cover-photo
        console.warn('updateCoverPhoto not yet implemented via REST API');
        throw new Error(
            'Update cover photo endpoint not yet implemented in REST API'
        );
    }
}

const ProfileService = new ProfileServiceClass();
export default ProfileService;
