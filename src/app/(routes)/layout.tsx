'use client';
import { ChatWithAI } from '@/features/ai';
import { ProtectedRoute } from '@/features/auth';
import { Navbar } from '@/shared/components/layout';
import { USER_ROLES } from '@/types/entites';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return (
        <ProtectedRoute requireRoles={[USER_ROLES.USER, USER_ROLES.ADMIN]}>
            <div className="w-screen">
                <Navbar />
                <main className={'bg-primary-1 dark:bg-dark-primary-1'}>
                    {children}
                </main>

                <ChatWithAI />
            </div>
        </ProtectedRoute>
    );
};

export default HomeLayout;
