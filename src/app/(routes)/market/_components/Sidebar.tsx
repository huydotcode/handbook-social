'use client';

import { useSidebarCollapse } from '@/core/context/SidebarContext';
import { useCategories } from '@/features/category';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import SidebarSubtitle from '@/shared/components/layout/sidebar/SidebarSubtitle';
import SidebarTitle from '@/shared/components/layout/sidebar/SidebarTitle';
import { Button } from '@/shared/components/ui/Button';
import Icons, { IconsArray } from '@/shared/components/ui/Icons';
import { useRouter } from 'next/navigation';
import React from 'react';
import SearchMarket from './SearchMarket';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: categories } = useCategories();
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();

    return (
        <>
            <SidebarCollapse>
                <SidebarTitle title="Market" href="/market" />

                <SearchMarket />

                <Button
                    className="mt-2 w-full justify-start pl-4"
                    variant={'primary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/create/item');
                    }}
                    size={'sm'}
                >
                    <Icons.CreatePost className="h-5 w-5" /> Tạo mặt hàng cần
                    bán
                </Button>

                <Button
                    className="mt-2 w-full justify-start pl-4"
                    variant={'secondary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/manage/item');
                    }}
                    size={'sm'}
                >
                    <Icons.Edit className="h-5 w-5" /> Quản lý mặt hàng
                </Button>

                <SidebarSubtitle title="Danh mục" />

                {categories &&
                    categories.map((category) => {
                        const Icon = IconsArray.find(
                            (icon) => icon.name === category.icon
                        )?.icon;

                        return (
                            <Button
                                className="mt-2 w-full justify-start"
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    router.push(
                                        `/market/category/${category.slug}`
                                    );
                                }}
                                key={category._id}
                                variant={'outline'}
                            >
                                {Icon && <Icon className="mr-2" />}
                                <h2 className="text-sm">{category.name}</h2>
                            </Button>
                        );
                    })}
            </SidebarCollapse>
        </>
    );
};
export default Sidebar;
