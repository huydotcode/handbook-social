import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { categoryService } from '@/lib/api/services/category.service';
import { queryKey } from '@/lib/queryKey';
import type {
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryQueryParams,
    CategorySearchParams,
} from '@/lib/api/services/category.service';
import toast from 'react-hot-toast';

/**
 * Hook to get all categories (paginated)
 */
export const useCategories = (params?: CategoryQueryParams) => {
    return useQuery({
        queryKey: queryKey.categories.list(),
        queryFn: () => categoryService.getAll(params),
    });
};

/**
 * Hook to get all categories (not paginated)
 */
export const useAllCategories = () => {
    return useQuery({
        queryKey: queryKey.categories.all(),
        queryFn: () => categoryService.getAllCategories(),
    });
};

/**
 * Hook to search categories (infinite query)
 */
export const useSearchCategories = (
    searchParams: CategorySearchParams,
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: ['categories', 'search', searchParams.q],
        queryFn: ({ pageParam = 1 }) =>
            categoryService.search({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
    });
};

/**
 * Hook to get category by slug
 */
export const useCategoryBySlug = (
    slug: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.categories.bySlug(slug),
        queryFn: () => categoryService.getBySlug(slug),
        enabled: options?.enabled !== false && !!slug,
    });
};

/**
 * Hook to get category by ID
 */
export const useCategory = (
    categoryId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.categories.byId(categoryId),
        queryFn: () => categoryService.getById(categoryId),
        enabled: options?.enabled !== false && !!categoryId,
    });
};

/**
 * Hook to create a category (Admin only)
 */
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
        onSuccess: () => {
            // Invalidate categories list
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.list(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.all(),
            });
            toast.success('Tạo danh mục thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể tạo danh mục');
        },
    });
};

/**
 * Hook to update a category (Admin only)
 */
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
            categoryService.update(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.categories.byId(variables.id),
                data
            );
            // Invalidate lists
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.list(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.all(),
            });
            toast.success('Cập nhật danh mục thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể cập nhật danh mục');
        },
    });
};

/**
 * Hook to delete a category (Admin only)
 */
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: string) => categoryService.delete(categoryId),
        onSuccess: (_, categoryId) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: queryKey.categories.byId(categoryId),
            });
            // Invalidate lists
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.list(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.categories.all(),
            });
            toast.success('Xóa danh mục thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể xóa danh mục');
        },
    });
};
