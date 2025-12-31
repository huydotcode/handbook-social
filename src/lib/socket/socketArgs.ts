import { IMessage } from '@/types/entites';

const socketArgs = {
    sendRequestAddFriend: ({ receiverId }: { receiverId: string }) => ({
        receiverId,
    }),

    deleteMessage: ({
        prevMessage,
        currentMessage,
    }: {
        prevMessage: IMessage;
        currentMessage: IMessage;
    }) => ({
        prevMessage,
        currentMessage,
    }),
};
