'use client';
import { useAuth } from '@/core/context/AuthContext';
import {
    useDeleteGroup,
    useGroupsJoined,
    useJoinGroup,
    useLeaveGroup,
} from '@/features/group/hooks/group.hook';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import Icons from '@/shared/components/ui/Icons';
import { useQueryInvalidation } from '@/shared/hooks';
import { IGroup } from '@/types/entites';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo } from 'react';
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className={'ml-2 h-10 min-w-[48px]'}
                            variant={'warning'}
                            size={'md'}
                        >
                            <Icons.Delete />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Bạn có chắc chắn muốn xóa nhóm này không?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Điều này sẽ
                                xóa vĩnh viễn nhóm này.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteGroup}>
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};
export default Action;
