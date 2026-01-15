'use client';
import { InfinityPostComponent } from '@/features/post/components';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/core/context/AuthContext';
import GroupService from '@/features/group/services/group.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Sidebar } from './_components';
import { IGroup } from '@/types/entites';

const GroupsPage = () => {
    const { user } = useAuth();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await GroupService.getRecommendedGroups(user.id);
                setGroups(data || []);
            } catch (error) {
                console.error('Error fetching recommended groups:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroups();
    }, [user?.id]);

    if (isLoading) {
        return (
            <>
                <Sidebar />
                <div className="mx-auto max-w-[700px]">
                    <div className="text-center">Đang tải...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar />

            <div className="mx-auto max-w-[700px]">
                {groups && groups.length > 0 && (
                    <>
                        <h5 className="text-xl font-bold">Nhóm gợi ý</h5>

                        <div className="mt-2 grid grid-cols-4 gap-4 p-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {groups.map((group) => (
                                <Button
                                    className="flex h-[100px] flex-col items-center rounded-xl bg-secondary-1 p-4 dark:bg-dark-secondary-1"
                                    key={group._id}
                                    href={`/groups/${group._id}`}
                                >
                                    <Image
                                        src={group.avatar.url}
                                        alt={group.name}
                                        width={50}
                                        height={50}
                                    />

                                    <h5 className="text-primary-11 dark:text-dark-primary-11 mt-2 max-w-full overflow-clip text-center text-sm font-bold">
                                        {group.name}
                                    </h5>
                                </Button>
                            ))}
                        </div>
                    </>
                )}

                <InfinityPostComponent
                    className="mt-2"
                    title="Hoạt động gần đây"
                    type="new-feed-group"
                />
            </div>
        </>
    );
};
export default GroupsPage;
