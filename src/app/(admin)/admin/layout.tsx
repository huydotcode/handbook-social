'use client';
import { useAuth } from '@/core/context/AuthContext';
import { Navbar } from '@/shared/components/layout';
import { Loading } from '@/shared/components/ui';
import { USER_ROLES } from '@/types/entites';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Sidebar } from '../_components';

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== USER_ROLES.ADMIN)) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <Loading fullScreen overlay={false} showLogo showLoader={false} />
        );
    }

    if (!user || user.role !== USER_ROLES.ADMIN) {
        return null;
    }

    return (
        <div>
            <Navbar />

            <Sidebar />

            <main className="relative top-[56px] ml-[300px] min-h-[calc(100vh-56px)] px-4 lg:ml-0 md:px-2">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
