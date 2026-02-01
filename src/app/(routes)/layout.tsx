'use client';
import { ChatWithAI } from '@/features/ai';
import { ProtectedRoute } from '@/features/auth';
import { Navbar, BottomNavigation } from '@/shared/components/layout';
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

                <main
                    className={
                        'bg-primary-1 pb-16 dark:bg-dark-primary-1 md:pb-0'
                    }
                >
                    {children}
                </main>

                <BottomNavigation />

                <ChatWithAI />
            </div>
        </ProtectedRoute>
    );
};

export default HomeLayout;
