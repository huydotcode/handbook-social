'use client';
import { useSidebarCollapse } from '@/core/context/SidebarContext';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import SidebarItem from '@/shared/components/layout/sidebar/SidebarItem';
import SidebarList from '@/shared/components/layout/sidebar/SidebarList';
import SidebarTitle from '@/shared/components/layout/sidebar/SidebarTitle';
import { Icons } from '@/shared/components/ui';
import { searchType } from '@/shared/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Sidebar = () => {
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const typeParams = searchParams.get('type') || 'all';

    return (
        <SidebarCollapse>
            <SidebarTitle href="/search" title="Tìm kiếm" />

            <SidebarItem
                link={{
                    icon: <Icons.Users className="h-8 w-8" />,
                    path: `/search?q=${query}`,
                    name: 'Tất cả',
                }}
            />

            <SidebarList>
                {searchType.map((type) => (
                    <SidebarItem
                        key={type.name}
                        link={{
                            icon: type.icon,
                            path: `/search?type=${type.name}&q=${query}`,
                            name: type.label,
                        }}
                    />
                ))}
            </SidebarList>
        </SidebarCollapse>
    );
};

export default Sidebar;
