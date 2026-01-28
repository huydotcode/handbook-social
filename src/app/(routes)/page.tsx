'use client';
import { InfinityPostComponent } from '@/features/post/components';
import { FriendSection } from '@/shared/components/layout';
import ContentContainer from '@/shared/components/layout/ContentContainer';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';

const HomePage = () => {
    return (
        <div className="relative top-[var(--navbar-height)] mx-auto min-h-[calc(100vh-56px)] max-w-screen pb-[100px] md:w-screen">
            <SidebarCollapse
                width={'responsive'}
                showOnlyMobile={false}
                desktop={'visible'}
                mobile={'closed'}
                type="main"
            />

            {/* <div className="mx-auto mt-2 w-[var(--content-width)] px-4 2xl:ml-[var(--sidebar-width-2xl)] 2xl:mr-0 xl:ml-[var(--sidebar-width-xl)] xl:w-[calc(100vw-var(--sidebar-width-xl))] lg:mx-auto lg:ml-[var(--sidebar-width-lg)] lg:w-[var(--content-lg-width)] md:w-full md:px-2">
                <InfinityPostComponent type="new-feed" />
            </div> */}

            <ContentContainer variant={'centered'}>
                <InfinityPostComponent type="new-feed" />
            </ContentContainer>

            <FriendSection />
        </div>
    );
};

export default HomePage;
