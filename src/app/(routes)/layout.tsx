'use client';
import { Navbar } from '@/components/layout';
import ChatWithGemini from '@/components/layout/ChatWithGemini';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
                <ChatWithGemini />
            </div>
        </ProtectedRoute>
    );
};

export default HomeLayout;
