'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import queryKey from '@/lib/queryKey';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';
import { InfinityPostData } from '../InfinityPostComponent';
import { usePostContext } from '../Post';

interface Props {
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ post }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { postParams } = usePostContext();

    const isReacted = post.userHasLoved;

    const mutation = useMutation({
        mutationFn: async () => {
            if (!user) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này!');
                return;
            }

            try {
                await queryClient.setQueryData<InfinityPostData>(
                    queryKey.posts.newFeed({
                        groupId: postParams.groupId,
                        type: postParams.type,
                        userId: postParams.userId,
                        username: postParams.username,
                    }),
                    (oldData) => {
                        if (!oldData) return oldData;
                        const updatedPages = oldData.pages.map((page) =>
                            page.map((oldPost) => {
                                if (oldPost._id !== post._id) return oldPost;
                                return {
                                    ...oldPost,
                                    lovesCount: isReacted
                                        ? oldPost.lovesCount - 1
                                        : oldPost.lovesCount + 1,
                                    userHasLoved: !isReacted,
                                };
                            })
                        );
                        return {
                            ...oldData,
                            pages: updatedPages,
                        };
                    }
                );

                await PostService.sendReaction(post._id);
            } catch (error: any) {
                console.error(error);
            }
        },
        onError: () => {
            toast.error('Không thể thực hiện chức năng này!');
        },
    });

    return (
        <Button
            className="like-container mr-2 flex flex-1 items-center md:p-1"
            variant={'ghost'}
            onClick={() => mutation.mutate()}
        >
            <div className="con-like">
                <input
                    className="like"
                    type="checkbox"
                    title="like"
                    checked={isReacted ? true : false}
                    onChange={() => {}}
                />
                <div className="checkmark flex">
                    <Icons.Heart />
                </div>
            </div>

            <span
                className={cn('ml-1 mr-2 min-w-[10px] text-sm sm:hidden', {
                    'text-red-500': isReacted,
                })}
            >
                Yêu thích
            </span>
        </Button>
    );
};

export default ReactionPost;
