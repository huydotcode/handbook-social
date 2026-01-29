'use client';
import { useAuth } from '@/core/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loading } from '@/shared/components/ui';
import { BlockedPage } from './BlockedPage';
import { ForbiddenPage } from './ForbiddenPage';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
    requireRoles?: string[];
}

/**
 * ProtectedRoute component - Handles client-side authentication redirects
 * Replaces NextAuth middleware functionality
 */
export default function ProtectedRoute({
    children,
    redirectTo = '/auth/login',
    requireAuth = true,
    requireRoles,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.push(redirectTo);
            } else if (!requireAuth && isAuthenticated) {
                // If user is authenticated but on auth page, redirect to home
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

    // Show loading while checking auth
    if (isLoading) {
        return <Loading fullScreen />;
    }

    // Don't render children if auth check fails
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // Don't render children if user is authenticated but not on auth page
    if (!requireAuth && isAuthenticated) {
        return null;
    }

    // Check user block status
    if (requireAuth && isAuthenticated && user?.isBlocked) {
        return <BlockedPage />;
    }

    // Check user role
    if (requireRoles && !requireRoles.includes(user?.role || '')) {
        return <ForbiddenPage />;
    }

    return <>{children}</>;
}
