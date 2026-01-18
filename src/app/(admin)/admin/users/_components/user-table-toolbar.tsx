'use client';

import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface UserTableToolbarProps {
    search: string;
    role: string;
    status: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onReset: () => void;
}

export const UserTableToolbar = ({
    search,
    role,
    status,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onReset,
}: UserTableToolbarProps) => {
    return (
        <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-9 w-[500px] bg-secondary-1 md:w-full"
                />

                <Select value={role} onValueChange={onRoleChange}>
                    <SelectTrigger className="h-9 w-[150px] md:w-full">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="h-9 w-[200px] md:w-full">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="verified">Đã xác thực</SelectItem>
                        <SelectItem value="unverified">
                            Chưa xác thực
                        </SelectItem>
                        <SelectItem value="blocked">Đang bị khóa</SelectItem>
                    </SelectContent>
                </Select>

                {(search || role !== 'all' || status !== 'all') && (
                    <Button onClick={onReset}>
                        <Icons.Close />
                    </Button>
                )}
            </div>
        </div>
    );
};
