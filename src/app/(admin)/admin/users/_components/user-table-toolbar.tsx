'use client';

import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/Popover';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';

interface UserTableToolbarProps {
    search: string;
    role: string;
    status: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    order: 'asc' | 'desc';
    onOrderChange: (value: 'asc' | 'desc') => void;
    onReset: () => void;
}

export const UserTableToolbar = ({
    search,
    role,
    status,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    sortBy,
    onSortChange,
    order,
    onOrderChange,
    onReset,
}: UserTableToolbarProps) => {
    // Đếm số filter đang active
    const activeFilterCount = [role !== 'all', status !== 'all'].filter(
        Boolean
    ).length;

    const hasActiveFilters =
        search || role !== 'all' || status !== 'all' || sortBy !== 'createdAt';

    return (
        <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {/* Search Input */}
                <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-9 w-[300px] bg-secondary-1 md:w-full"
                />

                <div className="flex items-center gap-2">
                    {/* Filter Button with Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 gap-2 rounded-md"
                            >
                                <Icons.Filter className="h-4 w-4" />
                                <span className="text-sm md:hidden">
                                    Bộ lọc
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-2 text-xs text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-4" align="start">
                            <div className="space-y-4">
                                {/* Role Filter */}
                                <div>
                                    <h4 className="mb-3 text-sm font-medium">
                                        Vai trò
                                    </h4>

                                    <RadioGroup
                                        value={role}
                                        onValueChange={onRoleChange}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="all"
                                                id="role-all"
                                            />
                                            <Label
                                                htmlFor="role-all"
                                                className="cursor-pointer"
                                            >
                                                Tất cả
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="admin"
                                                id="role-admin"
                                            />
                                            <Label
                                                htmlFor="role-admin"
                                                className="cursor-pointer"
                                            >
                                                Admin
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="user"
                                                id="role-user"
                                            />
                                            <Label
                                                htmlFor="role-user"
                                                className="cursor-pointer"
                                            >
                                                User
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <h4 className="mb-3 text-sm font-medium">
                                        Trạng thái
                                    </h4>
                                    <RadioGroup
                                        value={status}
                                        onValueChange={onStatusChange}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="all"
                                                id="status-all"
                                            />
                                            <Label
                                                htmlFor="status-all"
                                                className="cursor-pointer"
                                            >
                                                Tất cả
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="verified"
                                                id="status-verified"
                                            />
                                            <Label
                                                htmlFor="status-verified"
                                                className="cursor-pointer"
                                            >
                                                Đã xác thực
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="unverified"
                                                id="status-unverified"
                                            />
                                            <Label
                                                htmlFor="status-unverified"
                                                className="cursor-pointer"
                                            >
                                                Chưa xác thực
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="blocked"
                                                id="status-blocked"
                                            />
                                            <Label
                                                htmlFor="status-blocked"
                                                className="cursor-pointer"
                                            >
                                                Đang bị khóa
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Reset Filters */}
                                {(role !== 'all' || status !== 'all') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            onRoleChange('all');
                                            onStatusChange('all');
                                        }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Sort Button with Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 gap-2 rounded-md"
                            >
                                <Icons.ArrowUpDown className="h-4 w-4" />
                                <span className="text-sm md:hidden">
                                    Sắp xếp
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-4" align="start">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                    Sắp xếp theo
                                </h4>
                                <RadioGroup
                                    value={`${sortBy}-${order}`}
                                    onValueChange={(value) => {
                                        const [newSortBy, newOrder] =
                                            value.split('-');
                                        onSortChange(newSortBy);
                                        onOrderChange(
                                            newOrder as 'asc' | 'desc'
                                        );
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="createdAt-desc"
                                            id="sort-newest"
                                        />
                                        <Label
                                            htmlFor="sort-newest"
                                            className="cursor-pointer"
                                        >
                                            Mới nhất
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="createdAt-asc"
                                            id="sort-oldest"
                                        />
                                        <Label
                                            htmlFor="sort-oldest"
                                            className="cursor-pointer"
                                        >
                                            Cũ nhất
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="name-asc"
                                            id="sort-name-asc"
                                        />
                                        <Label
                                            htmlFor="sort-name-asc"
                                            className="cursor-pointer"
                                        >
                                            Tên (A-Z)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="name-desc"
                                            id="sort-name-desc"
                                        />
                                        <Label
                                            htmlFor="sort-name-desc"
                                            className="cursor-pointer"
                                        >
                                            Tên (Z-A)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="lastAccessed-desc"
                                            id="sort-access-recent"
                                        />
                                        <Label
                                            htmlFor="sort-access-recent"
                                            className="cursor-pointer"
                                        >
                                            Truy cập gần đây
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="lastAccessed-asc"
                                            id="sort-access-old"
                                        />
                                        <Label
                                            htmlFor="sort-access-old"
                                            className="cursor-pointer"
                                        >
                                            Truy cập lâu nhất
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Reset All Button */}
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onReset}>
                        <Icons.Close className="h-4 w-4" />
                        <span className="ml-1 md:hidden">Đặt lại</span>
                    </Button>
                )}
            </div>
        </div>
    );
};
