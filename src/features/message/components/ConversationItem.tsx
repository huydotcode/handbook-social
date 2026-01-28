'use client';
import { useSocket } from '@/core/context';
import { useAuth } from '@/core/context/AuthContext';
import { useSidebarCollapse } from '@/core/context/SidebarContext';
import { ConversationService } from '@/features/conversation';
import { cn } from '@/lib/utils';
import { splitName, timeConvert3 } from '@/shared';
import { Avatar, ConfirmModal, Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/Popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useQueryInvalidation } from '@/shared/hooks';
import { IConversation } from '@/types/entites';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    data: IConversation;
}

const ConversationItem: React.FC<Props> = ({ data: conversation }) => {
    const { user } = useAuth();
    const lastMessage = conversation?.lastMessage;
    const { socketEmitor } = useSocket();
    const { invalidateConversations } = useQueryInvalidation();
    const { setIsSidebarOpen } = useSidebarCollapse();
    const path = usePathname();
    const router = useRouter();
    const members = useMemo(
        () => conversation.members || [],
        [conversation.members]
    );

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const partner = useMemo(() => {
        return conversation.group
            ? null
            : members.find((m) => m.user._id !== user?.id)?.user;
    }, [conversation.group, members, user]);

    const isSelect = useMemo(() => {
        return path.includes(conversation._id);
    }, [path, conversation._id]);

    const isDeleted = useMemo(() => {
        if (!user) return false;

        return conversation.isDeletedBy?.includes(user.id);
    }, [conversation.isDeletedBy, user]);

    const title = useMemo(() => {
        if (partner) return partner.name;
        if (conversation.title) return conversation.title;
        if (conversation.group) return conversation.group.name;
    }, [conversation, partner]);

    const isReadLastMessage = useMemo(() => {
        if (!lastMessage) return false;

        return (
            lastMessage.sender._id === user?.id ||
            lastMessage.readBy.some((read) => read.user._id === user?.id)
        );
    }, [lastMessage, user]);

    const handleShowProfile = () => {
        if (partner) {
            router.push(`/profile/${partner._id}`);
        } else if (conversation.group) {
            router.push(`/groups/${conversation.group._id}`);
        }
    };

    const handleDeleteConversation = async () => {
        if (!user) {
            toast.error('Bạn cần đăng nhập để thực hiện hành động này');
            return;
        }

        try {
            if (isDeleted) {
                await ConversationService.undeleteConversationByUserId({
                    conversationId: conversation._id,
                    userId: user.id,
                });
                toast.success('Khôi phục cuộc trò chuyện thành công');
                setOpenModalDelete(false);
                await invalidateConversations();
                return;
            }

            await ConversationService.deleteByUser({
                conversationId: conversation._id,
                userId: user.id,
            });

            if (path.includes(conversation._id)) {
                router.push('/messages');
            }

            await invalidateConversations();

            socketEmitor.leaveRoom({
                roomId: conversation._id,
                userId: user.id,
            });

            toast.success('Xóa cuộc trò chuyện thành công');
        } catch (error: any) {
            toast.error('Xoá cuộc trò chuyện thất bại');
        }
    };

    return (
        <div className="group relative mt-2 w-full">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className={cn(
                                'relative m-0 flex w-full justify-between px-2 shadow-none lg:justify-center',
                                isSelect && 'bg-primary-1'
                            )}
                            onClick={() => {
                                setIsSidebarOpen(false);
                                router.push(`/messages/${conversation._id}`);
                            }}
                            size={'2xl'}
                        >
                            <div className="relative h-8 w-8">
                                <div className="h-8 w-8">
                                    {conversation.group ? (
                                        <Avatar
                                            onlyImage
                                            imgSrc={
                                                conversation.group.avatar.url
                                            }
                                            alt={conversation.group.name}
                                        />
                                    ) : (
                                        <Avatar
                                            onlyImage
                                            imgSrc={partner?.avatar}
                                            alt={partner?.name}
                                        />
                                    )}
                                </div>
                                {partner && (
                                    <span className="absolute -right-1 bottom-0 ml-2 text-xs lg:right-4">
                                        <Icons.Circle
                                            className={`${partner?.isOnline ? 'text-primary-2' : 'text-secondary-1'}`}
                                        />
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col lg:hidden sm:flex">
                                <div className="flex items-center justify-between">
                                    <h3 className="ml-2 whitespace-nowrap text-sm font-bold text-primary-1 dark:text-dark-primary-1">
                                        {title}
                                    </h3>
                                </div>
                                <div className="ml-2 max-w-full overflow-ellipsis whitespace-nowrap text-start text-xs">
                                    {!lastMessage && (
                                        <span className="text-secondary-1">
                                            Chưa có tin nhắn
                                        </span>
                                    )}

                                    {lastMessage && (
                                        <>
                                            <div
                                                className={
                                                    'flex items-center justify-between'
                                                }
                                            >
                                                <div
                                                    className={
                                                        'flex items-center justify-between'
                                                    }
                                                >
                                                    <span
                                                        className={cn(
                                                            'text-secondary-1 dark:text-dark-primary-1'
                                                        )}
                                                    >
                                                        {lastMessage?.sender
                                                            ._id == user?.id
                                                            ? 'Bạn: '
                                                            : lastMessage
                                                                    ?.sender
                                                                    .givenName
                                                              ? lastMessage
                                                                    ?.sender
                                                                    .givenName
                                                              : `${
                                                                    splitName(
                                                                        lastMessage
                                                                            ?.sender
                                                                            ?.name ||
                                                                            ''
                                                                    ).lastName
                                                                }: `}
                                                    </span>

                                                    <span
                                                        className={cn(
                                                            'ml-1 font-bold',
                                                            {
                                                                'font-normal text-secondary-1':
                                                                    isReadLastMessage,
                                                            }
                                                        )}
                                                    >
                                                        {lastMessage.text.trim()
                                                            .length > 0
                                                            ? lastMessage.text
                                                                  .slice(0, 8)
                                                                  .concat('...')
                                                            : 'Gửi một ảnh'}
                                                    </span>
                                                </div>

                                                {lastMessage.createdAt && (
                                                    <span
                                                        className={cn(
                                                            'ml-2 font-bold',
                                                            {
                                                                'font-normal text-secondary-1':
                                                                    isReadLastMessage,
                                                            }
                                                        )}
                                                    >
                                                        {timeConvert3(
                                                            lastMessage.createdAt.toString(),
                                                            'trước'
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{title}</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="absolute right-6 top-1/2 z-50 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 lg:hidden">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="text-gray-500 hover:text-gray-700"
                            variant="default"
                            size={'sm'}
                        >
                            <Icons.Menu />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent>
                        <div className="flex flex-col">
                            <Button
                                variant="ghost"
                                className="w-full justify-start rounded-none"
                                size={'sm'}
                                onClick={handleShowProfile}
                            >
                                {partner && 'Xem trang cá nhân'}
                                {conversation.group && 'Xem nhóm'}
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start rounded-none"
                                size={'sm'}
                                onClick={() => setOpenModalDelete(true)}
                            >
                                {isDeleted
                                    ? 'Khôi phục cuộc trò chuyện'
                                    : 'Xoá cuộc trò chuyện'}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <ConfirmModal
                title={
                    isDeleted
                        ? 'Khôi phục cuộc trò chuyện'
                        : 'Xoá cuộc trò chuyện'
                }
                cancelText="Huỷ"
                confirmText={isDeleted ? 'Khôi phục' : 'Xoá'}
                open={openModalDelete}
                message="Bạn có chắc chắn muốn thực hiện hành động này?"
                onClose={() => setOpenModalDelete(false)}
                setShow={setOpenModalDelete}
                onConfirm={handleDeleteConversation}
            />
        </div>
    );
};

export default ConversationItem;
