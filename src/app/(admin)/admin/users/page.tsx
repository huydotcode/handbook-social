'use client';

import { useAdminUsers } from '@/features/admin';
import { FormatDate } from '@/shared';
import { Loading, PaginationWithLinks } from '@/shared/components/ui';
import Avatar from '@/shared/components/ui/Avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { useState } from 'react';
import { UserActionMenu } from './_components/user-action-menu';
import { UserTableToolbar } from './_components/user-table-toolbar';

import { Badge } from '@/shared/components/ui/badge';
import { useDebounce } from '@/shared/hooks';

const AdminUsersPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [status, setStatus] = useState('all');

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useAdminUsers({
        page,
        page_size: pageSize,
        q: debouncedSearch,
        role: role !== 'all' ? role : undefined,
        isBlocked: status === 'blocked' ? true : undefined,
        isVerified:
            status === 'verified'
                ? true
                : status === 'unverified'
                  ? false
                  : undefined,
    });

    const users = data?.data || [];
    const meta = data?.pagination;

    const handleReset = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        setPage(1);
    };

    return (
        <div className="mt-4">
            <h1 className="mb-4 text-2xl font-bold">Quản lý người dùng</h1>

            <UserTableToolbar
                search={search}
                role={role}
                status={status}
                onSearchChange={(v) => {
                    setSearch(v);
                    setPage(1);
                }}
                onRoleChange={(v) => {
                    setRole(v);
                    setPage(1);
                }}
                onStatusChange={(v) => {
                    setStatus(v);
                    setPage(1);
                }}
                onReset={handleReset}
            />

            <div className="min-h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Thống kê</TableHead>
                            <TableHead>Thông tin</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    <Loading text="Đang tải" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            users &&
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                width={36}
                                                height={36}
                                                imgSrc={user.avatar}
                                                alt={user.name}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.username}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Badge
                                                variant={'secondary'}
                                                className="w-fit"
                                            >
                                                {user.role}
                                            </Badge>
                                            <div className="flex gap-1">
                                                {user.isOnline ? (
                                                    <Badge
                                                        variant="success"
                                                        className="h-4 w-fit px-1 py-0 text-[10px]"
                                                    >
                                                        Online
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 w-fit px-1 py-0 text-[10px] text-muted-foreground"
                                                    >
                                                        Offline
                                                    </Badge>
                                                )}
                                                {user.isBlocked && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="h-4 w-fit px-1 py-0 text-[10px]"
                                                    >
                                                        Blocked
                                                    </Badge>
                                                )}
                                                {user.isVerified && (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-blue-500 hover:bg-blue-600 h-4 w-fit px-1 py-0 text-[10px]"
                                                    >
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>
                                                {user.followersCount} Followers
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>
                                                JoinedAt:{' '}
                                                {FormatDate.formatISODateToDate(
                                                    user.createdAt
                                                )}
                                            </span>
                                            <span>
                                                LastAccessed:{' '}
                                                {user.lastAccessed
                                                    ? FormatDate.formatISODateToDateTime(
                                                          user.lastAccessed
                                                      )
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActionMenu user={user} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex justify-end">
                {meta && (
                    <PaginationWithLinks
                        page={page}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
