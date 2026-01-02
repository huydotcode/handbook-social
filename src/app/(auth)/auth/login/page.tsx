'use client';
import {
    AuthContainer,
    AuthHeader,
    LoginValidation,
    loginValidation,
    OrDivider,
    RedirectLink,
    SocialButton,
    useLoginMutation,
} from '@/features/auth';
import { getErrorMessage } from '@/shared';
import { Button } from '@/shared/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/Form';
import { Input } from '@/shared/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const LoginPage = () => {
    const router = useRouter();

    const loginMutation = useLoginMutation();
    const loginForm = useForm<LoginValidation>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginValidation),
    });

    const [showPassword, setShowPassword] = useState(false);

    const loginWithCredentials: SubmitHandler<LoginValidation> = async (
        formData
    ) => {
        const { email, password } = formData;

        try {
            await loginMutation.mutateAsync({ email, password });
            loginForm.reset();
            router.push('/');
        } catch (error: any) {
            loginForm.setError('root', {
                message: getErrorMessage(error, 'Đăng nhập thất bại'),
            });
        }
    };

    return (
        <AuthContainer>
            <AuthHeader title="Đăng nhập" />
            <div className="space-y-4">
                <Form {...loginForm}>
                    <form
                        onSubmit={loginForm.handleSubmit(loginWithCredentials)}
                        className="space-y-4"
                    >
                        <FormField
                            control={loginForm.control}
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
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (
                                                    loginForm.formState.errors
                                                        .root
                                                ) {
                                                    loginForm.clearErrors(
                                                        'root'
                                                    );
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <div>
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                            Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Nhập mật khẩu của bạn"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        if (
                                                            loginForm.formState
                                                                .errors.root
                                                        ) {
                                                            loginForm.clearErrors(
                                                                'root'
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <Eye className="h-4 w-4 text-slate-500" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-slate-500" />
                                                    )}
                                                </Button>
                                            </div>
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

                        {loginForm.formState.errors.root && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {loginForm.formState.errors.root.message}
                                </FormMessage>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size={'md'}
                            variant={'primary'}
                            type="submit"
                            disabled={
                                loginForm.formState.isSubmitting ||
                                loginMutation.isPending
                            }
                        >
                            {loginForm.formState.isSubmitting ||
                            loginMutation.isPending ? (
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
