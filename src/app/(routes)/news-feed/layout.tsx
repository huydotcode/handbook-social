import FixedLayout from '@/shared/components/layout/FixedLayout';
import React from 'react';
import Sidebar from '@/app/(routes)/news-feed/_components/Sidebar';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'News Feed | Handbook',
    };
}

const NewsFeedLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div className="relative top-[56px] min-h-[calc(100vh-56px)] max-w-screen pb-[100px] md:w-screen">
            <Sidebar />

            <div className="content-spacing">{children}</div>
        </div>
    );
};

export default NewsFeedLayout;
