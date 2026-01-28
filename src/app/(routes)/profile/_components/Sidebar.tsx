import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import SidebarItem from '@/shared/components/layout/sidebar/SidebarItem';
import SidebarList from '@/shared/components/layout/sidebar/SidebarList';
import SidebarUser from '@/shared/components/layout/sidebar/SidebarUser';
import { navLink } from '@/shared/constants';

const Sidebar = () => {
    return (
        <SidebarCollapse showOnlyMobile={true}>
            <SidebarUser />
            <SidebarList>
                {navLink.map((link) => (
                    <SidebarItem
                        key={link.name}
                        link={{
                            icon: link.icon,
                            name: link.name,
                            path: link.path,
                        }}
                    />
                ))}
            </SidebarList>
        </SidebarCollapse>
    );
};

export default Sidebar;
