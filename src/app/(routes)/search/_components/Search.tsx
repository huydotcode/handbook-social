'use client';
import { Post } from '@/shared/components/post';
import {
    PostTypes,
    usePosts,
} from '@/shared/components/post/InfinityPostComponent';
import { Loading } from '@/shared/components/ui';
import { useAuth } from '@/core/context';
import { useFriends } from '@/core/context/SocialContext';
import { searchService } from '@/lib/api';
import {
    useSearchGroups,
    useSearchPosts,
    useSearchUsers,
} from '@/lib/hooks/api';
import {
    createSearchGetNextPageParam,
    defaultInfiniteQueryOptions,
} from '@/lib/hooks/utils';
import queryKey from '@/lib/queryKey';
import { IGroup, IPost, IUser } from '@/types/entites';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import SearchGroupItem from './SearchGroupItem';
import SearchUserItem from './SearchUserItem';

const Search = () => {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const { ref: bottomRef, inView } = useInView({
        threshold: 0.1,
    });

    const {
        data: generalSearchData,
        isLoading: isLoadingGeneral,
        fetchNextPage: fetchNextGeneralPage,
        hasNextPage: hasNextGeneralPage,
        isFetchingNextPage: isFetchingNextGeneralPage,
    } = useInfiniteQuery({
        queryKey: queryKey.search.general(q, undefined),
        queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
            searchService.search({
                q,
                page_size: 10,
                page: pageParam,
            }),
        getNextPageParam: createSearchGetNextPageParam(10),
        enabled: type === 'all' && q.trim().length > 0,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });

    const {
        data: usersData,
        isLoading: isLoadingUsers,
        fetchNextPage: fetchNextUsersPage,
        hasNextPage: hasNextUsersPage,
        isFetchingNextPage: isFetchingNextUsersPage,
    } = useSearchUsers(
        { q, page_size: 10 },
        { enabled: type === 'users' && q.trim().length > 0 }
    );

    const {
        data: postsData,
        isLoading: isLoadingPosts,
        fetchNextPage: fetchNextPostsPage,
        hasNextPage: hasNextPostsPage,
        isFetchingNextPage: isFetchingNextPostsPage,
    } = useSearchPosts(
        { q, page_size: 10 },
        { enabled: type === 'posts' && q.trim().length > 0 }
    );

    const {
        data: groupsData,
        isLoading: isLoadingGroups,
        fetchNextPage: fetchNextGroupsPage,
        hasNextPage: hasNextGroupsPage,
        isFetchingNextPage: isFetchingNextGroupsPage,
    } = useSearchGroups(
        { q, page_size: 10 },
        { enabled: type === 'groups' && q.trim().length > 0 }
    );

    const { data: posts } = usePosts({
        type: PostTypes.SEARCH_POSTS,
        enabled: type === 'posts',
        search: q,
    });

    const { data: friends } = useFriends(user?.id);

    const allUsers = useMemo(() => {
        if (type === 'all') {
            if (!generalSearchData?.pages) return [];
            return generalSearchData.pages.flatMap((page: any) => {
                if (!page || typeof page !== 'object') return [];
                const users = page.users;
                if (users && typeof users === 'object' && 'data' in users) {
                    return Array.isArray(users.data) ? users.data : [];
                }
                if (Array.isArray(users)) {
                    return users;
                }
                return [];
            });
        }
        if (type === 'users') {
            if (!usersData?.pages) return [];
            const flattened = usersData.pages.flatMap((page: any) => {
                if (Array.isArray(page)) {
                    return page;
                }
                if (page && typeof page === 'object' && 'data' in page) {
                    const dataArray = page.data;
                    return Array.isArray(dataArray) ? dataArray : [];
                }
                return [];
            });
            return flattened;
        }
        return [];
    }, [type, generalSearchData, usersData]);

    const allGroups = useMemo(() => {
        if (type === 'all') {
            if (!generalSearchData?.pages) return [];
            return generalSearchData.pages.flatMap((page: any) => {
                if (!page || typeof page !== 'object') return [];
                const groups = page.groups;
                if (groups && typeof groups === 'object' && 'data' in groups) {
                    return Array.isArray(groups.data) ? groups.data : [];
                }
                if (Array.isArray(groups)) {
                    return groups;
                }
                return [];
            });
        }
        if (type === 'groups') {
            if (!groupsData?.pages) return [];
            const flattened = groupsData.pages.flatMap((page: any) => {
                if (Array.isArray(page)) {
                    return page;
                }
                if (page && typeof page === 'object' && 'data' in page) {
                    const dataArray = page.data;
                    return Array.isArray(dataArray) ? dataArray : [];
                }
                return [];
            });
            return flattened;
        }
        return [];
    }, [type, generalSearchData, groupsData]);

    const allPosts = useMemo(() => {
        if (type === 'all') {
            if (!generalSearchData?.pages) return [];
            return generalSearchData.pages.flatMap((page: any) => {
                if (!page || typeof page !== 'object') return [];
                const posts = page.posts;
                if (posts && typeof posts === 'object' && 'data' in posts) {
                    return Array.isArray(posts.data) ? posts.data : [];
                }
                if (Array.isArray(posts)) {
                    return posts;
                }
                return [];
            });
        }
        if (type === 'posts') {
            if (posts && Array.isArray(posts)) {
                return posts;
            }
            if (!postsData?.pages) return [];
            const flattened = postsData.pages.flatMap((page: any) => {
                if (Array.isArray(page)) {
                    return page;
                }
                if (page && typeof page === 'object' && 'data' in page) {
                    const dataArray = page.data;
                    return Array.isArray(dataArray) ? dataArray : [];
                }
                return [];
            });
            return flattened;
        }
        return [];
    }, [type, generalSearchData, postsData, posts]);

    const userFriendStatus = useMemo(() => {
        if (!allUsers.length || !friends) return {};
        return allUsers.reduce(
            (acc, user) => {
                acc[user._id] = friends.some(
                    (friend) => friend._id === user._id
                );
                return acc;
            },
            {} as Record<string, boolean>
        );
    }, [allUsers, friends]);

    const isLoading =
        (type === 'all' && isLoadingGeneral) ||
        (type === 'users' && isLoadingUsers) ||
        (type === 'posts' && isLoadingPosts) ||
        (type === 'groups' && isLoadingGroups);

    const hasNextPage =
        (type === 'all' && hasNextGeneralPage) ||
        (type === 'users' && hasNextUsersPage) ||
        (type === 'posts' && hasNextPostsPage) ||
        (type === 'groups' && hasNextGroupsPage);

    const isFetchingNextPage =
        (type === 'all' && isFetchingNextGeneralPage) ||
        (type === 'users' && isFetchingNextUsersPage) ||
        (type === 'posts' && isFetchingNextPostsPage) ||
        (type === 'groups' && isFetchingNextGroupsPage);

    const fetchNextPage = useCallback(() => {
        if (type === 'all') return fetchNextGeneralPage();
        if (type === 'users') return fetchNextUsersPage();
        if (type === 'posts') return fetchNextPostsPage();
        if (type === 'groups') return fetchNextGroupsPage();
    }, [
        type,
        fetchNextGeneralPage,
        fetchNextUsersPage,
        fetchNextPostsPage,
        fetchNextGroupsPage,
    ]);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allResults = useMemo(() => {
        const results: Array<{
            type: 'user' | 'group' | 'post';
            id: string;
            data: IUser | IGroup | IPost;
        }> = [];

        if (type === 'all' || type === 'users') {
            if (Array.isArray(allUsers)) {
                allUsers.forEach((user) => {
                    if (
                        user &&
                        typeof user === 'object' &&
                        user._id &&
                        !('data' in user && 'pagination' in user)
                    ) {
                        results.push({
                            type: 'user',
                            id: `user-${user._id}`,
                            data: user,
                        });
                    }
                });
            }
        }

        if (type === 'all' || type === 'groups') {
            if (Array.isArray(allGroups)) {
                allGroups.forEach((group) => {
                    if (
                        group &&
                        typeof group === 'object' &&
                        group._id &&
                        !('data' in group && 'pagination' in group)
                    ) {
                        results.push({
                            type: 'group',
                            id: `group-${group._id}`,
                            data: group,
                        });
                    }
                });
            }
        }

        if (type === 'all' || type === 'posts') {
            if (Array.isArray(allPosts)) {
                allPosts.forEach((post) => {
                    if (
                        post &&
                        typeof post === 'object' &&
                        post._id &&
                        !('data' in post && 'pagination' in post)
                    ) {
                        results.push({
                            type: 'post',
                            id: `post-${post._id}`,
                            data: post,
                        });
                    }
                });
            }
        }

        return results;
    }, [type, allUsers, allGroups, allPosts]);

    const isEmpty =
        !isLoading &&
        allUsers.length === 0 &&
        allGroups.length === 0 &&
        allPosts.length === 0;

    if (!q.trim()) {
        return (
            <div className="flex justify-center py-10">
                <p className="dark:text-dark-gray-500 text-gray-500">
                    Vui lòng nhập từ khóa tìm kiếm
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-md mb-4">
                Kết quả tìm kiếm:{' '}
                <span className="font-semibold">&quot;{q}&quot;</span>
            </h1>

            {isLoading && (
                <div className="mt-4 flex justify-center">
                    <Loading className="text-2xl" />
                </div>
            )}

            {isEmpty && (
                <p className="dark:text-dark-gray-500 mt-4 text-center text-sm text-gray-500">
                    {type === 'all' && 'Không tìm thấy kết quả phù hợp'}
                    {type === 'users' && 'Không tìm thấy người dùng phù hợp'}
                    {type === 'groups' && 'Không tìm thấy nhóm phù hợp'}
                    {type === 'posts' && 'Không tìm thấy bài viết phù hợp'}
                </p>
            )}

            {!isLoading && !isEmpty && (
                <div className="mt-4 space-y-2">
                    {allResults.map((result) => {
                        if (result.type === 'user') {
                            return (
                                <SearchUserItem
                                    key={result.id}
                                    data={result.data as IUser}
                                    isFriend={
                                        userFriendStatus[
                                            (result.data as IUser)._id
                                        ] || false
                                    }
                                />
                            );
                        }
                        if (result.type === 'group') {
                            return (
                                <SearchGroupItem
                                    key={result.id}
                                    data={result.data as IGroup}
                                />
                            );
                        }
                        if (result.type === 'post') {
                            return (
                                <Post
                                    key={result.id}
                                    data={result.data as IPost}
                                    isManage={false}
                                    params={{
                                        type: 'search-posts',
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            {isFetchingNextPage && (
                <div className="mt-4 flex justify-center">
                    <Loading className="text-xl" />
                </div>
            )}

            <div ref={bottomRef} className="h-4" />
        </div>
    );
};

export default Search;
