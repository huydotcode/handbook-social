'use client';
import CommentSection from '@/features/comment/components/CommentSection';
import { cn } from '@/lib/utils';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { IPost } from '@/types/entites';
import React, { useEffect, useState } from 'react';
import ReactionPost from './ReactionPost';
import SharePost from './SharePost';

interface Props {
    post: IPost;
}

const FooterPost: React.FC<Props> = ({ post }) => {
    const [commentCount, setCommentCount] = useState<number>(
        post.commentsCount || 0
    );
    const [showCommentSection, setShowCommentSection] =
        useState<boolean>(false);

    useEffect(() => {
        setCommentCount(post.commentsCount || 0);
    }, [post.commentsCount]);

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full justify-end gap-2 py-2">
                    <div className="flex items-center">
                        <Icons.Heart2 className="text-xl text-red-400" />
                        <span className="text-md ml-1">{post.lovesCount}</span>
                    </div>

                    <div className="flex items-center">
                        <Icons.Comment className="text-xl" />
                        <span className="text-md ml-1">
                            {commentCount < 0 ? 0 : commentCount}
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        'mt-1 grid grid-cols-3 border-y py-1 dark:border-dark-secondary-2',
                        {
                            'border-b-0 border-t': !showCommentSection,
                        }
                    )}
                >
                    <ReactionPost post={post} />

                    <Button
                        className="comment-container mr-2 flex flex-1 items-center md:p-1"
                        variant={'ghost'}
                        onClick={() => setShowCommentSection((prev) => !prev)}
                    >
                        <Icons.Comment />
                        <span className="ml-1 mr-2 min-w-[10px] text-sm sm:hidden">
                            Bình luận
                        </span>
                    </Button>

                    <SharePost post={post} />
                </div>

                {showCommentSection && (
                    <CommentSection
                        post={post}
                        setCommentCount={setCommentCount}
                    />
                )}
            </div>
        </>
    );
};

export default FooterPost;
