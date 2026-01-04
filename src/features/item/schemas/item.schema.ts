import { z } from 'zod';

export const createItemValidation = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    price: z.string().regex(/^\d+$/, 'Giá tiền không hợp lệ'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    category: z.string().min(1, 'Danh mục không được để trống'),
    location: z.string().min(1, 'Địa điểm không được để trống'),
    images: z.array(z.any()).nonempty(),
});

export type CreateItemValidation = z.infer<typeof createItemValidation>;
