'use client';
import { useAuth, useSocket } from '@/core/context';
import { useConversation } from '@/core/context/SocialContext';
import {
    ConversationService,
    useConversationMembers,
} from '@/features/conversation';
import { ChatBox } from '@/features/message';
import { Loading } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useQueryInvalidation } from '@/shared/hooks';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

const NOT_FOUND = 'not-found';
const IS_DELETED = 'is-deleted';
const NOT_ALLOWED = 'not-allowed';
const NOT_JOINED = 'not-joined';

const ErrorDisplay = ({
    title,
    message,
}: {
    title: string;
    message?: string;
}) => (
    <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">{title}</h1>
            {message && <p className="mb-6 text-gray-600">{message}</p>}
        </div>
    </div>
);

const ConversationPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { conversationId } = params;
    const findMessage = searchParams.get('find_msg') || '';

    const { user } = useAuth();
    const { socketEmitor } = useSocket();
    const {
        invalidateMessages,
        invalidateConversation,
        invalidateConversations,
    } = useQueryInvalidation();

    const {
        data: conversation,
        isLoading: isLoadingConversation,
        isFetching,
        isPending,
        error: conversationError,
    } = useConversation(conversationId as string);

    const { members } = useConversationMembers(conversationId as string);

    const error = useMemo(() => {
        if (isLoadingConversation) return null;

        if (!conversation) {
            return {
                message: 'Cuộc trò chuyện không tìm thấy',
                type: NOT_FOUND,
            };
        }

        const isDeleted = conversation.isDeletedBy?.some(
            (userId) => userId === user?.id
        );
        if (isDeleted) {
            return {
                message: 'Cuộc trò chuyện đã bị xóa bởi bạn',
                type: IS_DELETED,
            };
        }

        // Kiểm tra nếu người dùng là người tạo cuộc trò chuyện thì không cần kiểm tra quyền truy cập
        const isCreator = conversation.creator?._id === user?.id;
        if (isCreator) {
            return {
                message: '',
                type: '',
            };
        }

        // Kiểm tra nếu cuộc trò chuyện là nhóm và người dùng là thành viên của nhóm nhưng không phải là người tham gia cuộc trò chuyện
        const isGroupMember = Boolean(
            conversation.group?.members?.some((m) => m.user._id === user?.id)
        );
        const isMember = members.some((m) => m.user._id === user?.id);
        if (isGroupMember && !isMember) {
            return {
                message: 'Bạn chưa tham gia cuộc trò chuyện nhóm này.',
                type: NOT_JOINED,
            };
        }

        // Kiểm tra nếu người dùng không phải là người tham gia cuộc trò chuyện
        if (!isMember) {
            return {
                message: 'Bạn không có quyền truy cập cuộc trò chuyện này',
                type: NOT_ALLOWED,
            };
        }

        return { message: '', type: '' };
    }, [conversation, isLoadingConversation, user?.id, members]);

    if (isLoadingConversation || isFetching || isPending) {
        return <Loading fullScreen />;
    }

    if (!conversation || error?.type === NOT_FOUND) {
        return <ErrorDisplay title={error?.message || ''} />;
    }

    if (conversationError) {
        return (
            <ErrorDisplay
                title={conversationError.message || 'Đã có lỗi xảy ra'}
                message={conversationError.message}
            />
        );
    }

    if (error?.type === IS_DELETED) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">
                            {error?.message}
                        </h1>

                        <div className="mt-4 text-center">
                            <Button
                                variant={'primary'}
                                onClick={async () => {
                                    try {
                                        if (!conversation?._id || !user?.id) {
                                            return;
                                        }

                                        await ConversationService.undeleteConversationByUserId(
                                            {
                                                conversationId:
                                                    conversation._id,
                                                userId: user.id,
                                            }
                                        );

                                        await invalidateConversation(
                                            conversation._id
                                        );

                                        await invalidateConversations();

                                        toast.success(
                                            'Bạn đã khôi phục cuộc trò chuyện thành công!'
                                        );

                                        socketEmitor?.joinRoom({
                                            roomId: conversation._id,
                                            userId: user.id,
                                        });
                                    } catch (error: any) {
                                        toast.error(
                                            error?.message ||
                                                'Đã có lỗi xảy ra khi khôi phục cuộc trò chuyện.'
                                        );
                                    }
                                }}
                            >
                                Khôi phục cuộc trò chuyện
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error?.type === NOT_ALLOWED) {
        return <ErrorDisplay title={error?.message || ''} />;
    }

    if (error?.type === NOT_JOINED) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">
                            {error?.message}
                        </h1>

                        <div className="mt-4 text-center">
                            <Button
                                variant={'primary'}
                                onClick={async () => {
                                    try {
                                        if (
                                            !conversation.group?._id ||
                                            !user?.id
                                        ) {
                                            return;
                                        }

                                        await ConversationService.join({
                                            conversationId: conversation._id,
                                            userId: user.id,
                                        });

                                        await invalidateConversation(
                                            conversation._id
                                        );

                                        await invalidateConversations();

                                        toast.success(
                                            'Bạn đã tham gia cuộc trò chuyện thành công!'
                                        );

                                        socketEmitor?.joinRoom({
                                            roomId: conversation._id,
                                            userId: user.id,
                                        });
                                    } catch (error: any) {
                                        toast.error(
                                            error?.message ||
                                                'Đã có lỗi xảy ra khi tham gia cuộc trò chuyện.'
                                        );
                                    }
                                }}
                            >
                                Tham gia cuộc trò chuyện
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {conversation && (
                <ChatBox
                    conversation={conversation}
                    findMessage={findMessage}
                />
            )}
        </>
    );
};

export default ConversationPage;
