import { handleApiError, showSuccessToast } from '@/shared';
import { useMutation } from '@tanstack/react-query';
import { UploadService } from '../services/upload.service';

/**
 * Hook to upload an image
 */
export const useUploadImage = () => {
    return useMutation({
        mutationFn: ({
            file,
            onProgress,
        }: {
            file: File;
            onProgress?: (progress: number) => void;
        }) => UploadService.uploadImage(file, onProgress),
        onSuccess: () => {
            showSuccessToast('Upload ảnh thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể upload ảnh');
        },
    });
};

/**
 * Hook to upload a video
 */
export const useUploadVideo = () => {
    return useMutation({
        mutationFn: ({
            file,
            onProgress,
        }: {
            file: File;
            onProgress?: (progress: number) => void;
        }) => UploadService.uploadVideo(file, onProgress),
        onSuccess: () => {
            showSuccessToast('Upload video thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể upload video');
        },
    });
};
