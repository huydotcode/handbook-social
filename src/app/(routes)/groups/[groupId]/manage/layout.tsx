'use client';
import { useAuth } from '@/context/AuthContext';
import { groupService } from '@/lib/api/services/group.service';
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
                const group: IGroup = await groupService.getById(groupId);

                if (!group) {
                    router.push('/groups');
                    return;
                }

                if (group.creator._id !== user.id) {
                    // Check admin role via paginated members
                    const pageSize = 50;
                    let page = 1;
                    let isAdmin = false;

                    while (true) {
                        const res = await groupService.getMembers(groupId, {
                            page,
                            page_size: pageSize,
                        });

                        if (
                            res.data.some(
                                (mem) =>
                                    mem.user._id === user.id &&
                                    mem.role === 'ADMIN'
                            )
                        ) {
                            isAdmin = true;
                            break;
                        }

                        if (!res.pagination?.hasNext) break;
                        page += 1;
                    }

                    if (!isAdmin) {
                        router.push(`/groups/${groupId}`);
                        return;
                    }
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
