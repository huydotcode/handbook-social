'use client';
import { ConfirmModal } from '@/components/ui';
import Icons from '@/components/ui/Icons';

import { Button } from '@/components/ui/Button';
import { useGroupsJoined } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { usePathname, useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
interface Props {
    group: IGroup;
}

const Action: React.FC<Props> = ({ group }) => {
    const groupId = group._id;
    const { user } = useAuth();
    const router = useRouter();
    const { data: groupJoined } = useGroupsJoined(user?.id);
    const [isPending, setIsPending] = useState(false);
    const { invalidateGroups, invalidateConversations } =
        useQueryInvalidation();
    const path = usePathname();

    const isJoinGroup = groupJoined?.some((item) => item._id === groupId);

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const isCreator = useMemo(() => {
        return group.creator._id == user?.id;
    }, [group.creator._id, user?.id]);

    const handleJoinGroup: FormEventHandler = async (e) => {
        e.preventDefault();

        setIsPending(true);

        try {
            await GroupService.join({
                groupId,
                userId: user?.id as string,
            });

            await invalidateGroups(user?.id as string);

            toast.success('Đã tham gia nhóm');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tham gia nhóm!');
        } finally {
            setIsPending(false);
        }
    };

    const handleOutGroup = async () => {
        setIsPending(true);

        try {
            await GroupService.leave({
                groupId,
                userId: user?.id as string,
                path,
            });

            await invalidateGroups(user?.id as string);

            await invalidateConversations();

            toast.success('Đã rời khỏi nhóm');

            router.push('/groups');
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi rời khỏi nhóm!');
        } finally {
            setIsPending(false);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await GroupService.delete(groupId);

            toast.success('Xóa nhóm thành công');

            await invalidateGroups(user?.id as string);
            await invalidateConversations();

            router.push('/groups');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa nhóm');
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
