'use client';

import { useAuth } from '@/core/context/AuthContext';
import { useFriends } from '@/features/friend/hooks/friend.hook';
import { useGroupMembers, useInviteGroup } from '@/features/group/hooks/group.hook';
import { Button } from '@/shared/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import Icons from '@/shared/components/ui/Icons';
import { IGroup } from '@/types/entites';
import Image from 'next/image';
import React, { useState } from 'react';

interface Props {
    group: IGroup;
}

const InviteFriendModal: React.FC<Props> = ({ group }) => {
    const { user } = useAuth();
    const { data: friends } = useFriends(user?.id as string, !!user?.id);
    const { data: membersObj } = useGroupMembers(group._id);

    const inviteGroup = useInviteGroup();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const membersList = membersObj?.data || [];
    const memberIds = membersList.map((m: any) => m.user._id);

    const availableFriends = friends?.filter((f) => !memberIds.includes(f._id));

    const handleSelect = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        } else {
            setSelectedUsers((prev) => [...prev, userId]);
        }
    };

    const handleInvite = async () => {
        if (selectedUsers.length === 0) return;
        try {
            await inviteGroup.mutateAsync({
                groupId: group._id,
                userIds: selectedUsers,
            });
            setIsOpen(false);
            setSelectedUsers([]);
        } catch (error) {
            console.error('Lỗi khi mời bạn bè:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="ml-2 h-10 min-w-[48px]" variant="primary" size="sm">
                    <Icons.PersonAdd />
                    <p className="ml-2 md:hidden">Mời bạn bè</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Mời bạn bè tham gia nhóm</DialogTitle>
                    <DialogDescription>Chọn những người bạn bạn muốn mời vào nhóm này</DialogDescription>
                </DialogHeader>

                <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                    {availableFriends?.length === 0 && (
                        <p className="text-center text-sm text-gray-500">Bạn không có người bạn nào có thể mời.</p>
                    )}
                    {availableFriends?.map((friend) => {
                        const isSelected = selectedUsers.includes(friend._id);
                        return (
                            <div
                                key={friend._id}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${
                                    isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                                onClick={() => handleSelect(friend._id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                                        <Image
                                            src={
                                                (typeof friend.avatar === 'string'
                                                    ? friend.avatar
                                                    : (friend.avatar as any)?.url) || '/assets/img/avatar.png'
                                            }
                                            alt={friend.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{friend.name}</p>
                                        <p className="text-xs text-gray-500">@{friend.username}</p>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="text-blue-600 focus:ring-blue-500 h-5 w-5 rounded border-gray-300"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="text" onClick={() => setIsOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        disabled={selectedUsers.length === 0 || inviteGroup.isPending}
                        onClick={handleInvite}
                    >
                        {inviteGroup.isPending ? 'Đang mời...' : `Mời ${selectedUsers.length} người`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteFriendModal;
