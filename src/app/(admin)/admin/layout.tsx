'use client';
import { Navbar } from '@/shared/components/layout';
import { Loading } from '@/shared/components/ui';
import { useAuth } from '@/core/context/AuthContext';
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
        return <Loading />;
    }

    if (!user || user.role !== USER_ROLES.ADMIN) {
        return null;
    }

    return (
        <div>
            <Navbar />

            <main className="relative top-[56px] ml-[300px] min-h-[calc(100vh-56px)] w-[calc(100vw-340px)] xl:ml-[80px] xl:w-[calc(100vw-80px)]">
                <Sidebar />
                <div className="mx-4 mt-4 w-full">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
