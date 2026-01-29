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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { IUser } from '@/types/entites/user.types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserEditModalProps {
    user: IUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserEditModal = ({
    user,
    open,
    onOpenChange,
}: UserEditModalProps) => {
    // Mutations
    const blockMutation = useAdminBlockUser();
    const unblockMutation = useAdminUnblockUser();
    const updateRoleMutation = useAdminUpdateRole();
    const verifyMutation = useAdminVerifyUser();
    const unverifyMutation = useAdminUnverifyUser();

    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [role, setRole] = useState(user.role);
    const [isVerified, setIsVerified] = useState(user.isVerified);
    const [isBlocked, setIsBlocked] = useState(user.isBlocked);

    // Reset state when user or open changes
    useEffect(() => {
        if (open) {
            setRole(user.role);
            setIsVerified(user.isVerified);
            setIsBlocked(user.isBlocked);
        }
    }, [open, user]);

    const handleSave = async () => {
        setIsLoading(true);
        const promises = [];

        // 1. Handle Role Change
        if (role !== user.role) {
            promises.push(
                updateRoleMutation.mutateAsync({
                    userId: user._id,
                    role: role as 'admin' | 'user',
                })
            );
        }

        // 2. Handle Verify Status Change
        if (isVerified !== user.isVerified) {
            if (isVerified) {
                promises.push(verifyMutation.mutateAsync(user._id));
            } else {
                promises.push(unverifyMutation.mutateAsync(user._id));
            }
        }

        // 3. Handle Block Status Change
        if (isBlocked !== user.isBlocked) {
            if (isBlocked) {
                promises.push(blockMutation.mutateAsync(user._id));
            } else {
                promises.push(unblockMutation.mutateAsync(user._id));
            }
        }

        try {
            if (promises.length > 0) {
                await Promise.all(promises);
                toast.success('Cập nhật thành công');
            }
            onOpenChange(false);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Role Selection */}
                    <div className="flex flex-col gap-2">
                        <Label>Vai trò</Label>
                        <Select
                            value={role}
                            onValueChange={(value) =>
                                setRole(value as 'admin' | 'user')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Trạng thái tài khoản</Label>

                        {/* Verify Switch */}
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base">Xác thực</Label>
                                <div className="text-[0.8rem] text-muted-foreground">
                                    Tài khoản đã được xác minh
                                </div>
                            </div>
                            <Switch
                                checked={isVerified}
                                onCheckedChange={setIsVerified}
                            />
                        </div>

                        {/* Block Switch */}
                        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/10">
                            <div className="space-y-0.5">
                                <Label className="text-base text-red-600 dark:text-red-400">
                                    Khóa tài khoản
                                </Label>
                                <div className="text-[0.8rem] text-red-600/80 dark:text-red-400/80">
                                    Người dùng sẽ không thể đăng nhập
                                </div>
                            </div>
                            <Switch
                                checked={isBlocked}
                                onCheckedChange={setIsBlocked}
                                className="data-[state=checked]:bg-red-600"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant={'primary'}
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
