import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/lib/api/services/upload.service';
import toast from 'react-hot-toast';

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
            toast.success('Upload ảnh thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể upload ảnh');
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
            toast.success('Upload video thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể upload video');
        },
    });
};
