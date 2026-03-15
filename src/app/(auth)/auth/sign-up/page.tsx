'use client';
import {
    AuthContainer,
    AuthHeader,
    OrDivider,
    RedirectLink,
    SocialButton,
    useSignUpMutation,
    useCheckUsernameMutation,
    useSendOTP,
    signUpValidation,
} from '@/features/auth';
import { getErrorMessage, showSuccessToast } from '@/shared';
import { Button } from '@/shared/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/Form';
import { Input } from '@/shared/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

type FormSignupData = z.infer<typeof signUpValidation>;

const SignUpPage = () => {
    const router = useRouter();
    const signUpMutation = useSignUpMutation();
    const checkUsernameMutation = useCheckUsernameMutation();
    const sendOtpMutation = useSendOTP();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const form = useForm<FormSignupData>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            username: '',
            password: '',
            repassword: '',
            email: '',
            otp: '',
        },
        mode: 'onChange',
    });

    const { handleSubmit, formState, setError, clearErrors, trigger, getValues } = form;
    const { isSubmitting } = formState;

    // Countdown for OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleNextStep1 = async () => {
        const isValid = await trigger(['username']);
        if (!isValid) return;

        const username = getValues('username');
        try {
            const res = await checkUsernameMutation.mutateAsync(username);
            if (res.available) {
                setStep(2);
                clearErrors('root');
            } else {
                setError('username', { message: res.message });
            }
        } catch (error) {
            setError('root', { message: getErrorMessage(error, 'Kiểm tra tên đăng nhập thất bại') });
        }
    };

    const handleNextStep2 = async () => {
        const isValid = await trigger(['password', 'repassword']);
        if (isValid) {
            setStep(3);
            clearErrors('root');
        }
    };

    const handleSendOTP = async () => {
        const isValidEmail = await trigger(['email']);
        if (!isValidEmail) return;

        try {
            await sendOtpMutation.mutateAsync({
                email: getValues('email'),
                type: 'register',
            });
            setCountdown(60);
        } catch (error) {
            setError('email', { message: getErrorMessage(error, 'Gửi OTP thất bại') });
        }
    };

    const signUp: SubmitHandler<FormSignupData> = async (data) => {
        if (data.email && !data.otp) {
            setError('otp', { message: 'Vui lòng nhập mã OTP' });
            return;
        }

        try {
            await signUpMutation.mutateAsync({
                email: data.email || undefined,
                username: data.username,
                password: data.password,
                otp: data.otp || undefined,
            });
            // Auto login is handled inside useSignUpMutation
            router.push('/');
        } catch (error) {
            setError('root', {
                message: getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'),
            });
        }
    };

    const handleSkipEmail = async () => {
        try {
            await signUpMutation.mutateAsync({
                username: getValues('username'),
                password: getValues('password'),
            });
            router.push('/');
        } catch (error) {
            setError('root', {
                message: getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'),
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        field.onChange(e);
        if (formState.errors.root) {
            clearErrors('root');
        }
    };

    return (
        <AuthContainer>
            {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)} className="absolute left-6 top-4" size={'sm'}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}

            <AuthHeader title="Tạo tài khoản" />

            {/* Step Indicators */}
            <div className="mb-6 flex items-center justify-center space-x-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-12 bg-primary-2' : 'w-4 bg-secondary-2 dark:bg-slate-700'}`}
                    />
                ))}
            </div>

            <div className="space-y-4">
                <Form {...form}>
                    <form className={'space-y-4'} onSubmit={handleSubmit(signUp)}>
                        {/* STEP 1: USERNAME */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Chọn một tên đăng nhập của bạn
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Usernameeee..."
                                                    {...field}
                                                    onChange={(e) => handleInputChange(e, field)}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm text-red-500" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="mt-6 w-full"
                                    size={'md'}
                                    variant={'primary'}
                                    type="button"
                                    onClick={handleNextStep1}
                                    disabled={checkUsernameMutation.isPending}
                                >
                                    {checkUsernameMutation.isPending ? 'Đang kiểm tra...' : 'Tiếp tục'}
                                </Button>
                            </div>
                        )}

                        {/* STEP 2: PASSWORD */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Tạo mật khẩu
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Mật khẩu (ít nhất 6 ký tự)"
                                                        {...field}
                                                        onChange={(e) => handleInputChange(e, field)}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword((prev) => !prev)}
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
                                                        type={showRePassword ? 'text' : 'password'}
                                                        placeholder="Xác nhận mật khẩu"
                                                        {...field}
                                                        onChange={(e) => handleInputChange(e, field)}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowRePassword((prev) => !prev)}
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
                                <Button
                                    className="mt-6 w-full"
                                    size={'md'}
                                    variant={'primary'}
                                    type="button"
                                    onClick={handleNextStep2}
                                >
                                    Tiếp tục
                                </Button>
                            </div>
                        )}

                        {/* STEP 3: EMAIL & OTP */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Liên kết Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex">
                                                    <Input
                                                        className="rounded-r-none"
                                                        placeholder="Nhập địa chỉ email của bạn"
                                                        {...field}
                                                        onChange={(e) => handleInputChange(e, field)}
                                                        disabled={countdown > 0}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        className="shrink-0 rounded-l-none"
                                                        onClick={handleSendOTP}
                                                        disabled={countdown > 0 || sendOtpMutation.isPending}
                                                    >
                                                        {sendOtpMutation.isPending
                                                            ? 'Đang gửi...'
                                                            : countdown > 0
                                                              ? `Thử lại (${countdown}s)`
                                                              : 'Gửi mã'}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-sm text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                Mã OTP được gửi đến email của bạn
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập mã xác thực"
                                                    {...field}
                                                    maxLength={6}
                                                    onChange={(e) => handleInputChange(e, field)}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {formState.errors.root && (
                                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                        <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {formState.errors.root.message}
                                        </FormMessage>
                                    </div>
                                )}

                                <p className="mt-2 text-center text-sm text-secondary-1">
                                    Bạn có thể bỏ qua bước này nếu bạn không muốn xác thực thông qua email.
                                </p>

                                <Button
                                    className="mt-6 w-full"
                                    size={'md'}
                                    variant={'outline'}
                                    type="button"
                                    onClick={handleSkipEmail}
                                    disabled={isSubmitting || signUpMutation.isPending}
                                >
                                    Bỏ qua bước này và hoàn tất
                                </Button>

                                <Button
                                    className="mt-6 w-full"
                                    size={'md'}
                                    variant={'primary'}
                                    type="submit"
                                    disabled={isSubmitting || signUpMutation.isPending}
                                >
                                    {isSubmitting || signUpMutation.isPending ? (
                                        <div className="flex items-center justify-center">
                                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Đang hoàn tất...
                                        </div>
                                    ) : (
                                        'Hoàn tất đăng ký'
                                    )}
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>

            {step === 1 && (
                <>
                    <OrDivider />
                    <SocialButton />
                </>
            )}

            <RedirectLink text="Đã có tài khoản?" linkText="Đăng nhập ngay" href="/auth/login" />
        </AuthContainer>
    );
};

export default SignUpPage;
