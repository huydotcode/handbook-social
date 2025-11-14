'use client';
import { Button } from '@/components/ui/Button';
import { useAuth, useSocket } from '@/context';
import ConversationService from '@/lib/services/conversation.service';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
    className?: string;
    messageTo: string;
}

const MessageAction = ({ className = '', messageTo }: Props) => {
    const { user } = useAuth();
    const router = useRouter();
    const { socketEmitor } = useSocket();

    const handleClick = async () => {
        if (!user) return;

        const { isNew, conversation } =
            await ConversationService.getPrivateConversation({
                userId: user.id,
                friendId: messageTo,
            });

        if (!conversation) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            return;
        }

        if (isNew) {
            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: user.id,
            });

            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: messageTo,
            });
        }

        router.push(`/messages/${conversation._id}`);
    };

    return (
        <Button
            className={cn(
                'min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1',
                className
            )}
            onClick={handleClick}
            variant={'primary'}
            size={'md'}
        >
            Nhắn tin
        </Button>
    );
};

export default MessageAction;
