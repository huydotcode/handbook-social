import { queryKey } from '@/lib/react-query/query-key';
import {
    createGetNextPageParam,
    defaultInfiniteQueryOptions,
    defaultQueryOptions,
} from '@/lib/react-query';
import { handleApiError, showSuccessToast } from '@/shared';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { ItemService } from '../services/item.service';
import { ItemSearchParams } from '../types/item.types';

/**
 * Hook to get all items (infinite query)
 */
export const useItems = (params?: { pageSize?: number }) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.list({ pageSize }),
        queryFn: ({ pageParam = 1 }) =>
            ItemService.getAll({
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to search items (infinite query)
 */
export const useSearchItems = (
    searchParams: ItemSearchParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.search(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            ItemService.search({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to get items by seller (infinite query)
 */
export const useItemsBySeller = (
    sellerId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.bySeller(sellerId),
        queryFn: ({ pageParam = 1 }) => ItemService.getBySeller(sellerId),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!sellerId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to get item by ID
 */
export const useItem = (itemId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: queryKey.items.byId(itemId),
        queryFn: () => ItemService.getById(itemId),
        enabled: options?.enabled !== false && !!itemId,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to create an item
 */
export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => ItemService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.items.list({}),
            });
            showSuccessToast('Đăng bán sản phẩm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể đăng bán sản phẩm');
        },
    });
};

/**
 * Hook to update an item
 */
export const useUpdateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            ...data
        }: {
            itemId: string;
            [key: string]: any;
        }) => ItemService.update({ itemId, ...data }),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                queryKey.items.byId(variables.itemId),
                data
            );
            queryClient.invalidateQueries({
                queryKey: queryKey.items.list({}),
            });
            showSuccessToast('Cập nhật sản phẩm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể cập nhật sản phẩm');
        },
    });
};

/**
 * Hook to delete an item
 */
export const useDeleteItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => ItemService.delete({ itemId }),
        onSuccess: (_, itemId) => {
            queryClient.removeQueries({
                queryKey: queryKey.items.byId(itemId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.items.list({}),
            });
            showSuccessToast('Xóa sản phẩm thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa sản phẩm');
        },
    });
};
