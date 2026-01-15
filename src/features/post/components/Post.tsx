'use client';
import { useAuth } from '@/core/context/AuthContext';
import ReviewPost from '@/features/post/components/ReviewPost';
import SkeletonPost from '@/features/post/components/SkeletonPost';
import { IPost } from '@/types/entites';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useMemo } from 'react';
import { PostParams } from './InfinityPostComponent';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import FooterPost from './footer/FooterPost';

interface Props {
    data: IPost;
    isManage?: boolean;
    params?: PostParams;
}

const PostContext = createContext<{
    postParams: PostParams;
}>({
    postParams: {
        userId: '',
        groupId: '',
        username: '',
        type: 'new-feed',
    },
});

export const usePostContext = () => useContext(PostContext);

const Post: React.FC<Props> = React.memo(
    ({ data: post, isManage = false, params }) => {
        const pathname = usePathname();
        const { user } = useAuth();

        const showInPrivate = useMemo(
            () =>
                post &&
                post.option === 'private' &&
                pathname === `/profile/${post.author?._id}` &&
                user?.id === post.author?._id,
            [post, pathname, user?.id]
        );

        if (!post) return <SkeletonPost />;
        if (post.option === 'private' && !showInPrivate) return null;

        return (
            <PostContext.Provider value={{ postParams: params || {} }}>
                <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                    <PostHeader post={post} />
                    <PostContent post={post} />
                    {!isManage && <FooterPost post={post} />}
                    {isManage && <ReviewPost post={post} />}
                </div>
            </PostContext.Provider>
        );
    }
);

Post.displayName = 'Post';

export default Post;
