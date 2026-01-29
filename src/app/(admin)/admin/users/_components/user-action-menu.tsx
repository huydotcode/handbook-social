'use client';

import { Button } from '@/shared/components/ui/Button';
import { Icons } from '@/shared/components/ui';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { IUser } from '@/types/entites/user.types';
import { useState } from 'react';
import { UserDetailModal } from './user-detail-modal';
import { UserEditModal } from './user-edit-modal';

interface UserActionMenuProps {
    user: IUser;
}

export const UserActionMenu = ({ user }: UserActionMenuProps) => {
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    return (
        <>
            <UserDetailModal
                user={user}
                open={showDetail}
                onOpenChange={setShowDetail}
            />

            <UserEditModal
                user={user}
                open={showEdit}
                onOpenChange={setShowEdit}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0">
                        <span className="sr-only">Open menu</span>
                        <Icons.More className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowDetail(true)}>
                        <Icons.Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Icons.Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
