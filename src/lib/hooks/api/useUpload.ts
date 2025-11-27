import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/lib/api/services/upload.service';
import {
    handleApiError,
    showSuccessToast,
} from '../utils';

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
        }) => uploadService.uploadImage(file, onProgress),
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
        }) => uploadService.uploadVideo(file, onProgress),
        onSuccess: () => {
            showSuccessToast('Upload video thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể upload video');
        },
    });
};
