'use client';
import { useAuth } from '@/core/context/AuthContext';
import { useCheckGroupAdmin } from '@/lib/hooks/api';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

interface Props {
    children: React.ReactNode;
    params: Promise<{ groupId: string }>;
}

const ManageLayout: React.FC<Props> = ({ children, params }) => {
    const { groupId } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    // Check if user is admin or creator
    const {
        data: adminData,
        isLoading,
        isError,
    } = useCheckGroupAdmin(groupId, user?.id, {
        enabled: !!user?.id,
    });

    const isAuthorized = adminData?.isAdmin || adminData?.isCreator || false;

    // Redirect if not logged in
    useEffect(() => {
        if (!user?.id) {
            router.push('/');
        }
    }, [user?.id, router]);

    // Redirect if not authorized
    useEffect(() => {
        if (!isLoading && !isAuthorized && !isError) {
            router.push(`/groups/${groupId}`);
        }
    }, [isLoading, isAuthorized, isError, groupId, router]);

    // Redirect on error
    useEffect(() => {
        if (isError) {
            router.push('/groups');
        }
    }, [isError, router]);

    if (isLoading) {
        return (
            <div className="text-center">Đang kiểm tra quyền truy cập...</div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};

export default ManageLayout;
