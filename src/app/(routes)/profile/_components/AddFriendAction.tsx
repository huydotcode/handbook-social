'use client';
import { useSocket } from '@/core/context';
import { useNotifications, useRequests } from '@/core/context/AppContext';
import { useAuth } from '@/core/context/AuthContext';
import { useFriends } from '@/core/context/SocialContext';
import { NotificationService } from '@/features/notification';
import { UserService } from '@/features/user';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/Button';
import Icons from '@/shared/components/ui/Icons';
import { useQueryInvalidation } from '@/shared/hooks';
import { NOTIFICATION_TYPES } from '@/types/entites';
import { useMutation } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    className?: string;
    userId: string;
}

const AddFriendAction: React.FC<Props> = ({ className = '', userId }) => {
    const { user } = useAuth();
    const { invalidateFriends, invalidateRequests, invalidateNotifications } =
        useQueryInvalidation();
    const { data: requests, isLoading: isLoadingRequests } = useRequests(
        user?.id
    );
    const { data: notifications, isLoading: isLoadingNotifications } =
        useNotifications(user?.id);
    const { socket, socketEmitor } = useSocket();
    const { data: friends, isLoading: isLoadingFriends } = useFriends(user?.id);
    const isLoadingBtn = useMemo(() => {
        return isLoadingRequests || isLoadingFriends || isLoadingNotifications;
    }, [isLoadingRequests, isLoadingFriends, isLoadingNotifications]);

    const { mutateAsync: sendRequest, isPending } = useMutation({
        mutationFn: async ({ receiverId }: { receiverId: string }) => {
            const request = await NotificationService.sendRequestFriend({
                receiverId: receiverId,
                senderId: user?.id as string,
            });

            return request;
        },
        onMutate: () => {
            toast('Đang gửi lời mời kết bạn...', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
        onSuccess: async (data) => {
            await invalidateRequests(user?.id as string);
            await invalidateNotifications(user?.id as string);
            await invalidateFriends(user?.id as string);

            if (!data) return;

            toast.success('Gửi lời mời kết bạn thành công', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
        onError: (error) => {
            console.error(error);
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn.', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
    });

    const { mutate: mutationUnFriend } = useMutation({
        mutationFn: async ({ friendId }: { friendId: string }) => {
            await UserService.unfriend(friendId);
        },
        onMutate: () => {
            toast('Đang hủy kết bạn...', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
        onSuccess: async () => {
            await invalidateFriends(user?.id as string);
            await invalidateRequests(user?.id as string);
            await invalidateNotifications(user?.id as string);

            toast.success('Hủy kết bạn thành công', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
        onError: (error) => {
            console.error(error);
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn.', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
    });

    const [countClick, setCountClick] = useState<number>(0);

    // Kiểm tra trạng thái bạn bè
    const isFriend = useMemo(
        () => friends && friends.some((friend) => friend._id === userId),
        [friends, userId]
    );

    // Kiểm tra: Đã gửi request cho userId chưa
    const isSentRequest = useMemo(
        () =>
            requests &&
            requests.some(
                (request) =>
                    request.receiver._id === userId &&
                    request.type === NOTIFICATION_TYPES.REQUEST_ADD_FRIEND
            ),
        [requests, userId]
    );

    // Kiểm tra: Đã nhận được request từ userId chưa
    const receivedRequest = useMemo(
        () =>
            notifications &&
            notifications.find(
                (notification) =>
                    notification.sender._id === userId &&
                    notification.receiver._id === user?.id &&
                    notification.type ===
                        NOTIFICATION_TYPES.REQUEST_ADD_FRIEND &&
                    !notification.isDeleted
            ),
        [notifications, userId, user?.id]
    );

    // Hủy lời mời kết bạn (đã gửi)
    const handleRemoveRequest = async () => {
        if (!user) return;

        try {
            await NotificationService.deleteNotificationByUsers({
                senderId: user.id,
                receiverId: userId,
                type: NOTIFICATION_TYPES.REQUEST_ADD_FRIEND,
            });

            await invalidateRequests(user?.id as string);
            await invalidateNotifications(user?.id as string);
            await invalidateFriends(user?.id as string);

            toast.success('Đã hủy lời mời kết bạn', {
                id: 'removeRequest',
            });
        } catch (error) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra khi hủy lời mời kết bạn.', {
                id: 'removeRequest',
            });
        }
    };

    // Chấp nhận lời mời kết bạn
    const handleAcceptRequest = async () => {
        if (!receivedRequest || !user) return;

        try {
            // Server sẽ tự động tạo conversation khi accept friend request
            const result = await NotificationService.acceptFriend({
                notificationId: receivedRequest._id,
            });

            if (!result.success) {
                toast.error('Đã có lỗi xảy ra khi chấp nhận lời mời kết bạn.', {
                    id: 'acceptRequest',
                });
                return;
            }

            await invalidateNotifications(user.id);
            await invalidateFriends(user.id);
            await invalidateRequests(user.id);

            // Join socket room nếu conversation đã được tạo
            if (socket && result.conversation) {
                socketEmitor.joinRoom({
                    roomId: result.conversation._id,
                    userId: user.id,
                });

                socketEmitor.joinRoom({
                    roomId: result.conversation._id,
                    userId: receivedRequest.sender._id,
                });
            }

            toast.success('Đã chấp nhận lời mời kết bạn', {
                id: 'acceptRequest',
            });
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toast.error('Đã có lỗi xảy ra khi chấp nhận lời mời kết bạn.', {
                id: 'acceptRequest',
            });
        }
    };

    // Từ chối lời mời kết bạn
    const handleDeclineRequest = async () => {
        if (!receivedRequest || !user) return;

        try {
            await NotificationService.declineFriend({
                notificationId: receivedRequest._id,
            });

            await invalidateNotifications(user.id);
            await invalidateFriends(user.id);

            toast.success('Đã từ chối lời mời kết bạn', {
                id: 'declineRequest',
            });
        } catch (error) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra khi từ chối lời mời kết bạn.', {
                id: 'declineRequest',
            });
        }
    };

    // Xử lý khi click vào nút kết bạn
    const handleAddFriend = async () => {
        if (!user) return;

        setCountClick((prev) => prev + 1);

        if (countClick >= 5) {
            toast.error('Vui lòng giảm tần suất thao tác.', {
                id: 'handleAddFriend',
            });
            setTimeout(() => setCountClick(0), 5000);
            return;
        }

        try {
            if (isFriend) {
                mutationUnFriend({
                    friendId: userId,
                });
            } else if (receivedRequest) {
                // Có request nhận được → chấp nhận
                await handleAcceptRequest();
            } else if (isSentRequest) {
                // Đã gửi request → hủy
                handleRemoveRequest();
            } else {
                // Chưa có request → gửi mới
                await sendRequest({ receiverId: userId });
            }

            setCountClick(0);
        } catch (error) {
            console.error(error);
            toast('Đã có lỗi xảy ra.', {
                id: 'handleAddFriend',
                position: 'bottom-left',
            });
        }
    };

    // Hiển thị văn bản nút
    const getButtonText = () => {
        if (isLoadingBtn) return 'Đang tải...';
        if (isFriend) return 'Hủy';
        if (receivedRequest) return 'Chấp nhận';
        if (isSentRequest) return 'Đã gửi';
        return 'Kết bạn';
    };

    return (
        <Button
            className={cn(
                'min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1',
                className
            )}
            variant={
                isFriend
                    ? 'secondary'
                    : receivedRequest
                      ? 'primary'
                      : !isSentRequest
                        ? 'primary'
                        : 'secondary'
            }
            size={'md'}
            onClick={handleAddFriend}
            disabled={isPending}
        >
            {isLoadingBtn || isPending ? (
                <>
                    <Icons.Loading />
                </>
            ) : (
                <>
                    <span className={'md:hidden'}>
                        {isFriend ? <Icons.Users /> : <Icons.PersonAdd />}
                    </span>
                    <p className="ml-2 md:ml-0">{getButtonText()}</p>
                </>
            )}
        </Button>
    );
};

export default AddFriendAction;
