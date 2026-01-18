'use client';

import {
    useAdminBlockUser,
    useAdminUnblockUser,
    useAdminUnverifyUser,
    useAdminUpdateRole,
    useAdminVerifyUser,
} from '@/features/admin';
import { Button } from '@/shared/components/ui/Button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
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

    const verifyMutation = useAdminVerifyUser();
    const unverifyMutation = useAdminUnverifyUser();

    // Dialog state
    const [action, setAction] = useState<
        | 'block'
        | 'unblock'
        | 'verify'
        | 'unverify'
        | 'promote'
        | 'demote'
        | null
    >(null);

    const handleAction = async () => {
        if (!action) return;

        try {
            switch (action) {
                case 'block':
                    await toast.promise(blockMutation.mutateAsync(user._id), {
                        loading: 'Đang khóa người dùng...',
                        success: 'Đã khóa người dùng thành công',
                        error: 'Có lỗi xảy ra',
                    });
                    break;
                case 'unblock':
                    await toast.promise(unblockMutation.mutateAsync(user._id), {
                        loading: 'Đang mở khóa người dùng...',
                        success: 'Đã mở khóa người dùng thành công',
                        error: 'Có lỗi xảy ra',
                    });
                    break;
                case 'verify':
                    await toast.promise(verifyMutation.mutateAsync(user._id), {
                        loading: 'Đang xác thực người dùng...',
                        success: 'Đã xác thực người dùng thành công',
                        error: 'Có lỗi xảy ra',
                    });
                    break;
                case 'unverify':
                    await toast.promise(
                        unverifyMutation.mutateAsync(user._id),
                        {
                            loading: 'Đang hủy xác thực người dùng...',
                            success: 'Đã hủy xác thực người dùng thành công',
                            error: 'Có lỗi xảy ra',
                        }
                    );
                    break;
                case 'promote':
                    await toast.promise(
                        updateRoleMutation.mutateAsync({
                            userId: user._id,
                            role: 'admin',
                        }),
                        {
                            loading: 'Đang thăng cấp...',
                            success: 'Thăng cấp Admin thành công',
                            error: 'Có lỗi xảy ra',
                        }
                    );
                    break;
                case 'demote':
                    await toast.promise(
                        updateRoleMutation.mutateAsync({
                            userId: user._id,
                            role: 'user',
                        }),
                        {
                            loading: 'Đang hạ cấp...',
                            success: 'Hạ cấp User thành công',
                            error: 'Có lỗi xảy ra',
                        }
                    );
                    break;
            }
        } finally {
            setAction(null);
        }
    };

    const [showDetail, setShowDetail] = useState(false);

    return (
        <>
            <UserDetailModal
                user={user}
                open={showDetail}
                onOpenChange={setShowDetail}
            />

            <AlertDialog open={!!action} onOpenChange={() => setAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
                        <AlertDialogDescription>
                            {action === 'block' &&
                                'Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập.'}
                            {action === 'unblock' &&
                                'Bạn có chắc chắn muốn mở khóa tài khoản này?'}
                            {action === 'verify' &&
                                'Bạn có chắc chắn muốn xác thực tài khoản này?'}
                            {action === 'unverify' &&
                                'Bạn có chắc chắn muốn hủy xác thực tài khoản này?'}
                            {action === 'promote' &&
                                'Bạn có chắc chắn muốn thăng cấp người dùng này lên Admin?'}
                            {action === 'demote' &&
                                'Bạn có chắc chắn muốn hạ cấp Admin này xuống User?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAction}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        <DropdownMenuItem onClick={() => setAction('promote')}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Thăng cấp Admin
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => setAction('demote')}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Hạ cấp User
                        </DropdownMenuItem>
                    )}

                    {user.isVerified ? (
                        <DropdownMenuItem onClick={() => setAction('unverify')}>
                            <Ban className="mr-2 h-4 w-4" />
                            Hủy xác thực
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => setAction('verify')}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Xác thực
                        </DropdownMenuItem>
                    )}

                    {user.isBlocked ? (
                        <DropdownMenuItem onClick={() => setAction('unblock')}>
                            <LockOpen className="mr-2 h-4 w-4" />
                            Mở khóa
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => setAction('block')}
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
