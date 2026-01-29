'use client';
import { ProtectedRoute } from '@/features/auth';
import { Navbar } from '@/shared/components/layout';
import { USER_ROLES } from '@/types/entites';
import React from 'react';
import { Sidebar } from '../_components';

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    return (
        <ProtectedRoute requireRoles={[USER_ROLES.ADMIN]}>
            <Navbar />

            <Sidebar />

            <main className="relative top-[56px] ml-[300px] min-h-[calc(100vh-56px)] px-4 pb-10 lg:ml-0 md:px-2">
                {children}
            </main>
        </ProtectedRoute>
    );
};

export default AdminLayout;
