'use client';
import { useGoogleLoginMutation } from '@/features/auth/hooks/auth.hook';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
            className="w-full py-4"
            onClick={() => googleLogin()}
            disabled={isPending}
            variant={'secondary'}
        >
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
        </Button>
    );
};

export default SocialButton;
