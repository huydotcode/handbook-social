'use client';
import { ChatWithAI } from '@/features/ai';
import { ProtectedRoute } from '@/features/auth';
import { Navbar } from '@/shared/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return (
        <ProtectedRoute>
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
