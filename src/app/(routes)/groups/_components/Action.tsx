'use client';
import { ConfirmModal } from '@/components/ui';
import Icons from '@/components/ui/Icons';

import { Button } from '@/components/ui/Button';
import { useGroupsJoined } from '@/core/context/AppContext';
import { useAuth } from '@/core/context/AuthContext';
import { useQueryInvalidation } from '@/shared/hooks';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo, useState } from 'react';
import {
    useDeleteGroup,
    useJoinGroup,
    useLeaveGroup,
} from '@/lib/hooks/api/useGroup';
interface Props {
    group: IGroup;
}

const Action: React.FC<Props> = ({ group }) => {
    const groupId = group._id;
    const { user } = useAuth();
    const router = useRouter();
    const { data: groupJoined } = useGroupsJoined(user?.id);
    const { invalidateGroups, invalidateConversations } =
        useQueryInvalidation();
    const joinGroup = useJoinGroup();
    const leaveGroup = useLeaveGroup();
    const deleteGroup = useDeleteGroup();
    const isPending =
        joinGroup.isPending || leaveGroup.isPending || deleteGroup.isPending;

    const isJoinGroup = groupJoined?.some((item) => item._id === groupId);

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const isCreator = useMemo(() => {
        return group.creator._id == user?.id;
    }, [group.creator._id, user?.id]);

    const handleJoinGroup: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await joinGroup.mutateAsync(groupId);
            await invalidateGroups(user?.id as string);
        } catch (error) {
            console.error('Join group failed:', error);
        }
    };

    const handleOutGroup = async () => {
        try {
            await leaveGroup.mutateAsync(groupId);
            await invalidateGroups(user?.id as string);

            await invalidateConversations();

            router.push('/groups');
        } catch (error) {
            console.error('Leave group failed:', error);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup.mutateAsync(groupId);
            await invalidateGroups(user?.id as string);
            await invalidateConversations();

            router.push('/groups');
        } catch (error) {
            console.error('Delete group failed:', error);
        }
    };

    return (
        <div className="flex items-center">
            {!isCreator && (
                <Button
                    className={'h-10 min-w-[48px]'}
                    variant={isJoinGroup ? 'warning' : 'primary'}
                    size={'sm'}
                    disabled={isPending}
                    onClick={isJoinGroup ? handleOutGroup : handleJoinGroup}
                >
                    {isPending ? (
                        <Icons.Loading />
                    ) : isJoinGroup ? (
                        <Icons.Users />
                    ) : (
                        <Icons.PersonAdd />
                    )}

                    <p className="ml-2 md:hidden">
                        {isJoinGroup && 'Rời nhóm'}
                        {!isJoinGroup && 'Tham gia nhóm'}
                    </p>
                </Button>
            )}

            {isCreator && (
                <Button
                    className={'ml-2 h-10 min-w-[48px]'}
                    variant={'warning'}
                    size={'md'}
                    onClick={() => setOpenModalDelete(true)}
                >
                    <Icons.Delete />
                </Button>
            )}

            {openModalDelete && (
                <ConfirmModal
                    cancelText="Hủy"
                    confirmText="Xóa"
                    message="Bạn có chắc chắn muốn xóa nhóm này không?"
                    onClose={() => setOpenModalDelete(false)}
                    onConfirm={handleDeleteGroup}
                    open={openModalDelete}
                    setShow={setOpenModalDelete}
                    title="Xóa nhóm"
                />
            )}
        </div>
    );
};
export default Action;
