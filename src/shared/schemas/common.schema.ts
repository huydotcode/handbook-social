import { ALLOWED_TYPE_IMAGES, ALLOWED_TYPE_VIDEOS } from '@/shared/constants';
import { z } from 'zod';

export const fileSchema = z
    .custom<File>((val) => val instanceof File, {
        message: 'Vui lòng chọn một tệp hợp lệ',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'Tệp không được lớn hơn 5MB',
    })
    .refine((file) => ALLOWED_TYPE_IMAGES.includes(file.type), {
        message: 'Chỉ cho phép ảnh định dạng JPG, PNG hoặc WEBP',
    });

export const videoSchema = z
    .custom<File>((val) => val instanceof File, {
        message: 'Vui lòng chọn một tệp video hợp lệ',
    })
    .refine((file) => file.size <= 50 * 1024 * 1024, {
        message: 'Video không được lớn hơn 50MB',
    })
    .refine((file) => ALLOWED_TYPE_VIDEOS.includes(file.type), {
        message: 'Chỉ cho phép video định dạng MP4, WEBM hoặc MOV',
    });
