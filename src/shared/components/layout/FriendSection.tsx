'use client';
import { FixedSidebar } from '@/shared/components/layout';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useAuth } from '@/core/context/AuthContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ConversationItemSkeleton from '../skeleton/ConversationItemSkeleton';
import { useFriendsWithConversations, useFriendSuggestions } from '@/features/friend';
import { useSendFriendRequest } from '@/features/notification';
import { useDismissedSuggestions } from '@/shared/hooks/useDismissedSuggestions';

interface Props {}

const FriendSection: React.FC<Props> = () => {
    const path = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const { data, isLoading } = useFriendsWithConversations(user?.id);

    const friends = data?.friends || [];
    const friendConversations = data?.friendConversations || [];
    const groupConversations = data?.groupConversations || [];

    const { data: suggestionsData, isLoading: isLoadingSuggestions } = useFriendSuggestions(5);
    const suggestions = suggestionsData || [];
    const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest();
    const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set());
    const { isDismissed, dismiss } = useDismissedSuggestions();

    const visibleSuggestions = suggestions.filter((s) => !isDismissed(s._id));

    return (
        <FixedSidebar className="xl:hidden" direction={'right'} hideOnMobile>
            <div className="relative h-full w-full">
                <div
                    className={cn(
                        'flex h-full w-full flex-col pl-2 pt-2 dark:border-none md:pl-0',
                        path !== '/' && 'bg-white dark:bg-dark-secondary-1'
                    )}
                >
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-md font-bold lg:hidden">
                            Bạn bè <span className="ml-2 text-sm text-secondary-1">{friends && friends.length}</span>
                        </h1>

                        <div className="hidden w-full items-center justify-center p-1 lg:flex">
                            <Icons.Users />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {isLoading && (
                            <div className="flex flex-col gap-1">
                                <ConversationItemSkeleton />
                                <ConversationItemSkeleton />
                                <ConversationItemSkeleton />
                            </div>
                        )}

                        {friendConversations.map((conversation) => (
                            <TooltipProvider key={conversation._id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild={true}>
                                                <Button
                                                    variant={'custom'}
                                                    className="flex h-12 w-full cursor-pointer items-center justify-between p-2 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:justify-center"
                                                >
                                                    <div className="flex items-center lg:h-8 lg:w-8">
                                                        <Image
                                                            className="rounded-full"
                                                            src={conversation.friend.avatar || ''}
                                                            alt={conversation.friend.name || ''}
                                                            width={32}
                                                            height={32}
                                                        />

                                                        <span className="ml-2 text-xs lg:hidden">
                                                            {conversation.friend.name}
                                                        </span>
                                                    </div>

                                                    <span className="lg:hidden">
                                                        {conversation.friend.isOnline && (
                                                            <Icons.Circle className="text-sm text-primary-2" />
                                                        )}
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align={'start'}>
                                                <DropdownMenuItem className={'p-0'}>
                                                    <Button
                                                        className={'w-full min-w-[250px] justify-start'}
                                                        variant={'ghost'}
                                                        size={'md'}
                                                        href={`/profile/${conversation.friend._id}`}
                                                    >
                                                        <Icons.Users />
                                                        Trang cá nhân
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className={'p-0'}>
                                                    <Button
                                                        className={'w-full justify-start'}
                                                        variant={'ghost'}
                                                        size={'md'}
                                                        onClick={() => router.push(`/messages/${conversation._id}`)}
                                                    >
                                                        <Icons.Message />
                                                        Nhắn tin
                                                    </Button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>{conversation.friend.name}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                        {/* 
                        {friends &&
                            friends.map((friend, index) => {
                                const conversation = privateConversations.find(
                                    (c) =>
                                        c.participants.some(
                                            (p) =>
                                                p._id === friend._id &&
                                                p._id !== session?.user.id
                                        ) &&
                                        c.participants.some(
                                            (p) => p._id === session?.user.id
                                        ) &&
                                        c.type === 'private'
                                );

                                return (
                                    <TooltipProvider key={friend._id + index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild={true}
                                                    >
                                                        <Button
                                                            variant={'custom'}
                                                            className="flex h-12 w-full cursor-pointer items-center justify-between p-2 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:justify-center"
                                                        >
                                                            <div className="flex items-center lg:h-8 lg:w-8">
                                                                <Image
                                                                    className="rounded-full"
                                                                    src={
                                                                        friend.avatar ||
                                                                        ''
                                                                    }
                                                                    alt={
                                                                        friend.name ||
                                                                        ''
                                                                    }
                                                                    width={32}
                                                                    height={32}
                                                                />

                                                                <span className="ml-2 text-xs lg:hidden">
                                                                    {
                                                                        friend.name
                                                                    }
                                                                </span>
                                                            </div>

                                                            <span className="lg:hidden">
                                                                {friend.isOnline && (
                                                                    <Icons.Circle className="text-sm text-primary-2" />
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align={'start'}
                                                    >
                                                        <DropdownMenuItem
                                                            className={'p-0'}
                                                        >
                                                            <Button
                                                                className={
                                                                    'w-full min-w-[250px] justify-start'
                                                                }
                                                                variant={
                                                                    'ghost'
                                                                }
                                                                size={'md'}
                                                                href={`/profile/${friend._id}`}
                                                            >
                                                                <Icons.Users />
                                                                Trang cá nhân
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={'p-0'}
                                                        >
                                                            <Button
                                                                className={
                                                                    'w-full justify-start'
                                                                }
                                                                variant={
                                                                    'ghost'
                                                                }
                                                                size={'md'}
                                                                onClick={() => {
                                                                    if (
                                                                        conversation
                                                                    ) {
                                                                        router.push(
                                                                            `/messages/${conversation._id}`
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Icons.Message />
                                                                Nhắn tin
                                                            </Button>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>{friend.name}</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })} */}
                    </div>

                    <div className="mt-2 flex items-center justify-between px-2">
                        <h1 className="text-md font-bold lg:hidden">
                            Hội thoại nhóm
                            <span className="ml-2 text-sm text-secondary-1">{groupConversations.length}</span>
                        </h1>

                        <div className="hidden w-full items-center justify-center p-1 lg:flex">
                            <Icons.Users />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {isLoading && (
                            <div className="flex flex-col gap-1">
                                <ConversationItemSkeleton />
                                <ConversationItemSkeleton />
                                <ConversationItemSkeleton />
                            </div>
                        )}

                        {groupConversations.map((conversation) => {
                            return (
                                <TooltipProvider key={conversation._id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="flex h-12 w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:justify-center"
                                                href={`/messages/${conversation._id}`}
                                            >
                                                <div className="flex items-center lg:h-8 lg:w-8">
                                                    <Image
                                                        className="rounded-full"
                                                        src={
                                                            conversation?.avatar?.url ||
                                                            conversation?.group?.avatar.url ||
                                                            ''
                                                        }
                                                        alt={conversation.title || ''}
                                                        width={32}
                                                        height={32}
                                                    />

                                                    <span className="ml-2 text-xs lg:hidden">{conversation.title}</span>
                                                </div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>{conversation?.title}</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>

                    {visibleSuggestions.length > 0 && (
                        <div className="mt-2 flex items-center justify-between px-2">
                            <h1 className="text-md font-bold lg:hidden">Gợi ý kết bạn</h1>
                            <div className="hidden w-full items-center justify-center p-1 lg:flex">
                                <Icons.PersonAdd />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        {isLoadingSuggestions && (
                            <div className="flex flex-col gap-1">
                                <ConversationItemSkeleton />
                                <ConversationItemSkeleton />
                            </div>
                        )}

                        {visibleSuggestions.map((suggestion) => {
                            const hasSent = sentRequestIds.has(suggestion._id);
                            return (
                                <TooltipProvider key={suggestion._id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="group flex h-12 w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:justify-center">
                                                <div
                                                    className="flex flex-1 items-center lg:h-8 lg:w-8"
                                                    onClick={() => router.push(`/profile/${suggestion._id}`)}
                                                >
                                                    <Image
                                                        className="rounded-full"
                                                        src={suggestion.avatar || ''}
                                                        alt={suggestion.name || ''}
                                                        width={32}
                                                        height={32}
                                                    />
                                                    <div className="ml-2 flex flex-col lg:hidden">
                                                        <span className="text-xs font-medium">{suggestion.name}</span>
                                                        {hasSent && (
                                                            <span className="text-[10px] text-secondary-1">
                                                                Đã gửi lời mời
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={hasSent || isSending}
                                                    className={cn(
                                                        'h-8 w-8 rounded-full p-0 transition-all lg:hidden',
                                                        hasSent
                                                            ? 'text-secondary-1 opacity-50'
                                                            : 'text-primary-1 opacity-0 group-hover:opacity-100'
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!hasSent && user?.id) {
                                                            sendFriendRequest(
                                                                {
                                                                    senderId: user.id,
                                                                    receiverId: suggestion._id,
                                                                },
                                                                {
                                                                    onSuccess: () => {
                                                                        setSentRequestIds((prev) =>
                                                                            new Set(prev).add(suggestion._id)
                                                                        );
                                                                        // Persist 30d so it won't reappear
                                                                        dismiss(suggestion._id, 'sent');
                                                                    },
                                                                }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {hasSent ? (
                                                        <Icons.Tick className="h-4 w-4" />
                                                    ) : (
                                                        <Icons.PersonAdd className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>
                                                {hasSent ? `Đã gửi lời mời kết bạn` : `Kết bạn với ${suggestion.name}`}
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>
                </div>
            </div>
        </FixedSidebar>
    );
};
export default FriendSection;
