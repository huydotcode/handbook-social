'use client';
import { Button } from '@/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/lib/hooks/api/useAuth';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthContainer from '../_components/AuthContainer';
import AuthHeader from '../_components/AuthHeader';
import OrDivider from '../_components/OrDivider';
import RedirectLink from '../_components/RedirectLink';
import SocialButton from '../_components/SocialButton';

interface FormLoginData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const loginMutation = useLogin();
    const form = useForm<FormLoginData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const {
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
        reset,
    } = form;

    const loginWithCredentials: SubmitHandler<FormLoginData> = async (
        formData
    ) => {
        const { email, password } = formData;

        try {
            await loginMutation.mutateAsync(
                { email, password },
                {
                    onSuccess: () => {
                        reset();
                        router.push('/');
                    },
                    onError: (error: any) => {
                        // Handle specific error types
                        const errorMessage =
                            error.message || 'Đăng nhập thất bại';

                        if (
                            errorMessage.includes('Email') ||
                            errorMessage.includes('email')
                        ) {
                            setError('root', {
                                message: 'Email không tồn tại trong hệ thống',
                            });
                        } else if (
                            errorMessage.includes('Mật khẩu') ||
                            errorMessage.includes('password')
                        ) {
                            setError('root', {
                                message: 'Mật khẩu không chính xác',
                            });
                        } else {
                            setError('root', {
                                message: errorMessage,
                            });
                        }
                    },
                }
            );
        } catch (error: any) {
            // Error already handled in onError callback
            console.error('Login error:', error);
        }
    };

    return (
        <AuthContainer>
            <AuthHeader title="Đăng nhập" />
            <div className="space-y-4">
                <Form {...form}>
                    <form
                        method="POST"
                        onSubmit={handleSubmit(loginWithCredentials)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                        Email của bạn
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập email của bạn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <div>
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                            Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>

                                    <div className="flex justify-end">
                                        <Button
                                            className="p-0"
                                            variant={'text'}
                                            href="/auth/forgot-password"
                                            size={'sm'}
                                        >
                                            Quên mật khẩu?
                                        </Button>
                                    </div>
                                </div>
                            )}
                        />

                        {errors.root && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {errors.root.message}
                                </FormMessage>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size={'md'}
                            variant={'primary'}
                            type="submit"
                            disabled={isSubmitting || loginMutation.isPending}
                        >
                            {isSubmitting || loginMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng nhập'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
            <OrDivider />
            <SocialButton />
            <RedirectLink
                text="Chưa có tài khoản?"
                linkText="Đăng ký ngay"
                href="/auth/sign-up"
            />
        </AuthContainer>
    );
};

export default LoginPage;
