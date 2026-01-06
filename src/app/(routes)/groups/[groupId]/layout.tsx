'use client';
import { useAuth } from '@/core/context/AuthContext';
import { useGroupConversations } from '@/features/conversation';
import { useCheckGroupAccess, useGroup } from '@/features/group';
import { notFound, useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';
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

    // Check access first
    const {
        data: accessData,
        isLoading: isCheckingAccess,
        isError: accessError,
    } = useCheckGroupAccess(groupId, {
        enabled: !!user?.id,
    });

    const hasAccess = accessData ?? false;

    // Only fetch group data if access is granted
    const { data: group, isLoading: isLoadingGroup } = useGroup(groupId, {
        enabled: !!user?.id && hasAccess,
    });

    // Only fetch conversations if access is granted
    const { data: conversations = [], isLoading: isLoadingConversations } =
        useGroupConversations(groupId, {
            enabled: !!user?.id && hasAccess,
        });

    // Redirect to home if user is not logged in
    useEffect(() => {
        if (!user?.id) {
            router.push('/');
        }
    }, [user?.id, router]);

    // Show not found if access is denied
    if (!isCheckingAccess && (!hasAccess || accessError)) {
        notFound();
    }

    // Loading state
    const isLoading =
        isCheckingAccess || isLoadingGroup || isLoadingConversations;

    if (isLoading || !group) {
        return (
            <div className="mx-auto w-full max-w-[1000px]">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            {hasAccess && (
                <Sidebar group={group} conversations={conversations} />
            )}

            <div className="mx-auto w-full max-w-[1000px]">
                <Header group={group} />

                {hasAccess && (
                    <main className="mt-4 min-h-[150vh]">{children}</main>
                )}
            </div>
        </div>
    );
};
export default GroupLayout;
