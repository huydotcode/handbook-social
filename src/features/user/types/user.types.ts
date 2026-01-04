import type { IProfile, IMedia, IUser } from '@/types/entites';

export interface UserQueryParams {
    page?: number;
    page_size?: number;
}

export interface IGetUserProfileResponse extends IProfile {
    user: IUser;
    coverPhoto: string;
    work: string;
    education: string;
    location: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateAvatarDto {
    avatar: string;
}

export interface UpdateCoverPhotoDto {
    coverPhoto: string;
}

export interface UpdateBioDto {
    bio: string;
}

export interface UpdateProfileDto extends Partial<IProfile> {
    work?: string;
    education?: string;
    location?: string;
    dateOfBirth?: Date;
}

export interface GetProfilePicturesResponse extends Array<IMedia> {}
