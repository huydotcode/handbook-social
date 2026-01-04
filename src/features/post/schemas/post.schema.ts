import { z } from 'zod';

// Create post validation
export const createPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
    files: z.array(z.any()).optional(),
    tags: z.array(z.string().min(1, 'Tag không được để trống')).optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;

// Edit post validation
export const editPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
    files: z.array(z.any()).optional(),
    tags: z.array(z.string().min(1, 'Tag không được để trống')).optional(),
});

export type EditPostValidation = z.infer<typeof editPostValidation>;
