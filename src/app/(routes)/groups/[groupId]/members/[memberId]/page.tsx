'use client';
import ActionMember from '@/app/(routes)/groups/_components/ActionMember';
import { InfinityPostComponent } from '@/components/post';
import { GroupUserRole } from '@/enums/GroupRole';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/lib/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { groupService } from '@/lib/api/services/group.service';

interface Props {
    params: { memberId: string; groupId: string };
}

const MemberPage = ({ params }: Props) => {
    const { memberId, groupId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [member, setMember] = useState<IMemberGroup | null>(null);
    const [group, setGroup] = useState<IGroup | null>(null);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isShowAction, setIsShowAction] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, groupData] = await Promise.all([
                    UserService.getById(memberId),
                    groupService.getById(groupId),
                ]);

                if (!groupData || !userData) {
                    router.push('/groups');
                    return;
                }

                // Fetch members paginated until the target member is found
                const findMember = async (
                    targetUserId: string
                ): Promise<IMemberGroup | null> => {
                    const pageSize = 50;
                    let page = 1;

                    while (true) {
                        const res = await groupService.getMembers(groupId, {
                            page,
                            page_size: pageSize,
                        });

                        const found = res.data.find(
                            (m) => m.user._id === targetUserId
                        );

                        if (found) return found;
                        if (!res.pagination?.hasNext) break;

                        page += 1;
                    }

                    return null;
                };

                const [foundMember, currentUserMember] = await Promise.all([
                    findMember(memberId),
                    user?.id ? findMember(user.id) : Promise.resolve(null),
                ]);

                if (!foundMember) {
                    router.push(`/groups/${groupId}/members`);
                    return;
                }

                setUserData(userData);
                setGroup(groupData as IGroup);
                setMember(foundMember);

                const isAdmin = currentUserMember?.role === GroupUserRole.ADMIN;

                setIsShowAction(isAdmin && memberId !== user?.id);
            } catch (error) {
                console.error('Error fetching member data:', error);
                router.push('/groups');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [memberId, groupId, user?.id, router]);

    if (isLoading || !member || !group || !userData) {
        return <div className="text-center">Đang tải...</div>;
    }

    return (
        <div>
            {isShowAction && <ActionMember member={member} group={group} />}

            <InfinityPostComponent
                className={'mt-6'}
                groupId={groupId}
                userId={memberId}
                showCreatePost={false}
                title={`Các bài viết của thành viên ${userData.name}`}
                type={'post-by-member'}
            />
        </div>
    );
};

export default MemberPage;
