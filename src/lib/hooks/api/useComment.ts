import type {
    CreateCommentDto,
    UpdateCommentDto,
} from '@/lib/api/services/comment.service';
import { commentService } from '@/lib/api/services/comment.service';
import { queryKey } from '@/lib/queryKey';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * Hook to get a comment by ID
 */
export const useComment = (
    commentId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['comment', commentId],
        queryFn: () => commentService.getById(commentId),
        enabled: options?.enabled !== false && !!commentId,
    });
};

/**
 * Hook to get comments by post (infinite query)
 */
export const useCommentsByPost = (
    postId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.posts.comments(postId),
        queryFn: ({ pageParam = 1 }) =>
            commentService.getByPost(postId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: (lastPage, allPages) => {
            // If lastPage has items equal to pageSize, there might be more pages
            // Note: The API returns paginated response but apiClient extracts only data array
            // This is a simple heuristic - if we get a full page, assume there's more
            if (Array.isArray(lastPage) && lastPage.length === pageSize) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!postId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get comment count by post
 */
export const useCommentCount = (
    postId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.posts.comments(postId),
        queryFn: () => commentService.getCountByPost(postId),
        enabled: options?.enabled !== false && !!postId,
        select: (data) => data.count,
    });
};

/**
 * Hook to get reply comments (infinite query)
 */
export const useReplyComments = (
    commentId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.posts.replyComments(commentId),
        queryFn: ({ pageParam = 1 }) =>
            commentService.getReplies(commentId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: (lastPage, allPages) => {
            // If lastPage has items equal to pageSize, there might be more pages
            // Note: The API returns paginated response but apiClient extracts only data array
            // This is a simple heuristic - if we get a full page, assume there's more
            if (Array.isArray(lastPage) && lastPage.length === pageSize) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!commentId,
        initialPageParam: 1,
    });
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCommentDto) => commentService.create(data),
        onSuccess: (data, variables) => {
            // Invalidate comments list
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(variables.post),
            });
            // Invalidate comment count
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(variables.post),
            });
            // Update cache
            queryClient.setQueryData(['comment', data._id], data);
            toast.success('Bình luận thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể bình luận');
        },
    });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommentDto }) =>
            commentService.update(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(['comment', variables.id], data);
            toast.success('Cập nhật bình luận thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể cập nhật bình luận');
        },
    });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => commentService.delete(commentId),
        onSuccess: (_, commentId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: ['comment', commentId] });
            // Invalidate comments lists
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(undefined),
            });
            toast.success('Xóa bình luận thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể xóa bình luận');
        },
    });
};

/**
 * Hook to add love to a comment
 */
export const useAddCommentLove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => commentService.addLove(commentId),
        onSuccess: (data, commentId) => {
            // Update cache
            queryClient.setQueryData(['comment', commentId], data);
            toast.success('Đã thích bình luận');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể thích bình luận');
        },
    });
};

/**
 * Hook to remove love from a comment
 */
export const useRemoveCommentLove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => commentService.removeLove(commentId),
        onSuccess: (data, commentId) => {
            // Update cache
            queryClient.setQueryData(['comment', commentId], data);
            toast.success('Đã bỏ thích bình luận');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể bỏ thích bình luận');
        },
    });
};
