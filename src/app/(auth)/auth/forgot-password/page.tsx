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
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import { resetPasswordValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthContainer from '../_components/AuthContainer';
import AuthHeader from '../_components/AuthHeader';
import OrDivider from '../_components/OrDivider';
import RedirectLink from '../_components/RedirectLink';

interface FormForgotPasswordData {
    email: string;
    otp: string;
    password: string;
    repassword: string;
}

type Step = 'send-otp' | 'verify-otp' | 'reset-password';

const ForgotPassword = () => {
    const router = useRouter();
    const form = useForm<FormForgotPasswordData>({
        defaultValues: {
            email: '',
            password: '',
            repassword: '',
            otp: '',
        },
        resolver: zodResolver(resetPasswordValidation),
    });
    const {
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
        reset,
    } = form;

    const [step, setStep] = useState<Step>('send-otp');
    const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    const handleSendOtp = async (email: string) => {
        setIsSendingOtp(true);
        try {
            await axiosInstance.post(API_ROUTES.AUTH.SEND_OTP, {
                email,
            });

            setIsSendingOtp(false);
            setStep('verify-otp');
            toast.success('OTP đã được gửi tới email của bạn', {
                id: 'success-send-otp',
            });
        } catch (error) {
            setIsSendingOtp(false);
            toast.error('Đã có lỗi xảy ra khi gửi OTP', {
                id: 'error-send-otp',
            });
            return;
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            const email = form.getValues('email');

            const response = await axiosInstance.post(
                API_ROUTES.AUTH.VERIFY_OTP,
                {
                    email,
                    otp,
                }
            );

            if (response?.data?.success) {
                setIsVerified(true);
                setStep('reset-password');
                toast.success('Xác thực OTP thành công', {
                    id: 'success-verify-otp',
                });
            } else {
                setError('root', {
                    message: 'Xác thực OTP không thành công',
                });
            }
        } catch (error) {
            setError('root', {
                message: 'Đã có lỗi xảy ra khi xác thực OTP',
            });
        }
    };

    const handleResetPassword = async (formData: FormForgotPasswordData) => {
        const { email, password, repassword } = formData;

        if (password !== repassword) {
            setError('root', {
                message: 'Mật khẩu và xác nhận mật khẩu không khớp',
            });
            return;
        }

        try {
            await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
                email,
                newPassword: password,
            });
            reset();
            setStep('send-otp');
            toast.success('Đặt lại mật khẩu thành công', {
                id: 'success-reset-password',
            });

            router.push('/auth/login');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi đặt lại mật khẩu', {
                id: 'error-reset-password',
            });
        }
    };

    return (
        <AuthContainer>
            <AuthHeader title="Đặt lại mật khẩu" />

            <div className="space-y-6">
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(handleResetPassword)}
                    >
                        {step === 'send-otp' && (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                            Email của bạn
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    placeholder="Nhập email của bạn"
                                                    {...field}
                                                />
                                                <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                                <Button
                                                    className="rounded-l-none"
                                                    onClick={() =>
                                                        handleSendOtp(
                                                            field.value
                                                        )
                                                    }
                                                    size={'sm'}
                                                    variant={'primary'}
                                                    disabled={isSendingOtp}
                                                >
                                                    {isSendingOtp
                                                        ? 'Đang gửi...'
                                                        : 'Gửi OTP'}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Nhập OTP */}
                        {step === 'verify-otp' && (
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                            Nhập OTP đã gửi cho email{' '}
                                            {form.getValues('email')}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    placeholder="Nhập OTP"
                                                    {...field}
                                                />

                                                <Button
                                                    className="rounded-l-none"
                                                    size={'sm'}
                                                    variant={'primary'}
                                                    onClick={() =>
                                                        handleVerifyOtp(
                                                            field.value
                                                        )
                                                    }
                                                    disabled={
                                                        isSendingOtp ||
                                                        isVerified
                                                    }
                                                >
                                                    {isSendingOtp
                                                        ? 'Đang xác thực...'
                                                        : isVerified
                                                          ? 'Đã xác thực'
                                                          : 'Xác thực OTP'}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {step === 'reset-password' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Mật khẩu mới
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
                                        <FormItem className="space-y-2">
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Xác nhận mật khẩu
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-sm text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {errors.root && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {errors.root.message}
                                </FormMessage>
                            </div>
                        )}

                        <Button
                            className="from-blue-600 hover:from-blue-700 h-10 w-full transform rounded-xl bg-gradient-to-r to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-cyan-700 hover:shadow-xl active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="submit"
                            variant={'primary'}
                            size={'md'}
                            disabled={isSubmitting || step !== 'reset-password'}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Đang xử lý...</span>
                                </div>
                            ) : (
                                'Đổi mật khẩu'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>

            <OrDivider />

            <div className="mt-8 text-center">
                <RedirectLink
                    text=""
                    linkText="Quay lại đăng nhập"
                    href="/auth/login"
                />
            </div>
        </AuthContainer>
    );
};

export default ForgotPassword;
