'use client';
import { Icons } from '@/components/ui';
import { socketConfig } from '@/core/config/socket';
import queryKey from '@/lib/queryKey';
import { socketEvent, soundTypes } from '@/shared/constants';
import { useQueryInvalidation, useSound } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';
import { useAuth } from './AuthContext';

const HEARTBEAT_INTERVAL = 60000; // 1 minute

type SocketContextType = {
    socket: Socket | null;
    socketEmitor: {
        joinRoom: (args: { roomId: string; userId: string }) => void;
        deleteMessage: (args: { message: IMessage }) => void;
        pinMessage: (args: { message: IMessage }) => void;
        unpinMessage: (args: { message: IMessage }) => void;
        readMessage: (args: { roomId: string; userId: string }) => void;
        leaveRoom: (args: { roomId: string; userId: string }) => void;
    };
    isConnected: boolean;
    isLoading: boolean;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    socketEmitor: {
        joinRoom: () => {},
        deleteMessage: () => {},
        pinMessage: () => {},
        unpinMessage: () => {},
        readMessage: () => {},
        leaveRoom: () => {},
    },
    isConnected: false,
    isLoading: false,
});

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: { children: React.ReactNode }) {
    const { user, accessToken, refreshAccessToken } = useAuth();
    const queryClient = useQueryClient();
    const {
        queryClientAddMessage,
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientReadMessage,
        queryClientRemovePinnedMessage,
    } = useQueryInvalidation();

    const rawPathname = usePathname();
    const [pathname, setPathname] = useState(rawPathname);
    const { play: playMessageSound } = useSound(soundTypes.MESSAGE);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const emitJoinRoom = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.JOIN_ROOM, args);
        },
        [socket]
    );

    const emitDeleteMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.DELETE_MESSAGE, args);
        },
        [socket]
    );

    const emitPinMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.PIN_MESSAGE, args);
        },
        [socket]
    );

    const emitUnpinMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.UN_PIN_MESSAGE, args);
        },
        [socket]
    );

    const emitReadMessage = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.READ_MESSAGE, args);
        },
        [socket]
    );

    const emitLeaveRoom = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.LEAVE_ROOM, args);
        },
        [socket]
    );

    const socketEmitor = useMemo(
        () => ({
            joinRoom: emitJoinRoom,
            deleteMessage: emitDeleteMessage,
            pinMessage: emitPinMessage,
            unpinMessage: emitUnpinMessage,
            readMessage: emitReadMessage,
            leaveRoom: emitLeaveRoom,
        }),
        [
            emitJoinRoom,
            emitDeleteMessage,
            emitPinMessage,
            emitUnpinMessage,
            emitReadMessage,
            emitLeaveRoom,
        ]
    );

    useEffect(() => {
        if (rawPathname) {
            setPathname(rawPathname);
        }
    }, [rawPathname]);

    const onConnect = () => {
        setIsConnected(true);
    };

    const onDisconnect = () => {
        setIsConnected(false);
    };

    const onConnectError = async (err: any) => {
        setIsConnected(false);
        console.error('Socket connection error:', err);

        // Attempt token refresh on auth errors
        const message = typeof err === 'string' ? err : err?.message;
        if (
            message &&
            (message.includes('Unauthorized') ||
                message.includes('Authentication'))
        ) {
            try {
                await refreshAccessToken();
                if (socket) {
                    socket.disconnect();
                }
            } catch (refreshErr) {
                console.error(
                    'Failed to refresh token for socket:',
                    refreshErr
                );
            }
        }
    };

    const onReceiveMessage = useCallback(
        (message: IMessage) => {
            console.log('On Receive Message');

            if (!user) return;

            // Prefer flattened conversationId to avoid relying on populated conversation
            const conversationId =
                // @ts-ignore allow backward compatibility
                (message as any).conversationId || message.conversation?._id;

            // If still missing, skip to avoid crashes
            if (!conversationId) return;

            // If the message is sent by current user, skip (optimistic already updated)
            if (message.sender?._id === user.id) return;

            // Check if message already exists in cache (optimistic update from same tab)
            const existingMessages = queryClient.getQueryData<{
                pages: IMessage[][];
                pageParams: (number | undefined)[];
            }>(queryKey.messages.conversationId(conversationId));

            const messageExists = existingMessages?.pages.some((page) =>
                page.some((msg) => msg._id === message._id)
            );

            // Skip if message already exists (sent from this tab via REST API)
            if (messageExists) return;

            // Always add message to cache (whether in page or not)
            queryClientAddMessage({
                ...message,
                // normalize conversationId for downstream consumers
                // @ts-ignore keeping backward compatibility with existing IMessage
                conversationId,
            } as IMessage);

            const isInConversationPage = pathname.includes(
                `/messages/${conversationId}`
            );

            // Mark as read only if viewing the conversation and message is from others
            if (isInConversationPage && user.id !== message.sender._id) {
                socketEmitor.readMessage({
                    roomId: conversationId,
                    userId: user.id,
                });
            }

            // Show toast/sound only if NOT viewing the conversation and message is from others
            if (!isInConversationPage && user.id !== message.sender._id) {
                // Phát âm thanh thông báo khi nhận được tin nhắn mới
                playMessageSound();

                toast(
                    <Link
                        className="flex items-center text-primary-2"
                        href={`/messages/${conversationId}`}
                    >
                        <Icons.Message className="text-3xl" />
                        <p className="ml-2 text-sm text-primary-1">
                            Tin nhắn mới từ{' '}
                            <span className="font-semibold">
                                {message.conversation?.group
                                    ? message.conversation?.title
                                    : message.sender.name}
                            </span>
                        </p>
                    </Link>,
                    {
                        id: conversationId,
                        position: 'bottom-left',
                    }
                );
            }
        },
        [
            user,
            pathname,
            queryClient,
            queryClientAddMessage,
            socketEmitor,
            playMessageSound,
        ]
    );

    const onDeleteMessage = useCallback(
        (message: IMessage) => {
            // Normalize conversation id to handle payloads lacking populated conversation
            const conversationId =
                // @ts-ignore legacy flatten
                (message as any).conversationId ||
                (message as any).conversation?._id ||
                (message as any).conversation;

            if (!conversationId) return;

            if (
                !user ||
                user.id !== message.sender._id ||
                pathname.includes(`/messages/${conversationId}`)
            ) {
                queryClientDeleteMessage({
                    ...message,
                    conversationId,
                    conversation:
                        (message as any).conversation ||
                        ({ _id: conversationId } as any),
                } as IMessage);
            }
        },
        [user, pathname, queryClientDeleteMessage]
    );

    const onPinMessage = useCallback(
        (message: IMessage) => {
            if (
                !user ||
                user.id !== message.sender._id ||
                pathname.includes(`/messages/${message.conversation._id}`)
            ) {
                queryClientAddPinnedMessage(message);
            }
        },
        [user, pathname, queryClientAddPinnedMessage]
    );

    const onUnpinMessage = useCallback(
        (message: IMessage) => {
            if (
                !user ||
                user.id !== message.sender._id ||
                pathname.includes(`/messages/${message.conversation._id}`)
            ) {
                queryClientRemovePinnedMessage(message);
            }
        },
        [user, pathname, queryClientRemovePinnedMessage]
    );

    const onReadMessage = useCallback(
        ({ roomId, userId }: { roomId: string; userId: string }) => {
            if (pathname.includes(`/messages/${roomId}`)) {
                queryClientReadMessage(roomId, userId);
            }
        },
        [pathname, queryClientReadMessage]
    );

    const onHeartbeat = useCallback(() => {
        socket?.emit(socketEvent.HEARTBEAT);
    }, [socket]);

    const onFriendOnline = useCallback(
        (friend: IFriend) => {
            queryClient.setQueryData(
                queryKey.user.friends(user?.id),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return oldData.map((f: IFriend) =>
                        f._id === friend._id ? { ...f, isOnline: true } : f
                    );
                }
            );

            toast(`${friend.name} đã trực tuyến`, {
                id: 'friend-online-' + friend._id,
                icon: <Icons.Circle className="text-primary-2" />,
            });
        },
        [queryClient, user?.id]
    );

    // Khởi tạo socket
    useEffect(() => {
        // Require both user and access token for socket auth
        if (!user?.id || !accessToken) return;

        const socketIO = ClientIO(socketConfig.url, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: { user, accessToken },
        }) as any;

        setSocket(socketIO);
        setIsLoading(false);

        socketIO.on('connect', onConnect);
        socketIO.on('disconnect', onDisconnect);
        socketIO.on('connect_error', onConnectError);

        // Cleanup khi component unmount hoặc auth changes
        return () => {
            socketIO.disconnect();
            setSocket(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, accessToken]);

    // Gắn và gỡ các event listener khi socket hoặc các hàm callback thay đổi
    useEffect(() => {
        if (!socket) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, onReceiveMessage);
        socket.on(socketEvent.DELETE_MESSAGE, onDeleteMessage);
        socket.on(socketEvent.PIN_MESSAGE, onPinMessage);
        socket.on(socketEvent.UN_PIN_MESSAGE, onUnpinMessage);
        socket.on(socketEvent.READ_MESSAGE, onReadMessage);
        socket.on(socketEvent.FRIEND_ONLINE, onFriendOnline);

        const heartbeatInterval = setInterval(onHeartbeat, HEARTBEAT_INTERVAL);

        return () => {
            socket.off(socketEvent.RECEIVE_MESSAGE, onReceiveMessage);
            socket.off(socketEvent.DELETE_MESSAGE, onDeleteMessage);
            socket.off(socketEvent.PIN_MESSAGE, onPinMessage);
            socket.off(socketEvent.UN_PIN_MESSAGE, onUnpinMessage);
            socket.off(socketEvent.READ_MESSAGE, onReadMessage);
            socket.off(socketEvent.FRIEND_ONLINE, onFriendOnline);

            clearInterval(heartbeatInterval);
        };
    }, [
        socket,
        onReceiveMessage,
        onDeleteMessage,
        onPinMessage,
        onUnpinMessage,
        onReadMessage,
        onFriendOnline,
        onHeartbeat,
    ]);

    const values: SocketContextType = {
        socket,
        socketEmitor,
        isLoading,
        isConnected,
    };

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
