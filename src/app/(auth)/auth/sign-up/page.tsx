'use client';
import {
    AuthContainer,
    AuthHeader,
    OrDivider,
    RedirectLink,
    signUpValidation,
    SocialButton,
    useSignUpMutation,
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
import { ErrorResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormSignupData = {
    email: string;
    username: string;
    name: string;
    password: string;
    repassword: string;
};

const SignUpPage = () => {
    const router = useRouter();
    const signUpMutation = useSignUpMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const form = useForm<FormSignupData>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            email: '',
            username: '',
            name: '',
            password: '',
            repassword: '',
        },
    });

    const { handleSubmit, formState, setError, clearErrors } = form;
    const { isSubmitting } = formState;

    const signUp: SubmitHandler<FormSignupData> = async (data) => {
        if (data.password !== data.repassword) {
            setError('repassword', {
                type: 'manual',
                message: 'Mật khẩu không khớp',
            });
            return;
        }

        try {
            await signUpMutation.mutateAsync({
                email: data.email,
                username: data.username,
                name: data.name,
                password: data.password,
                repassword: data.repassword,
            });
            router.push('/auth/login');
        } catch (error) {
            setError('root', {
                message: getErrorMessage(error, 'Đăng ký thất bại'),
            });
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: any
    ) => {
        field.onChange(e);
        if (formState.errors.root) {
            clearErrors('root');
        }
    };

    return (
        <AuthContainer>
            <AuthHeader title="Đăng ký" />
            <div className="space-y-4">
                <Form {...form}>
                    <form
                        className={'space-y-4'}
                        onSubmit={handleSubmit(signUp)}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                            onChange={(e) =>
                                                handleInputChange(e, field)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                        Tên đăng nhập
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên đăng nhập"
                                            {...field}
                                            onChange={(e) =>
                                                handleInputChange(e, field)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                        Họ và tên
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Họ và tên"
                                            {...field}
                                            onChange={(e) =>
                                                handleInputChange(e, field)
                                            }
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
                                <FormItem>
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
                                                placeholder="Mật khẩu"
                                                {...field}
                                                onChange={(e) =>
                                                    handleInputChange(e, field)
                                                }
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
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                        Nhập lại mật khẩu
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showRePassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Nhập lại mật khẩu"
                                                {...field}
                                                onChange={(e) =>
                                                    handleInputChange(e, field)
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowRePassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                            >
                                                {showRePassword ? (
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-slate-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />

                        {formState.errors.root && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {formState.errors.root.message}
                                </FormMessage>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size={'md'}
                            variant={'primary'}
                            type="submit"
                            disabled={isSubmitting || signUpMutation.isPending}
                        >
                            {isSubmitting || signUpMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Đang đăng ký...
                                </div>
                            ) : (
                                'Đăng ký'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
            <OrDivider />
            <SocialButton />
            <RedirectLink
                text="Đã có tài khoản?"
                linkText="Đăng nhập ngay"
                href="/auth/login"
            />
        </AuthContainer>
    );
};

export default SignUpPage;
