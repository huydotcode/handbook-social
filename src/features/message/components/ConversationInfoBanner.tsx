'use client';
import { useAuth } from '@/core/context';
import { useConversationMembers } from '@/features/conversation';
import { Avatar, Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { IConversation } from '@/types/entites';
import React, { useMemo } from 'react';

interface Props {
    conversation: IConversation;
}

const ConversationInfoBanner: React.FC<Props> = ({ conversation }) => {
    const { user } = useAuth();
    const { members } = useConversationMembers(conversation._id);

    const roomType = conversation.type;
    const isGroup = roomType === 'group';

    const partner = useMemo(() => {
        if (isGroup) return null;
        if (!user) return null;
        const other = members.find((m) => m.user._id !== user.id)?.user;
        return other || null;
    }, [isGroup, members, user]);

    const title = useMemo(() => {
        if (isGroup) {
            return conversation.title;
        } else if (roomType === 'private') {
            return partner?.name;
        } else {
            return '';
        }
    }, [conversation.title, partner?.name, roomType, isGroup]);

    const avatar = useMemo(() => {
        if (isGroup && conversation.group) {
            return conversation.group.avatar.url;
        } else {
            return partner?.avatar;
        }
    }, [conversation.group, partner?.avatar, isGroup]);

    const description = useMemo(() => {
        if (isGroup) return conversation.group?.description || 'Cuộc trò chuyện nhóm';
        return partner?.username ? `@${partner.username}` : 'Người dùng';
    }, [conversation.group, partner?.username, isGroup]);

    return (
        <div className="mb-6 flex flex-col items-center px-4 py-12 text-center">
            <div className="group relative mb-4 cursor-pointer">
                <Avatar
                    imgSrc={avatar}
                    alt={title}
                    width={84}
                    height={84}
                    className="h-21 w-21 shadow-lg dark:ring-dark-secondary-2"
                />
                {!isGroup && partner?.isOnline && (
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500 shadow-sm dark:border-dark-secondary-1" />
                )}
            </div>

            <h2 className="text-2xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">{title}</h2>

            <p className="mt-2 line-clamp-3 max-w-sm text-sm font-medium text-secondary-1 dark:text-gray-400">
                {description}
            </p>

            {isGroup && conversation.group?.members && (
                <div className="mt-2 flex items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-secondary-1 dark:bg-dark-secondary-2">
                    <Icons.Group className="mr-1 h-3 w-3" />
                    {conversation.group.members.length} thành viên
                </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
                {isGroup ? (
                    <Button
                        variant="secondary"
                        href={`/groups/${conversation.group?._id}`}
                        className="rounded-full px-6 py-2 text-sm shadow-sm"
                    >
                        <Icons.Group className="mr-2 h-4 w-4" />
                        Truy cập nhóm
                    </Button>
                ) : (
                    partner && (
                        <Button
                            variant="secondary"
                            href={`/profile/${partner._id}`}
                            className="shadow-s text-smm rounded-full px-6 py-2 text-sm"
                        >
                            <Icons.Profile className="mr-2 h-4 w-4" />
                            Xem trang cá nhân
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default ConversationInfoBanner;
