import { UserService } from '@/features/user';
import { ILocation, IMedia, IUser } from '@/types/entites';
import { locationService as apiLocationService } from '../api/services/location.service';

export interface IGetUserProfileResponse {
    _id: string;
    bio: string;
    user: IUser;
    coverPhoto: string;
    work: string;
    education: string;
    location: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
}

class ProfileServiceClass {
    /**
     * Get profile by user ID
     */
    async getByUserId(userId: string): Promise<IGetUserProfileResponse | null> {
        try {
            const data = await UserService.getProfile(userId);
            if (!data) return null;
            return data;
        } catch (error) {
            console.error('Error getting profile by user ID:', error);
            return null;
        }
    }

    /**
     * Update bio
     */
    async updateBio({
        newBio,
        userId,
    }: {
        userId: string;
        newBio: string;
    }): Promise<boolean> {
        try {
            const response = await UserService.updateBio(userId, {
                bio: newBio,
            });
            return response.success;
        } catch (error) {
            console.error('Error updating bio:', error);
            throw error;
        }
    }

    /**
     * Get profile pictures
     */
    async getProfilePicturesAction(userId: string): Promise<IMedia[]> {
        try {
            const data = await UserService.getProfilePictures(userId);
            return data;
        } catch (error) {
            console.error('Error getting profile pictures:', error);
            return [];
        }
    }

    /**
     * Update profile info
     */
    async updateInfo({
        userId,
        dateOfBirth,
        education,
        location,
        work,
    }: {
        userId: string;
        work: string;
        education: string;
        location: string;
        dateOfBirth: Date;
    }): Promise<boolean> {
        try {
            const data = await UserService.updateProfile(userId, {
                work,
                education,
                location,
                dateOfBirth,
            });
            return !!data;
        } catch (error) {
            console.error('Error updating profile info:', error);
            throw error;
        }
    }

    /**
     * Get locations using REST API
     */
    async getLocations(): Promise<ILocation[]> {
        try {
            const data = await apiLocationService.getAll();
            return data;
        } catch (error) {
            console.error('Error getting locations:', error);
            return [];
        }
    }

    /**
     * Update avatar
     */
    async updateAvatar({
        userId,
        avatar,
    }: {
        userId: string;
        avatar: string;
    }): Promise<boolean> {
        try {
            const data = await UserService.updateAvatar(userId, { avatar });
            return data.success;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * Update cover photo
     */
    async updateCoverPhoto({
        userId,
        coverPhoto,
    }: {
        userId: string;
        coverPhoto: string;
    }): Promise<boolean> {
        try {
            const data = await UserService.updateCoverPhoto(userId, {
                coverPhoto,
            });

            return data.success;
        } catch (error) {
            console.error('Error updating cover photo:', error);
            throw error;
        }
    }
}

const ProfileService = new ProfileServiceClass();
export default ProfileService;
