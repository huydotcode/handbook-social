import { fileSchema } from '@/shared/schemas/common.schema';
import { z } from 'zod';

// Create group validation
export const createGroupValidation = z.object({
    name: z.string().min(1, 'Tên nhóm không được để trống'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    type: z.string().optional(),
    file: fileSchema.optional(),
});

export type CreateGroupValidation = z.infer<typeof createGroupValidation>;
