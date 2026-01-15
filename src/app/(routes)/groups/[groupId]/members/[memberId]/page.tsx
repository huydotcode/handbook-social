'use client';
import ActionMember from '@/app/(routes)/groups/_components/ActionMember';
import { useAuth } from '@/core/context/AuthContext';
import { useGroup, useGroupMember } from '@/features/group';
import { useUser } from '@/features/user';
import { InfinityPostComponent } from '@/features/post';
import { GROUP_ROLES } from '@/types/entites';
import { notFound, useRouter } from 'next/navigation';
import { use, useEffect, useMemo } from 'react';
import { Loading } from '@/shared/components/ui';

interface Props {
    params: Promise<{ memberId: string; groupId: string }>;
}

const MemberPage = ({ params }: Props) => {
    const { memberId, groupId } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    // Fetch user data
    const { data: userData, isLoading: isLoadingUser } = useUser(memberId);

    // Fetch group data
    const { data: group, isLoading: isLoadingGroup } = useGroup(groupId);

    // Fetch member data (target member)
    const { data: member, isLoading: isLoadingMember } = useGroupMember(
        groupId,
        memberId
    );

    // Fetch current user's member data
    const { data: currentUserMember } = useGroupMember(
        groupId,
        user?.id || '',
        {
            enabled: !!user?.id,
        }
    );

    // Check if current user is admin
    const isShowAction = useMemo(() => {
        if (!currentUserMember || !user?.id) return false;
        const isAdmin = currentUserMember.role === GROUP_ROLES.ADMIN;
        return isAdmin && memberId !== user.id;
    }, [currentUserMember, user?.id, memberId]);

    const isLoading = isLoadingUser || isLoadingGroup || isLoadingMember;

    // Redirect to groups list if member not found
    useEffect(() => {
        if (!isLoading && member === null) {
            router.push(`/groups/${groupId}/members`);
        }
    }, [isLoading, member, groupId, router]);

    // Show not found if group doesn't exist
    if (!isLoading && !group) {
        return notFound();
    }

    if (isLoading || !member || !group || !userData) {
        return <Loading text="Đang tải" />;
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
