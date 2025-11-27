import { useAuth } from '@/context';
import queryKey from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useQueryInvalidation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Các hàm invalidate cho từng loại query
    const invalidateMessages = useCallback(
        async (conversationId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(conversationId),
            });
        },
        [queryClient]
    );

    const queryClientAddMessage = useCallback(
        (message: IMessage) => {
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

                    if (oldMessages.pages.length === 0) {
                        return {
                            pages: [[message]],
                            pageParams: [1],
                        };
                    }

                    const newPage = [message, ...oldMessages.pages[0]];

                    return {
                        pages: [newPage, ...oldMessages.pages.slice(1)],
                        pageParams: oldMessages.pageParams,
                    };
                }
            );

            queryClient.setQueryData(
                queryKey.conversations.userId(message.conversation._id),
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

                    return oldConversations.map((conversation) => {
                        if (conversation._id === message.conversation._id) {
                            return {
                                ...conversation,
                                lastMessage: message,
                            };
                        }
                        return conversation;
                    });
                }
            );
        },
        [queryClient, user?.id]
    );

    const queryClientAddPinnedMessage = useCallback(
        (message: IMessage) => {
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
                        pages: oldMessages.pages.map((page) => {
                            return page.map((msg) => {
                                if (msg._id === message._id) {
                                    return {
                                        ...msg,
                                        isPin: true,
                                    };
                                }
                                return msg;
                            });
                        }),
                        pageParams: oldMessages.pageParams,
                    };
                }
            );
        },
        [queryClient]
    );

    const queryClientRemovePinnedMessage = useCallback(
        (message: IMessage) => {
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
                        pages: oldMessages.pages.map((page) => {
                            return page.map((msg) => {
                                if (msg._id === message._id) {
                                    return {
                                        ...msg,
                                        isPin: false,
                                    };
                                }
                                return msg;
                            });
                        }),
                        pageParams: oldMessages.pageParams,
                    };
                }
            );
        },
        [queryClient]
    );

    const queryClientDeleteMessage = useCallback(
        (message: IMessage) => {
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

                    const newPages = oldMessages.pages.map((page) =>
                        page.filter((msg) => msg._id !== message._id)
                    );

                    return {
                        pages: newPages,
                        pageParams: oldMessages.pageParams,
                    };
                }
            );

            queryClient.setQueryData(
                queryKey.conversations.id(message.conversation._id),
                (oldConversation: IConversation | undefined) => {
                    if (!oldConversation) return oldConversation;

                    const messages = queryClient.getQueryData<{
                        pages: IMessage[][];
                        pageParams: (number | undefined)[];
                    }>(
                        queryKey.messages.conversationId(
                            message.conversation._id
                        )
                    );

                    const allMessages = messages?.pages.flat() || [];

                    if (!allMessages || allMessages.length === 0) {
                        return {
                            ...oldConversation,
                            lastMessage: null,
                        };
                    }

                    const index = allMessages.findIndex(
                        (msg: IMessage) => msg._id === message._id
                    );

                    return {
                        ...oldConversation,
                        lastMessage:
                            index === -1
                                ? allMessages[0]
                                : allMessages[index - 1] ||
                                  allMessages[index + 1] ||
                                  null,
                    };
                }
            );

            queryClient.setQueryData(
                queryKey.conversations.userId(user?.id as string),
                (oldConversations: IConversation[] | undefined | null) => {
                    if (!oldConversations) return oldConversations;

                    return oldConversations.map((conversation) => {
                        if (conversation._id === message.conversation._id) {
                            const messages = queryClient.getQueryData<{
                                pages: IMessage[][];
                                pageParams: (number | undefined)[];
                            }>(
                                queryKey.messages.conversationId(
                                    conversation._id
                                )
                            );

                            const allMessages = messages?.pages.flat() || [];

                            if (!allMessages || allMessages.length === 0) {
                                return {
                                    ...conversation,
                                    lastMessage: null,
                                };
                            }

                            const index = allMessages.findIndex(
                                (msg: IMessage) => msg._id === message._id
                            );

                            return {
                                ...conversation,
                                lastMessage:
                                    index === -1
                                        ? allMessages[0]
                                        : allMessages[index - 1] ||
                                          allMessages[index + 1] ||
                                          null,
                            };
                        }
                        return conversation;
                    });
                }
            );
        },
        [queryClient, user?.id]
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
        async (conversationId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(conversationId),
            });
        },
        [queryClient]
    );

    const invalidateConversations = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey.conversations.userId(user?.id as string),
        });
    }, [queryClient, user?.id]);

    const invalidateProfile = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.profile(userId),
            });
        },
        [queryClient]
    );

    const invalidateConversation = useCallback(
        async (conversationId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.conversations.id(conversationId),
            });
        },
        [queryClient]
    );

    const invalidateAfterSendMessage = useCallback(
        async (conversationId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(conversationId),
            });
            await queryClient.invalidateQueries({
                queryKey: queryKey.conversations.userId(user?.id as string),
            });
            await queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(conversationId),
            });
        },
        [queryClient, user?.id]
    );

    // Tạo các hook với các key bên dưới
    const invalidateSearch = useCallback(
        async (q: string, type: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.search.general(q, type),
            });
        },
        [queryClient]
    );

    const invalidateFollowings = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.followings(userId),
            });
        },
        [queryClient]
    );

    const invalidateFriends = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.friends(userId),
            });
        },
        [queryClient]
    );

    const invalidateRequests = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.requests(userId),
            });
        },
        [queryClient]
    );

    const invalidateNotifications = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.notifications(userId),
            });
        },
        [queryClient]
    );

    const invalidateGroups = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.user.groups(userId),
            });
        },
        [queryClient]
    );

    const invalidateNewFeedPosts = useCallback(
        async ({
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
            await queryClient.invalidateQueries({
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

    const invalidatePosts = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey.posts.all(),
        });
    }, [queryClient]);

    const invalidatePost = useCallback(
        async (postId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.posts.id(postId),
            });
        },
        [queryClient]
    );

    const invalidateComments = useCallback(
        async (postId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.posts.comments(postId),
            });
        },
        [queryClient]
    );

    const invalidateReplyComments = useCallback(
        async (commentId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.posts.replyComments(commentId),
            });
        },
        [queryClient]
    );

    const invalidateLocations = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey.locations.list(),
        });
    }, [queryClient]);

    const invalidateCategories = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey.categories.list(),
        });
    }, [queryClient]);

    const invalidateItems = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey.items.list(),
        });
    }, [queryClient]);

    const invalidateItemsBySeller = useCallback(
        async (sellerId: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKey.items.bySeller(sellerId),
            });
        },
        [queryClient]
    );

    const invalidateUser = useCallback(
        async (userId: string) => {
            await queryClient.invalidateQueries({
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
