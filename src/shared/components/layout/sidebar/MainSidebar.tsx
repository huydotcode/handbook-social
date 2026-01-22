'use client';
import { navLink } from '@/shared/constants';
import SidebarCollapse from './SidebarCollapse';
import SidebarItem from './SidebarItem';
import SidebarList from './SidebarList';
import SidebarUser from './SidebarUser';

interface MainSidebarProps {
    showOnlyMobile?: boolean;
}

const MainSidebar = ({ showOnlyMobile = false }: MainSidebarProps) => {
    return (
        <SidebarCollapse showOnlyMobile={showOnlyMobile}>
            <SidebarUser />
            <SidebarList>
                {navLink.map((link) => (
                    <SidebarItem key={link.name} link={link} />
                ))}
            </SidebarList>
        </SidebarCollapse>
    );
};

export default MainSidebar;
