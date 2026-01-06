'use client';
import { Icons, Loading } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import Image from '@/shared/components/ui/image';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { adminApi } from '@/features/admin';
import queryKey from '@/lib/react-query/query-key';
import { IGroup } from '@/types/entites';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const AdminGroupPage = () => {
    const {
        data: groups,
        isLoading,
        isFetching,
    } = useQuery<IGroup[]>({
        queryKey: queryKey.admin.groups.index,
        queryFn: async () => {
            return await adminApi.getGroups({
                page_size: 100,
            });
        },
        initialData: [],
    });

    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Quản lý nhóm</h1>

            {(isLoading || isFetching) && <Loading fullScreen />}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên nhóm</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Người tạo</TableHead>
                        <TableHead>Thành viên</TableHead>
                        <TableHead>Hoạt động cuối</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading &&
                        !isFetching &&
                        groups?.map((group) => (
                            <TableRow key={group._id}>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>{group.description}</TableCell>
                                <TableCell>
                                    <Image
                                        src={group.avatar?.url}
                                        alt={group.name}
                                        className="h-10 w-10 rounded-full"
                                        width={40}
                                        height={40}
                                    />
                                </TableCell>
                                <TableCell>{group.type}</TableCell>
                                <TableCell>{group.creator?.username}</TableCell>
                                <TableCell>
                                    {group.members?.length ?? 0} thành viên
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        group.lastActivity
                                    ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        group.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        variant={'outline'}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        href={`/groups/${group._id}`}
                                                    >
                                                        <Icons.Detail />
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipContent>
                                                    Xem chi tiết
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminGroupPage;
