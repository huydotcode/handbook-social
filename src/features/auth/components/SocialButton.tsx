'use client';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * SocialButton component - Google OAuth login
 * Note: Google OAuth needs to be implemented via REST API
 * For now, this is a placeholder that shows the button
 * TODO: Implement Google OAuth via REST API endpoint
 */
const SocialButton = () => {
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const loginWithGoogle = async () => {
        try {
            setIsGoogleLoading(true);
            // TODO: Implement Google OAuth via REST API
            // For now, redirect to Google OAuth URL or show message
            toast.error(
                'Google OAuth chưa được triển khai. Vui lòng đăng nhập bằng email.',
                {
                    id: 'error-login-google',
                }
            );
            // Example: window.location.href = '/api/auth/google';
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi đăng nhập với Google', {
                id: 'error-login-google',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <Button
            onClick={loginWithGoogle}
            disabled={isGoogleLoading}
            className="h-12 w-full transform rounded-xl border-2 border-slate-200 bg-white font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-secondary-2 dark:text-slate-300 dark:hover:border-slate-500"
        >
            <div className="flex items-center justify-center">
                {isGoogleLoading ? (
                    <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
                        <span>Đang đăng nhập...</span>
                    </>
                ) : (
                    <>
                        <Icons.Google className="mr-3 h-5 w-5" />
                        <span>Đăng nhập với Google</span>
                    </>
                )}
            </div>
        </Button>
    );
};

export default SocialButton;
