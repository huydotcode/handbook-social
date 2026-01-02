'use client';
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
import {
    AuthContainer,
    AuthHeader,
    OrDivider,
    RedirectLink,
    signUpValidation,
    SocialButton,
} from '@/features/auth';
import AuthService from '@/features/auth/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ErrorResponse } from '@/types';

type FormSignupData = {
    email: string;
    username: string;
    name: string;
    password: string;
    repassword: string;
};

const SignUpPage = () => {
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

    const { handleSubmit, formState, setError } = form;
    const router = useRouter();

    const { errors, isSubmitting } = formState;

    const signUp: SubmitHandler<FormSignupData> = async (data) => {
        if (isSubmitting) return;

        if (data.password !== data.repassword) {
            setError('repassword', {
                type: 'manual',
                message: 'Mật khẩu không khớp',
            });

            return;
        }

        try {
            await AuthService.register({
                email: data.email,
                username: data.username,
                name: data.name,
                password: data.password,
            });

            toast.success('Đăng ký thành công', {
                id: 'sign-up-success',
            });
            router.push('/auth/login');
        } catch (error) {
            const apiError = error as ErrorResponse;
            toast.error(apiError?.message || 'Có lỗi xảy ra khi đăng ký', {
                id: 'sign-up-fail',
            });
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
                        method="POST"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên đăng nhập"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Họ và tên"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="w-full"
                            size={'md'}
                            variant={'primary'}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <h5 className="text-lg">
                                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                            </h5>
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
