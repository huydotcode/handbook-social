import toast from 'react-hot-toast';
import { uploadService } from './api/services/upload.service';
import { IMedia } from '@/types/entites';

/**
 * Upload images from base64 strings (deprecated - use uploadService directly)
 * @deprecated This function is kept for backward compatibility
 */
export const uploadImages = async ({
    photos,
}: {
    photos: string[];
}): Promise<string[]> => {
    // Note: This function uploads base64 strings, which is not supported by REST API
    // Consider migrating to use File objects with uploadService instead
    toast.error(
        'Upload từ base64 không còn được hỗ trợ. Vui lòng sử dụng File objects.'
    );
    throw new Error('Upload từ base64 không còn được hỗ trợ');
};

/**
 * Upload a single image or video file
 * Uses REST API uploadService
 */
export const uploadImageWithFile = async ({
    file,
}: {
    file: File;
}): Promise<IMedia> => {
    if (file.size > 100 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 100MB!');
        throw new Error('File quá lớn');
    }

    const type = file.type.split('/')[0];

    try {
        switch (type) {
            case 'image':
                return await uploadService.uploadImage(file);
            case 'video':
                return await uploadService.uploadVideo(file);
            default:
                throw new Error('Không hỗ trợ định dạng file này');
        }
    } catch (error: any) {
        toast.error(error.message || 'Lỗi khi tải lên file');
        throw error;
    }
};

/**
 * Upload multiple image or video files
 * Uses REST API uploadService
 */
export const uploadImagesWithFiles = async ({
    files,
}: {
    files: File[];
}): Promise<IMedia[]> => {
    const uploadTasks = Array.from(files || []).map(async (file) => {
        if (file.size > 100 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 100MB!');
            throw new Error('File quá lớn');
        }

        const type = file.type.split('/')[0];

        // Validate file count limits
        const imageFiles = files.filter((f) => f.type.startsWith('image/'));
        const videoFiles = files.filter((f) => f.type.startsWith('video/'));

        if (type === 'image' && imageFiles.length > 10) {
            toast.error('Bạn chỉ có thể tải lên tối đa 10 hình ảnh!');
            throw new Error('Vượt quá số lượng ảnh cho phép');
        }

        if (type === 'video' && videoFiles.length > 5) {
            toast.error('Bạn chỉ có thể tải lên tối đa 5 video!');
            throw new Error('Vượt quá số lượng video cho phép');
        }

        try {
            switch (type) {
                case 'image':
                    return await uploadService.uploadImage(file);
                case 'video':
                    return await uploadService.uploadVideo(file);
                default:
                    throw new Error('Không hỗ trợ định dạng file này');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi tải lên file');
            throw error;
        }
    });

    const results = await Promise.allSettled(uploadTasks);

    return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<IMedia>).value);
};
