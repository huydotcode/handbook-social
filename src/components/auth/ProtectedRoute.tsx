'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loading } from '@/components/ui';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
}

/**
 * ProtectedRoute component - Handles client-side authentication redirects
 * Replaces NextAuth middleware functionality
 */
export function ProtectedRoute({
    children,
    redirectTo = '/auth/login',
    requireAuth = true,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
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

    if (!requireAuth && isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
