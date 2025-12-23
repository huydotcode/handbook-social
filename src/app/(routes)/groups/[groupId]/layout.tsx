'use client';
import { useAuth } from '@/context/AuthContext';
import ConversationService from '@/lib/services/conversation.service';
import GroupService from '@/lib/services/group.service';
import { useRouter, notFound } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import Header from '../_components/Header';
import Sidebar from '../_components/admin/Sidebar';

interface Props {
    params: Promise<{ groupId: string }>;
    children: React.ReactNode;
}

const GroupLayout: React.FC<Props> = ({ params, children }) => {
    const { groupId } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const [group, setGroup] = useState<IGroup | null>(null);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                router.push('/');
                return;
            }

            try {
                // Check access first before fetching data
                const hasAccess = await GroupService.checkAccess(groupId);

                if (!hasAccess) {
                    setAccessDenied(true);
                    return;
                }

                // Only fetch data if user has access
                const [groupData, conversationsData] = await Promise.all([
                    GroupService.getById(groupId),
                    ConversationService.getByGroupId(groupId),
                ]);

                if (!groupData) {
                    setAccessDenied(true);
                    return;
                }

                setGroup(groupData);
                setConversations(conversationsData || []);
                setCanAccess(true);
            } catch (error) {
                setAccessDenied(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [groupId, user?.id, router]);

    if (accessDenied && isLoading === false) {
        notFound();
    }

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
