'use client';
import { cn } from '@/lib/utils';
import { FileUploaderWrapper } from '@/shared/components/shared/FileUploader';
import MessageSkeleton from '@/shared/components/skeleton/MessageSkeleton';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import {
    useBreakpoint,
    useMessageHandling,
    useQueryInvalidation,
} from '@/shared/hooks';
import { uploadImagesWithFiles } from '@/shared/utils/upload-image';
import { IConversation, IMessage } from '@/types/entites';
import { useRouter } from 'next/navigation';
import React, {
    KeyboardEventHandler,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import ChatHeader from './ChatHeader';
import InfomationConversation from './InfomationConversation';
import InputMessage from './InputMessage';
import Message from './Message';
import SearchMessage from './SearchMessage';
import MessageService from '../services/message.service';

interface Props {
    className?: string;
    conversation: IConversation;
    findMessage?: string;
}

const ChatBox: React.FC<Props> = ({ className, conversation, findMessage }) => {
    const { invalidateAfterSendMessage } = useQueryInvalidation();
    const router = useRouter();
    const { breakpoint } = useBreakpoint();
    const [isSendMessage, setIsSendMessage] = useState<
        boolean | { text: string; files: File[] }
    >(false);

    const {
        messages,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        handleFindMessage,
        isFind,
        setIsFind,
        fetchNextPage,
    } = useMessageHandling(conversation._id);

    const lastMessage = useMemo(() => {
        return messages && messages.length > 0 ? messages[0] : null;
    }, [messages]);

    // Memoize grouped messages with date formatting
    const groupedMessages = useMemo(() => {
        if (!messages?.length) return {};

        const formatter = new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return messages.reduce(
            (acc, message) => {
                const date = formatter.format(new Date(message.createdAt));
                (acc[date] = acc[date] || []).push(message);
                return acc;
            },
            {} as Record<string, IMessage[]>
        );
    }, [messages]);

    // State UI
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);

    // Ref UI
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Xử lý tải ảnh lên khi kéo thả
    const handleChangeUploadFile = async (files: File[]) => {
        setIsSendMessage({ text: '', files });
        try {
            toast.loading('Đang tải ảnh lên...', {
                id: 'uploadImages',
                duration: 3000,
            });

            const images = await uploadImagesWithFiles({
                files,
            });

            await MessageService.send({
                roomId: conversation._id,
                text: '',
                images: images.map((image) => image._id),
            });

            await invalidateAfterSendMessage(conversation._id);
            setIsSendMessage(false);
        } catch (error) {
            setIsSendMessage(false);
            toast.error('Đã có lỗi xảy ra');
        }
    };

    // Xử lý nhấn Esc để đóng khung tìm kiếm
    const handleKeyDownEsc: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Escape' && openSearch) {
            setOpenSearch(false);
        }
    };

    // Cuộn xuống dưới cùng
    const handleScrollDown = () => {
        if (!bottomRef.current) return;
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    // Xử lý mở khung tìm kiếm
    const handleOpenSearch = () => {
        setOpenInfo(false);
        setOpenSearch((prev) => !prev);
    };

    // Xử ly mở khung thông tin
    const handleOpenInfo = () => {
        setOpenSearch(false);
        setOpenInfo((prev) => !prev);
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

    // Kiểm tra nếu đang ở bottomRef thì không hiển thị nút scroll down
    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setShowScrollDown(!entry.isIntersecting),
            { threshold: 1 }
        );

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, []);

    // Xử lý tìm kiếm tin nhắn
    useEffect(() => {
        setIsFind(false);
    }, [findMessage, setIsFind]);

    // Nếu màn hình lớn thì đóng cả 2 khung tìm kiếm và thông tin
    useEffect(() => {
        if (breakpoint == 'lg') {
            setOpenInfo(false);
            setOpenSearch(false);
        }
    }, [breakpoint]);

    // Xử lý tìm kiếm tin nhắn
    useEffect(() => {
        if (findMessage && !isFind && messages && !isFetchingNextPage) {
            (async () => {
                try {
                    await handleFindMessage(findMessage);
                } catch (error: any) {
                    toast.error('Không tìm thấy tin nhắn');
                }
            })();
        }
    }, [
        findMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFind,
        messages,
        handleFindMessage,
    ]);

    // Cuộn xuống dưới cùng khi gửi tin nhắn
    useEffect(() => {
        if (isSendMessage) {
            handleScrollDown();
        }
    }, [isSendMessage]);

    return (
        <>
            <div
                className={cn('relative flex h-full w-full', className)}
                onKeyDown={handleKeyDownEsc}
            >
                <FileUploaderWrapper
                    className={cn(
                        'flex h-full w-full flex-1 flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                        className,
                        openInfo && 'md:hidden',
                        openSearch && 'md:hidden'
                    )}
                    handleChange={handleChangeUploadFile}
                >
                    <ChatHeader
                        openInfo={openInfo}
                        openSearch={openSearch}
                        currentRoom={conversation}
                        handleOpenInfo={handleOpenInfo}
                        handleOpenSearch={handleOpenSearch}
                    />

                    <div className="relative max-h-[calc(100vh-194px)] w-full flex-1 overflow-y-auto overflow-x-hidden py-2">
                        {isFetchingNextPage && (
                            <div className="absolute left-1/2 top-4 -translate-x-1/2 text-3xl">
                                <Icons.Loading />
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl">
                                <Icons.Loading />
                            </div>
                        )}

                        <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden p-2">
                            <div ref={bottomRef} />

                            {isSendMessage && (
                                <div className="mb-2 flex w-full flex-col items-end justify-end">
                                    {typeof isSendMessage === 'object' ? (
                                        <div className="flex w-full flex-col items-end">
                                            {isSendMessage.files?.length >
                                                0 && (
                                                <div className="mb-1 flex flex-col flex-wrap items-end">
                                                    {isSendMessage.files.map(
                                                        (file, idx) => {
                                                            const isImage =
                                                                file.type.startsWith(
                                                                    'image/'
                                                                );
                                                            const isVideo =
                                                                file.type.startsWith(
                                                                    'video/'
                                                                );
                                                            const fileUrl =
                                                                URL.createObjectURL(
                                                                    file
                                                                );
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="mb-1"
                                                                >
                                                                    {isImage && (
                                                                        <img
                                                                            src={
                                                                                fileUrl
                                                                            }
                                                                            alt="uploading"
                                                                            className="max-h-[60vh] max-w-[30vw] rounded-xl rounded-r-md object-cover md:max-w-[60vw]"
                                                                        />
                                                                    )}
                                                                    {isVideo && (
                                                                        <video
                                                                            src={
                                                                                fileUrl
                                                                            }
                                                                            className="max-w-[30vw] md:max-w-[60vw]"
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                            {isSendMessage.text &&
                                                isSendMessage.text.trim() && (
                                                    <div className="relative max-w-[70%] break-words rounded-xl bg-primary-2 px-3 py-2 text-white">
                                                        <p className="max-w-full whitespace-pre-wrap break-words">
                                                            {isSendMessage.text
                                                                .split(' ')
                                                                .map(
                                                                    (
                                                                        text,
                                                                        idx
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                text
                                                                            }{' '}
                                                                        </span>
                                                                    )
                                                                )}
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <div className="w-[200px] max-w-full opacity-70">
                                            <MessageSkeleton />
                                        </div>
                                    )}

                                    <span className="mt-1 text-xs text-secondary-1">
                                        Đang gửi...
                                    </span>
                                </div>
                            )}

                            {groupedMessages &&
                                messages &&
                                Object.keys(groupedMessages).map((date) => (
                                    <div key={date} className="relative">
                                        <div className="mt-2 pb-1 text-center text-xs text-secondary-1">
                                            {date}
                                        </div>
                                        <div
                                            className={'flex flex-col-reverse'}
                                        >
                                            {groupedMessages[date].map(
                                                (message) => (
                                                    <Message
                                                        key={message._id}
                                                        messages={messages}
                                                        data={message}
                                                        searchMessage={
                                                            findMessage
                                                        }
                                                        isLastMessage={
                                                            lastMessage?._id ===
                                                            message._id
                                                        }
                                                        isSearchMessage={
                                                            findMessage ===
                                                            message._id
                                                        }
                                                        handleClick={
                                                            findMessage
                                                                ? handleOpenSearch
                                                                : undefined
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}

                            <div ref={topRef} className={'p-2'} />
                        </div>

                        {findMessage && (
                            <Button
                                className={cn(
                                    'absolute left-1/2 top-4 -translate-x-1/2'
                                )}
                                variant={'secondary'}
                                onClick={() => {
                                    router.push(
                                        `/messages/${conversation._id}`
                                    );
                                    setOpenSearch(false);
                                }}
                            >
                                Thoát tìm kiếm
                            </Button>
                        )}
                    </div>

                    <div className="relative flex justify-center border-t py-2 dark:border-t-dark-secondary-2">
                        {showScrollDown && (
                            <Button
                                className={cn(
                                    'absolute -top-12 left-1/2 z-50 w-fit -translate-x-1/2 opacity-30 transition-all duration-300 hover:opacity-100'
                                )}
                                onClick={handleScrollDown}
                            >
                                <Icons.ArrowDown className="h-4 w-4" />
                            </Button>
                        )}

                        <InputMessage
                            currentRoom={conversation}
                            setIsSendMessage={setIsSendMessage}
                        />
                    </div>
                </FileUploaderWrapper>

                <div
                    className={cn(
                        'transition-all duration-300 lg:hidden lg:transition-none',
                        {
                            'w-[300px] lg:block lg:w-full':
                                openInfo || openSearch,
                            'w-0 lg:block': !openInfo && !openSearch,
                        }
                    )}
                >
                    {openSearch && (
                        <SearchMessage
                            openSearch={openSearch}
                            conversationId={conversation._id}
                            setOpenSearch={setOpenSearch}
                        />
                    )}

                    {openInfo && (
                        <InfomationConversation
                            messages={messages || []}
                            conversation={conversation}
                            setOpenInfo={setOpenInfo}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatBox;
