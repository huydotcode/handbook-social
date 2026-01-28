'use client';
import React from 'react';
import Sidebar from './_components/Sidebar';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default ProfileLayout;
