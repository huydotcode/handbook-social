import { IMedia } from '@/types/entites';
import { uploadApi } from '../apis/upload.api';

class UploadServiceClass {
    /**
     * Upload image
     */
    async uploadImage(
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<IMedia> {
        try {
            const media = await uploadApi.uploadImage(file, onProgress);
            return media;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    /**
     * Upload video
     */
    async uploadVideo(
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<IMedia> {
        try {
            const media = await uploadApi.uploadVideo(file, onProgress);
            return media;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    }
}

export const UploadService = new UploadServiceClass();
