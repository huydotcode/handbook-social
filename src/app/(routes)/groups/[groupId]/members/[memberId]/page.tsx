'use client';
import ActionMember from '@/app/(routes)/groups/_components/ActionMember';
import { InfinityPostComponent } from '@/components/post';
import { GroupUserRole } from '@/enums/GroupRole';
import { useAuth } from '@/context/AuthContext';
import GroupService from '@/lib/services/group.service';
import UserService from '@/lib/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
                    GroupService.getById(groupId),
                ]);

                if (!groupData || !userData) {
                    router.push('/groups');
                    return;
                }

                const foundMember = groupData.members.find(
                    (m) => m.user._id === memberId
                );

                if (!foundMember) {
                    router.push(`/groups/${groupId}/members`);
                    return;
                }

                setUserData(userData);
                setGroup(groupData);
                setMember(foundMember);

                const isAdmin =
                    groupData.members.find(
                        (member) => member.user._id === user?.id
                    )?.role === GroupUserRole.ADMIN;

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
