'use client';
import { useAuth } from '@/core/context';
import GroupService from '@/features/group/services/group.service';
import queryKey from '@/lib/react-query/query-key';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import SidebarSubtitle from '@/shared/components/layout/sidebar/SidebarSubtitle';
import SidebarTitle from '@/shared/components/layout/sidebar/SidebarTitle';
import { Items } from '@/shared/components/shared';
import { Loading } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { IGroup } from '@/types/entites';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

interface Props {}

const PAGE_SIZE = 10;

export const useGroups = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.groups(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const groups = await GroupService.getByUserId({
                userId,
                page: pageParam,
                pageSize: PAGE_SIZE,
            });

            return groups;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        select: (data) => data.pages.flatMap((page) => page) as IGroup[],
        initialPageParam: 1,
    });

const Sidebar: React.FC<Props> = () => {
    const { user } = useAuth();
    const { data: groups, isLoading } = useGroups(user?.id);

    return (
        <>
            <SidebarCollapse>
                <SidebarTitle title="Nhóm" href="/groups" />

                <Button
                    className="my-2 w-full"
                    variant={'primary'}
                    href="/groups/create"
                    size={'sm'}
                >
                    Tạo nhóm mới
                </Button>

                <SidebarSubtitle title="Nhóm của bạn" />

                {isLoading && <Loading text={'Đang tải nhóm của bạn'} />}

                {groups &&
                    groups.length > 0 &&
                    groups.map((group) => (
                        <Items.Group data={group} key={group._id} />
                    ))}
            </SidebarCollapse>
        </>
    );
};
export default Sidebar;
