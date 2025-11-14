import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { postService } from '@/lib/api/services/post.service';
import { queryKey } from '@/lib/queryKey';
import type {
    CreatePostDto,
    UpdatePostDto,
    PostQueryParams,
} from '@/lib/api/services/post.service';
import toast from 'react-hot-toast';

/**
 * Hook to get a single post by ID
 */
export const usePost = (postId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: queryKey.posts.id(postId),
        queryFn: () => postService.getById(postId),
        enabled: options?.enabled !== false && !!postId,
    });
};

/**
 * Hook to get all posts
 */
export const usePosts = (params?: PostQueryParams) => {
    return useQuery({
        queryKey: queryKey.posts.all(),
        queryFn: () => postService.getAll(params),
    });
};

/**
 * Hook to get new feed posts (infinite query)
 */
export const useNewFeedPosts = (params?: { pageSize?: number }) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'new-feed',
            userId: undefined,
            groupId: undefined,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getNewFeed({
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            // Check if API returns pagination in meta
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};

/**
 * Hook to get new feed group posts (infinite query)
 */
export const useNewFeedGroupPosts = (params?: { pageSize?: number }) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'new-feed-group',
            userId: undefined,
            groupId: undefined,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getNewFeedGroup({
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};

/**
 * Hook to get new feed friend posts (infinite query)
 */
export const useNewFeedFriendPosts = (params?: { pageSize?: number }) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'new-feed-friend',
            userId: undefined,
            groupId: undefined,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getNewFeedFriend({
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};

/**
 * Hook to get saved posts (infinite query)
 */
export const useSavedPosts = (
    userId?: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.saved(userId),
        queryFn: ({ pageParam = 1 }) =>
            postService.getSaved({
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!userId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get profile posts (infinite query)
 */
export const useProfilePosts = (
    userId: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'profile',
            userId,
            groupId: undefined,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getProfilePosts(userId, {
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!userId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get group posts (infinite query)
 */
export const useGroupPosts = (
    groupId: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'group',
            userId: undefined,
            groupId,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getGroupPosts(groupId, {
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!groupId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get manage group posts (infinite query)
 */
export const useManageGroupPosts = (
    groupId: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'manage-group-posts',
            userId: undefined,
            groupId,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getManageGroupPosts(groupId, {
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!groupId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get manage group posts pending (infinite query)
 */
export const useManageGroupPostsPending = (
    groupId: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'manage-group-posts-pending',
            userId: undefined,
            groupId,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getManageGroupPostsPending(groupId, {
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!groupId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get posts by member in a group (infinite query)
 */
export const usePostByMember = (
    groupId: string,
    userId: string,
    params?: { pageSize?: number }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            type: 'group-member',
            userId,
            groupId,
            username: undefined,
        }),
        queryFn: ({ pageParam = 1 }) =>
            postService.getPostByMember(groupId, userId, {
                page: pageParam,
                page_size: params?.pageSize || 3,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: !!groupId && !!userId,
        initialPageParam: 1,
    });
};

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostDto) => postService.create(data),
        onSuccess: (data) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: queryKey.posts.all() });
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.newFeed({ type: 'new-feed' }),
            });
            // Update cache with new post
            queryClient.setQueryData(queryKey.posts.id(data._id), data);
            toast.success('Đăng bài thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể đăng bài');
        },
    });
};

/**
 * Hook to update a post
 */
export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) =>
            postService.update(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(queryKey.posts.id(variables.id), data);
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: queryKey.posts.all() });
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.newFeed({}),
            });
            toast.success('Cập nhật bài viết thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể cập nhật bài viết');
        },
    });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => postService.delete(postId),
        onSuccess: (_, postId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: queryKey.posts.id(postId) });
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: queryKey.posts.all() });
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.newFeed({}),
            });
            toast.success('Xóa bài viết thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể xóa bài viết');
        },
    });
};
