'use client';
import { Button } from '@/components/ui/Button';
import Icons from '@/components/ui/Icons';
import { useSocket } from '@/core/context';
import { useAuth } from '@/core/context/AuthContext';
import { useFollowing } from '@/core/context/SocialContext';
import { useQueryInvalidation } from '@/shared/hooks';
import NotificationService from '@/lib/services/notification.service';
import UserService from '@/lib/services/user.service';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

interface Props {
    className?: string;
    userId: string;
}

const FollowAction: React.FC<Props> = ({ className = '', userId }) => {
    const { user } = useAuth();
    const { invalidateFollowings } = useQueryInvalidation();
    const { socket, socketEmitor } = useSocket();

    const { data: followings, isLoading: isLoadingFollowings } = useFollowing(
        user?.id
    );

    // Kiểm tra xem đã follow user này chưa
    const isFollow = useMemo(
        () =>
            followings &&
            followings.some((follower) => follower.following._id === userId),
        [followings, userId]
    );

    const isLoadingBtn = isLoadingFollowings;

    // Follow user mutation
    const { mutateAsync: followUser, isPending: isFollowing } = useMutation({
        mutationFn: async () => {
            if (!user?.id) {
                throw new Error('User not authenticated');
            }

            // Follow user first
            await UserService.follow(userId);

            // Create follow notification
            const newNotification =
                await NotificationService.createNotificationFollowUser({
                    senderId: user.id,
                    receiverId: userId,
                });

            return newNotification;
        },
        onMutate: () => {
            toast('Đang theo dõi...', {
                id: 'follow',
                position: 'bottom-left',
            });
        },
        onSuccess: async (notification) => {
            await invalidateFollowings(user?.id as string);

            toast.success('Đã theo dõi', {
                id: 'follow',
                position: 'bottom-left',
            });
        },
        onError: (error) => {
            console.error('Error following user:', error);
            toast.error('Đã có lỗi xảy ra khi theo dõi. Vui lòng thử lại!', {
                id: 'follow',
                position: 'bottom-left',
            });
        },
    });

    // Unfollow user mutation
    const { mutateAsync: unfollowUser, isPending: isUnfollowing } = useMutation(
        {
            mutationFn: async () => {
                await UserService.unfollow(userId);
            },
            onMutate: () => {
                toast('Đang bỏ theo dõi...', {
                    id: 'unfollow',
                    position: 'bottom-left',
                });
            },
            onSuccess: async () => {
                await invalidateFollowings(user?.id as string);

                toast.success('Đã bỏ theo dõi', {
                    id: 'unfollow',
                    position: 'bottom-left',
                });
            },
            onError: (error) => {
                console.error('Error unfollowing user:', error);
                toast.error(
                    'Đã có lỗi xảy ra khi bỏ theo dõi. Vui lòng thử lại!',
                    {
                        id: 'unfollow',
                        position: 'bottom-left',
                    }
                );
            },
        }
    );

    const handleFollowClick = () => {
        if (!user?.id || isLoadingBtn || isFollowing || isUnfollowing) {
            return;
        }

        if (isFollow) {
            unfollowUser();
        } else {
            followUser();
        }
    };

    const isPending = isFollowing || isUnfollowing;

    return (
        <Button
            className={cn(
                'min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1',
                className
            )}
            variant={isFollow ? 'secondary' : 'primary'}
            size="md"
            onClick={handleFollowClick}
            disabled={isLoadingBtn || isPending}
        >
            {isPending ? (
                <Icons.Loading className="h-4 w-4" />
            ) : isFollow ? (
                'Đang Follow'
            ) : (
                'Follow'
            )}
        </Button>
    );
};

export default FollowAction;
