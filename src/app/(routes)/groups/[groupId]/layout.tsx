'use client';
import { useAuth } from '@/context/AuthContext';
import ConversationService from '@/lib/services/conversation.service';
import GroupService from '@/lib/services/group.service';
import logger from '@/utils/logger';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Header from '../_components/Header';
import Sidebar from '../_components/admin/Sidebar';

interface Props {
    params: { groupId: string };
    children: React.ReactNode;
}

const GroupLayout: React.FC<Props> = ({ params, children }) => {
    const { groupId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [group, setGroup] = useState<IGroup | null>(null);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                router.push('/');
                return;
            }

            try {
                const [groupData, conversationsData] = await Promise.all([
                    GroupService.getById(groupId),
                    ConversationService.getByGroupId(groupId),
                ]);

                if (!groupData) {
                    router.push('/groups');
                    return;
                }

                setGroup(groupData);
                setConversations(conversationsData || []);

                const isMember = groupData.members.some(
                    (member) => member.user._id === user.id
                );
                const access = isMember || groupData.type === 'public';
                setCanAccess(access);
            } catch (error) {
                logger({
                    message: 'Error get group in layout' + error,
                    type: 'error',
                });
                router.push('/groups');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [groupId, user?.id, router]);

    if (isLoading || !group) {
        return (
            <div className="mx-auto w-full max-w-[1000px]">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            {canAccess && (
                <Sidebar group={group} conversations={conversations} />
            )}

            <div className="mx-auto w-full max-w-[1000px]">
                <Header group={group} />

                {canAccess && (
                    <main className="mt-4 min-h-[150vh]">{children}</main>
                )}
            </div>
        </div>
    );
};
export default GroupLayout;
