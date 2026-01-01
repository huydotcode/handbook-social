'use client';
import { FriendSection, Sidebar } from '@/shared/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const PostLayout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Sidebar />
            {children}
            <FriendSection />
        </div>
    );
};

export default PostLayout;
