'use client';

import {
    useAdminBlockUser,
    useAdminUnblockUser,
    useAdminUpdateRole,
} from '@/features/admin';
import { Button } from '@/shared/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { IUser } from '@/types/entites/user.types';
import {
    Ban,
    Eye,
    LockOpen,
    MoreHorizontal,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserDetailModal } from './user-detail-modal';

interface UserActionMenuProps {
    user: IUser;
}

export const UserActionMenu = ({ user }: UserActionMenuProps) => {
    const blockMutation = useAdminBlockUser();
    const unblockMutation = useAdminUnblockUser();
    const updateRoleMutation = useAdminUpdateRole();

    const handleBlock = () => {
        toast.promise(blockMutation.mutateAsync(user._id), {
            loading: 'Đang khóa người dùng...',
            success: 'Đã khóa người dùng thành công',
            error: 'Có lỗi xảy ra',
        });
    };

    const handleUnblock = () => {
        toast.promise(unblockMutation.mutateAsync(user._id), {
            loading: 'Đang mở khóa người dùng...',
            success: 'Đã mở khóa người dùng thành công',
            error: 'Có lỗi xảy ra',
        });
    };

    const handleUpdateRole = (role: 'admin' | 'user') => {
        toast.promise(
            updateRoleMutation.mutateAsync({ userId: user._id, role }),
            {
                loading: 'Đang cập nhật vai trò...',
                success: 'Cập nhật vai trò thành công',
                error: 'Có lỗi xảy ra',
            }
        );
    };

    const [showDetail, setShowDetail] = useState(false);

    return (
        <>
            <UserDetailModal
                user={user}
                open={showDetail}
                onOpenChange={setShowDetail}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowDetail(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>

                    {user.role === 'user' ? (
                        <DropdownMenuItem
                            onClick={() => handleUpdateRole('admin')}
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Thăng cấp Admin
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => handleUpdateRole('user')}
                        >
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Hạ cấp User
                        </DropdownMenuItem>
                    )}

                    {user.isBlocked ? (
                        <DropdownMenuItem onClick={handleUnblock}>
                            <LockOpen className="mr-2 h-4 w-4" />
                            Mở khóa
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={handleBlock}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Ban className="mr-2 h-4 w-4" />
                            Khóa tài khoản
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
