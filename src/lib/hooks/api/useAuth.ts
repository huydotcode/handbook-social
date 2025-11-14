import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/auth.service';
import type {
    LoginDto,
    SendOTPDto,
    VerifyOTPDto,
    ResetPasswordDto,
} from '@/lib/api/services/auth.service';
import toast from 'react-hot-toast';

/**
 * Hook for user login
 */
export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginDto) => authService.login(data),
        onSuccess: (data) => {
            // Store token
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('accessToken', data.token);
            }
            toast.success('Đăng nhập thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Đăng nhập thất bại');
        },
    });
};

/**
 * Hook for sending OTP
 */
export const useSendOTP = () => {
    return useMutation({
        mutationFn: (data: SendOTPDto) => authService.sendOTP(data),
        onSuccess: () => {
            toast.success('OTP đã được gửi đến email của bạn');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể gửi OTP');
        },
    });
};

/**
 * Hook for verifying OTP
 */
export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: (data: VerifyOTPDto) => authService.verifyOTP(data),
        onSuccess: () => {
            toast.success('Xác thực OTP thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'OTP không hợp lệ');
        },
    });
};

/**
 * Hook for resetting password
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
        onSuccess: () => {
            toast.success('Đặt lại mật khẩu thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể đặt lại mật khẩu');
        },
    });
};
