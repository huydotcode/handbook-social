import { useAuth } from '@/core/context';
import queryKey from '@/lib/react-query/query-key';
import { IConversation, IMessage } from '@/types/entites';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useQueryInvalidation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Helper: Extract last message from cache after filtering deleted message
    const getLastMessage = useCallback(
        (conversationId: string, excludeMessageId?: string) => {
            const messages = queryClient.getQueryData<{
                pages: IMessage[][];
                pageParams: (number | undefined)[];
            }>(queryKey.messages.conversationId(conversationId));

            const allMessages = messages?.pages.flat() || [];

            if (!allMessages || allMessages.length === 0) {
                return null;
            }

            if (!excludeMessageId) {
                return allMessages[0];
            }

            const index = allMessages.findIndex(
                (msg: IMessage) => msg._id === excludeMessageId
            );

            return index === -1
                ? allMessages[0]
                : allMessages[index - 1] || allMessages[index + 1] || null;
        },
        [queryClient]
    );

    // Các hàm invalidate cho từng loại query
    const invalidateMessages = useCallback(
        (conversationId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(conversationId),
            });
        },
        [queryClient]
    );

    const queryClientAddMessage = useCallback(
        (message: IMessage) => {
            // Normalize conversationId to avoid relying on populated conversation object
            const conversationId =
                (message as any).conversationId ||
                (message as any).conversation?._id ||
                (message as any).conversation;

            if (!conversationId) {
                console.warn('queryClientAddMessage missing conversationId');
                return;
            }

            const normalizedMessage = {
                ...message,
                conversationId,
            } as IMessage;

            queryClient.setQueryData(
                queryKey.messages.conversationId(conversationId),
                (
                    oldData:
                        | {
                              pages: IMessage[][];
                              pageParams: (number | undefined)[];
                          }
                        | undefined
                ) => {
                    if (!oldData) {
                        return {
                            pages: [[normalizedMessage]],
                            pageParams: [1],
                        };
                    }

                    if (!oldData.pages || oldData.pages.length === 0) {
                        return {
                            pages: [[normalizedMessage]],
                            pageParams: [1],
                        };
                    }

                    const alreadyExists = oldData.pages.some((page) =>
                        page.some((msg) => msg._id === normalizedMessage._id)
                    );

                    if (alreadyExists) {
                        return oldData;
                    }

                    return {
                        pages: [
                            [normalizedMessage, ...oldData.pages[0]],
                            ...oldData.pages.slice(1),
                        ],
                        pageParams: oldData.pageParams,
                    };
                }
            );

            queryClient.setQueryData(
                queryKey.conversations.userId(conversationId),
                (oldConversation: IConversation | undefined) => {
                    if (!oldConversation) return oldConversation;
                    return {
                        ...oldConversation,
                        lastMessage: message,
                    };
                }
            );

            queryClient.setQueryData(
                queryKey.conversations.userId(user?.id as string),
                (oldConversations: IConversation[] | undefined | null) => {
                    if (!oldConversations) return oldConversations;
                    return oldConversations.map((conversation) =>
                        conversation._id === conversationId
                            ? { ...conversation, lastMessage: message }
                            : conversation
                    );
                }
            );
        },
        [queryClient, user?.id]
    );

    const updateMessagePin = useCallback(
        (message: IMessage, isPinned: boolean) => {
            queryClient.setQueryData(
                queryKey.messages.conversationId(message.conversation._id),
                (
                    oldMessages:
                        | {
                              pages: IMessage[][];
                              pageParams: (number | undefined)[];
                          }
                        | undefined
                ) => {
                    if (!oldMessages) return oldMessages;
                    return {
                        pages: oldMessages.pages.map((page) =>
                            page.map((msg) =>
                                msg._id === message._id
                                    ? { ...msg, isPin: isPinned }
                                    : msg
                            )
                        ),
                        pageParams: oldMessages.pageParams,
                    };
                }
            );
        },
        [queryClient]
    );

    const queryClientAddPinnedMessage = useCallback(
        (message: IMessage) => {
            updateMessagePin(message, true);
        },
        [updateMessagePin]
    );

    const queryClientRemovePinnedMessage = useCallback(
        (message: IMessage) => {
            updateMessagePin(message, false);
        },
        [updateMessagePin]
    );

    const queryClientDeleteMessage = useCallback(
        (message: IMessage) => {
            const conversationId = message.conversation._id;

            queryClient.setQueryData(
                queryKey.messages.conversationId(conversationId),
                (
                    oldMessages:
                        | {
                              pages: IMessage[][];
                              pageParams: (number | undefined)[];
                          }
                        | undefined
                ) => {
                    if (!oldMessages) return oldMessages;
                    return {
                        pages: oldMessages.pages.map((page) =>
                            page.filter((msg) => msg._id !== message._id)
                        ),
                        pageParams: oldMessages.pageParams,
                    };
                }
            );

            const updateLastMessage = (
                conversation: IConversation | undefined
            ) => {
                if (!conversation) return conversation;
                return {
                    ...conversation,
                    lastMessage: getLastMessage(conversationId, message._id),
                };
            };

            queryClient.setQueryData(
                queryKey.conversations.id(conversationId),
                updateLastMessage
            );

            queryClient.setQueryData(
                queryKey.conversations.userId(user?.id as string),
                (oldConversations: IConversation[] | undefined | null) => {
                    if (!oldConversations) return oldConversations;
                    return oldConversations.map((conversation) =>
                        conversation._id === conversationId
                            ? updateLastMessage(conversation)
                            : conversation
                    );
                }
            );
        },
        [queryClient, user?.id, getLastMessage]
    );

    const queryClientReadMessage = useCallback(
        (conversationId: string, userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(conversationId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.userId(user?.id as string),
            });
        },
        [queryClient, user?.id]
    );

    const invalidatePinnedMessages = useCallback(
        (conversationId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(conversationId),
            });
        },
        [queryClient]
    );

    const invalidateConversations = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.conversations.userId(user?.id as string),
        });
    }, [queryClient, user?.id]);

    const invalidateProfile = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.profile(userId),
            });
        },
        [queryClient]
    );

    const invalidateConversation = useCallback(
        (conversationId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.id(conversationId),
            });
        },
        [queryClient]
    );

    const invalidateAfterSendMessage = useCallback(
        (conversationId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(conversationId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.userId(user?.id as string),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(conversationId),
            });
        },
        [queryClient, user?.id]
    );

    const invalidateSearch = useCallback(
        (q: string, type: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.search.general(q, type),
            });
        },
        [queryClient]
    );

    const invalidateFollowings = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.followings(userId),
            });
        },
        [queryClient]
    );

    const invalidateFriends = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.friends(userId),
            });
        },
        [queryClient]
    );

    const invalidateRequests = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.requests(userId),
            });
        },
        [queryClient]
    );

    const invalidateNotifications = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.notifications(userId),
            });
        },
        [queryClient]
    );

    const invalidateGroups = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.groups(userId),
            });
        },
        [queryClient]
    );

    const invalidateNewFeedPosts = useCallback(
        ({
            type,
            userId,
            groupId,
            username,
        }: {
            type?: string;
            userId?: string;
            groupId?: string;
            username?: string;
        }) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.newFeed({
                    type,
                    userId,
                    groupId,
                    username,
                }),
            });
        },
        [queryClient]
    );

    const invalidatePosts = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.posts.all(),
        });
    }, [queryClient]);

    const invalidatePost = useCallback(
        (postId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.id(postId),
            });
        },
        [queryClient]
    );

    const invalidateComments = useCallback(
        (postId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(postId),
            });
        },
        [queryClient]
    );

    const invalidateReplyComments = useCallback(
        (commentId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.posts.replyComments(commentId),
            });
        },
        [queryClient]
    );

    const invalidateLocations = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.locations.list(),
        });
    }, [queryClient]);

    const invalidateCategories = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.categories.list(),
        });
    }, [queryClient]);

    const invalidateItems = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.items.list(),
        });
    }, [queryClient]);

    const invalidateItemsBySeller = useCallback(
        (sellerId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.items.bySeller(sellerId),
            });
        },
        [queryClient]
    );

    const invalidateUser = useCallback(
        (userId: string) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.user.id(userId),
            });
        },
        [queryClient]
    );

    return {
        queryClientAddMessage,
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientReadMessage,
        queryClientRemovePinnedMessage,
        invalidateMessages,
        invalidatePinnedMessages,
        invalidateConversations,
        invalidateConversation,
        invalidateProfile,
        invalidateAfterSendMessage,
        invalidateSearch,
        invalidateFollowings,
        invalidateFriends,
        invalidateRequests,
        invalidateNotifications,
        invalidateGroups,
        invalidateNewFeedPosts,
        invalidatePosts,
        invalidatePost,
        invalidateComments,
        invalidateReplyComments,
        invalidateLocations,
        invalidateCategories,
        invalidateItems,
        invalidateItemsBySeller,
        invalidateUser,
    };
};

export default useQueryInvalidation;
