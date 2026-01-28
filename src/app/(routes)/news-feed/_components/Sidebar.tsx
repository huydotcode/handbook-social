'use client';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import SidebarItem from '@/shared/components/layout/sidebar/SidebarItem';
import SidebarList from '@/shared/components/layout/sidebar/SidebarList';
import SidebarTitle from '@/shared/components/layout/sidebar/SidebarTitle';
import { Icons } from '@/shared/components/ui';
import { usePathname, useSearchParams } from 'next/navigation';

const sidebarItems = [
    {
        name: 'Tất cả',
        icon: <Icons.Home className={'h-8 w-8'} />,
        link: '/news-feed',
    },
    {
        name: 'Bạn bè',
        icon: <Icons.Users className={'h-8 w-8'} />,
        link: '/news-feed?filter=friend',
    },
    {
        name: 'Nhóm',
        icon: <Icons.Group className={'h-8 w-8'} />,
        link: '/news-feed?filter=group',
    },
];

const Sidebar = () => {
    return (
        <SidebarCollapse width={'responsive'}>
            <SidebarTitle title="News Feed" href="/news-feed" />

            <SidebarList>
                {sidebarItems.map((item) => (
                    <SidebarItem
                        key={item.name}
                        link={{
                            icon: item.icon,
                            name: item.name,
                            path: item.link,
                        }}
                    />
                ))}
            </SidebarList>
        </SidebarCollapse>
    );
};

export default Sidebar;
