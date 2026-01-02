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
import CommentService from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto } from '../types/comment.type';

/**
 * Hook to get a comment by ID
 */
export const useComment = (
    commentId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.comments.id(commentId),
        queryFn: () => CommentService.getById(commentId),
        enabled: options?.enabled !== false && !!commentId,
        ...defaultInfiniteQueryOptions,
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
            CommentService.getByPost(postId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!postId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
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
        queryFn: () => CommentService.getCountByPost(postId),
        enabled: options?.enabled !== false && !!postId,
        select: (data) => data.count,
        ...defaultQueryOptions,
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
            CommentService.getReplies(commentId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!commentId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCommentDto) => CommentService.create(data),
        onSuccess: (data, variables) => {
            // Invalidate comments list and count
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(variables.post),
            });
            // Update cache
            queryClient.setQueryData(queryKey.comments.id(data._id), data);
            showSuccessToast('Bình luận thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể bình luận');
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
            CommentService.update(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(queryKey.comments.id(variables.id), data);
            showSuccessToast('Cập nhật bình luận thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể cập nhật bình luận');
        },
    });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => CommentService.delete(commentId),
        onSuccess: (_, commentId) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: queryKey.comments.id(commentId),
            });
            // Invalidate comments lists
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(undefined),
            });
            showSuccessToast('Xóa bình luận thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa bình luận');
        },
    });
};

/**
 * Hook to add love to a comment
 */
export const useAddCommentLove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => CommentService.love(commentId),
        onSuccess: (data, commentId) => {
            // Update cache
            queryClient.setQueryData(queryKey.comments.id(commentId), data);
            showSuccessToast('Đã thích bình luận');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể thích bình luận');
        },
    });
};

/**
 * Hook to remove love from a comment
 */
export const useRemoveCommentLove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => CommentService.removeLove(commentId),
        onSuccess: (data, commentId) => {
            // Update cache
            queryClient.setQueryData(queryKey.comments.id(commentId), data);
            showSuccessToast('Đã bỏ thích bình luận');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể bỏ thích bình luận');
        },
    });
};
