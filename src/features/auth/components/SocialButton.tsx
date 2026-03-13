'use client';
import { useGoogleLoginMutation } from '@/features/auth/hooks/auth.hook';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * SocialButton component - Google OAuth login
 */
const SocialButton = () => {
    const { mutateAsync: loginGoogle, isPending } = useGoogleLoginMutation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                await loginGoogle(codeResponse.code);
                router.push('/');
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setIsLoading(false);
            toast.error('Đăng nhập Google thất bại', {
                id: 'error-login-google',
            });
        },
        onNonOAuthError: () => {
            setIsLoading(false);
        },
        flow: 'auth-code',
    });

    const handleGoogleLogin = () => {
        setIsLoading(true);
        googleLogin();
    };

    const showLoading = isLoading || isPending;

    return (
        <Button className="w-full py-4" onClick={handleGoogleLogin} disabled={showLoading} variant={'secondary'}>
            {showLoading ? (
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
        </Button>
    );
};

export default SocialButton;
