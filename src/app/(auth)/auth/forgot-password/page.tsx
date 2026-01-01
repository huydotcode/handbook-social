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
    useResetPassword,
    useSendOTP,
    useVerifyOTP,
} from '@/features/auth';
import { resetPasswordValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormForgotPasswordData {
    email: string;
    otp: string;
    password: string;
    repassword: string;
}

type Step = 'send-otp' | 'verify-otp' | 'reset-password';

const ForgotPassword = () => {
    const router = useRouter();
    const sendOTPMutation = useSendOTP();
    const verifyOTPMutation = useVerifyOTP();
    const resetPasswordMutation = useResetPassword();

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
        getValues,
    } = form;

    const [step, setStep] = useState<Step>('send-otp');

    const handleSendOtp = async (email: string) => {
        try {
            await sendOTPMutation.mutateAsync(
                { email },
                {
                    onSuccess: () => {
                        setStep('verify-otp');
                    },
                }
            );
        } catch (error) {
            // Error already handled in hook
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        const email = getValues('email');
        try {
            await verifyOTPMutation.mutateAsync(
                { email, otp },
                {
                    onSuccess: () => {
                        setStep('reset-password');
                    },
                }
            );
        } catch (error) {
            setError('root', {
                message: 'Xác thực OTP không thành công',
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
            await resetPasswordMutation.mutateAsync(
                { email, newPassword: password },
                {
                    onSuccess: () => {
                        reset();
                        setStep('send-otp');
                        router.push('/auth/login');
                    },
                }
            );
        } catch (error) {
            // Error already handled in hook
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
                                                    disabled={
                                                        sendOTPMutation.isPending
                                                    }
                                                    type="button"
                                                >
                                                    {sendOTPMutation.isPending
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
                                            {getValues('email')}
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
                                                        verifyOTPMutation.isPending ||
                                                        step !== 'verify-otp'
                                                    }
                                                    type="button"
                                                >
                                                    {verifyOTPMutation.isPending
                                                        ? 'Đang xác thực...'
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
                            disabled={
                                isSubmitting ||
                                resetPasswordMutation.isPending ||
                                step !== 'reset-password'
                            }
                        >
                            {isSubmitting || resetPasswordMutation.isPending ? (
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
