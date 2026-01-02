'use client';
import { useGoogleLoginMutation } from '@/features/auth/hooks/auth.hook';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * SocialButton component - Google OAuth login
 */
const SocialButton = () => {
    const { mutate: loginGoogle, isPending } = useGoogleLoginMutation();
    const router = useRouter();

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            loginGoogle(codeResponse.code);
            router.push('/');
        },
        onError: () => {
            toast.error('Đăng nhập Google thất bại', {
                id: 'error-login-google',
            });
        },
        flow: 'auth-code',
    });

    return (
        <Button
            onClick={() => googleLogin()}
            disabled={isPending}
            className="h-12 w-full transform rounded-xl border-2 border-slate-200 bg-white font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-secondary-2 dark:text-slate-300 dark:hover:border-slate-500"
        >
            <div className="flex items-center justify-center">
                {isPending ? (
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
