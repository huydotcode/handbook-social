'use client';
import { Post } from '@/components/post';
import { Loading } from '@/components/ui';
import { postService } from '@/lib/api/services/post.service';
import queryKey from '@/lib/queryKey';
import { IPost } from '@/types/entites';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
interface Props {
    params: Promise<{ postId: string }>;
}

const PostPage: React.FC<Props> = ({ params }) => {
    const { postId } = use(params);
    const { data: post, isLoading } = useQuery<IPost | null>({
        queryKey: queryKey.posts.id(postId || ''),
        queryFn: async () => {
            if (!postId) return null;

            try {
                return (await postService.getById(postId)) || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        enabled: !!postId,
    });

    if (isLoading) {
        return <Loading fullScreen />;
    }

    if (!post) {
        return (
            <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
                <h1>Bài viết không tồn tại</h1>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-[64px] w-[600px] xl:w-[550px] md:w-full">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Bài viết của {post?.author.name}
            </h1>

            <Post data={post} />
        </div>
    );
};

export default PostPage;
