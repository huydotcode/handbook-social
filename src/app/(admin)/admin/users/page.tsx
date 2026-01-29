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
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

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
        sortBy,
        order,
    });

    const users = data?.data || [];
    const meta = data?.pagination;

    const handleReset = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        setPage(1);
        setSortBy('createdAt');
        setOrder('desc');
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
                sortBy={sortBy}
                onSortChange={setSortBy}
                order={order}
                onOrderChange={setOrder}
                onReset={handleReset}
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[50px]">Avatar</TableHead>
                        <TableHead className="min-w-[120px]">Tên</TableHead>
                        <TableHead className="min-w-[100px]">
                            Username
                        </TableHead>
                        <TableHead className="min-w-[180px]">Email</TableHead>
                        <TableHead className="min-w-[80px]">Vai trò</TableHead>
                        <TableHead className="min-w-[150px]">
                            Trạng thái
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                            Ngày tham gia
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                            Truy cập cuối
                        </TableHead>
                        <TableHead className="min-w-[80px] text-right">
                            Hành động
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                <Loading text="Đang tải" />
                            </TableCell>
                        </TableRow>
                    ) : (
                        users &&
                        users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar
                                        width={36}
                                        height={36}
                                        imgSrc={user.avatar}
                                        alt={user.name}
                                    />
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-medium">
                                        {user.name}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {user.username}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {user.email}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className="w-fit capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.isOnline ? (
                                            <Badge
                                                variant="success"
                                                className="text-xs"
                                            >
                                                Online
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Offline
                                            </Badge>
                                        )}
                                        {user.isBlocked && (
                                            <Badge
                                                variant="destructive"
                                                className="text-xs"
                                            >
                                                Blocked
                                            </Badge>
                                        )}
                                        {user.isVerified && (
                                            <Badge
                                                variant="success"
                                                className="text-xs"
                                            >
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {FormatDate.formatISODateToDate(
                                            user.createdAt
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {user.lastAccessed
                                            ? FormatDate.formatISODateToDateTime(
                                                  user.lastAccessed
                                              )
                                            : 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <UserActionMenu user={user} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="mt-2 flex">
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
