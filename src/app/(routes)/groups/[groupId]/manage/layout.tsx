'use client';
import { useAuth } from '@/context/AuthContext';
import GroupService from '@/lib/services/group.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
    children: React.ReactNode;
    params: { groupId: string };
}

const ManageLayout: React.FC<Props> = ({ children, params }) => {
    const { groupId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (!user?.id) {
                router.push('/');
                return;
            }

            try {
                const group: IGroup = await GroupService.getById(groupId);

                if (!group) {
                    router.push('/groups');
                    return;
                }

                if (group.creator._id !== user.id) {
                    router.push(`/groups/${groupId}`);
                    return;
                }

                const isAdmin = group.members.find(
                    (mem) => mem.user._id === user.id && mem.role === 'admin'
                );

                if (!isAdmin) {
                    router.push(`/groups/${groupId}`);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Error checking access:', error);
                router.push('/groups');
            } finally {
                setIsLoading(false);
            }
        };

        checkAccess();
    }, [groupId, user?.id, router]);

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
