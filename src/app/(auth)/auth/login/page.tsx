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
import { checkAuth } from '@/lib/actions/user.action';
import { signIn } from 'next-auth/react';
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

    const loginWithCrenditals: SubmitHandler<FormLoginData> = async (
        formData
    ) => {
        const { email, password } = formData;

        try {
            const validUser = (await checkAuth({
                email,
                password,
            })) as {
                error: {
                    type: string;
                    message: string;
                };
            } | null;

            if (validUser?.error) {
                const type = validUser.error.type;

                if (type == 'email') {
                    setError('root', {
                        message: 'Người dùng không tồn tại',
                    });
                }

                if (type == 'password') {
                    setError('root', {
                        message: validUser.error.message,
                    });
                }

                return;
            }

            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/',
            });

            if (!res?.ok) {
                toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                    id: 'error-login',
                });
                return;
            }

            if (res?.ok) {
                toast.success('Đăng nhập thành công!');
                reset();
                router.push('/');
            }
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                id: 'error-login',
            });
        }
    };

    return (
        <AuthContainer>
            <AuthHeader title="Đăng nhập" />
            <div className="space-y-4">
                <Form {...form}>
                    <form
                        method="POST"
                        onSubmit={handleSubmit(loginWithCrenditals)}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
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
