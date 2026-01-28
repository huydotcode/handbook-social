import { Sidebar } from '@/features/message';
import MainSidebar from '@/shared/components/layout/sidebar/MainSidebar';
import React from 'react';
interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MessageLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="relative top-[60px]">
                <MainSidebar showOnlyMobile />

                <Sidebar />

                <div className="relative my-1 ml-[310px] h-[calc(100vh-72px)] overflow-hidden rounded-xl lg:ml-[90px] sm:ml-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default MessageLayout;
