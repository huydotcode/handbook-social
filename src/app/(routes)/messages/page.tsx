'use client';
'use client';
import { useAuth } from '@/core/context/AuthContext';
import { useConversations } from '@/core/context/SocialContext';
import ConversationItem from '@/features/message/components/ConversationItem';

const MessagesPage = () => {
    const { user } = useAuth();
    const { data: conversations } = useConversations(user?.id);

    return (
        <div className="flex h-full w-full flex-col items-center space-y-4 rounded-xl bg-white p-8 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Xin chào, {user?.name}!</h1>
                <p className="mt-4 text-sm text-secondary-1">
                    Chọn một cuộc hội thoại để bắt đầu trò chuyện
                </p>
            </div>

            {conversations && (
                <div className="w-full max-w-md">
                    <h2 className="mb-2 text-sm font-semibold">
                        Cuộc trò chuyện gần đây
                    </h2>
                    {conversations.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {conversations.slice(0, 3).map((conversation) => (
                                <ConversationItem
                                    key={conversation._id}
                                    data={conversation}
                                />
                            ))}
                        </div>
                    )}

                    {conversations.length === 0 && (
                        <div className="w-full max-w-md">
                            <h2 className="mb-2 text-center text-sm text-secondary-1">
                                Không có cuộc trò chuyện
                            </h2>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
