'use client';
import { useAuth } from '@/core/context/AuthContext';
import { useRecommendedGroups } from '@/features/group';
import { InfinityPostComponent } from '@/features/post/components';
import { Button } from '@/shared/components/ui/Button';
import Image from 'next/image';
import { Sidebar } from './_components';

const GroupsPage = () => {
    const { user } = useAuth();
    const { data: groups } = useRecommendedGroups(user?.id);

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
