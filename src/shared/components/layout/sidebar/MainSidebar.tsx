'use client';
import { useAuth } from '@/core/context';
import { navLink } from '@/shared/constants';
import { USER_ROLES } from '@/types/entites';
import Link from 'next/link';
import Image from '../../ui/image';
import SidebarCollapse from './SidebarCollapse';
import SidebarItem from './SidebarItem';
import SidebarList from './SidebarList';

interface MainSidebarProps {
    showOnlyMobile?: boolean;
}

const MainSidebar = ({ showOnlyMobile = false }: MainSidebarProps) => {
    const { user } = useAuth();

    return (
        <SidebarCollapse
            collapseBreakpoints={['sm', 'md', 'lg', 'xl']}
            showOnlyMobile={showOnlyMobile}
        >
            {user && (
                <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center rounded-xl p-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1"
                >
                    <Image
                        className="rounded-full "
                        width={32}
                        height={32}
                        src={user?.avatar || ''}
                        alt={user?.name || ''}
                    />

                    <span className="ml-2 text-sm dark:text-dark-primary-1">
                        {user?.name}
                    </span>
                </Link>
            )}

            <SidebarList>
                {navLink.map((link) => {
                    if (
                        link.role === USER_ROLES.ADMIN &&
                        user?.role !== USER_ROLES.ADMIN
                    )
                        return null;

                    return (
                        <SidebarItem
                            key={link.name}
                            link={{
                                icon: link.icon,
                                name: link.name,
                                path: link.path,
                            }}
                        />
                    );
                })}
            </SidebarList>
        </SidebarCollapse>
    );
};

export default MainSidebar;
