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
        <SidebarCollapse
            width={'responsive'}
            showOnlyMobile={showOnlyMobile}
            desktop={'visible'}
            mobile={'closed'}
            type="main"
        />
    );
};

export default MainSidebar;
