'use client';
import { FriendSection } from '@/shared/components/layout';
import MainSidebar from '@/shared/components/layout/sidebar/MainSidebar';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const PostLayout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <MainSidebar />

            {children}

            <FriendSection />
        </div>
    );
};

export default PostLayout;
