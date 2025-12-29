import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/auth.service';
import type {
    LoginDto,
    SendOTPDto,
    VerifyOTPDto,
    ResetPasswordDto,
    LoginResponse,
} from '@/lib/api/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { queryKey } from '@/lib/queryKey';
import {
    handleApiError,
    showSuccessToast,
} from '../utils';

/**
 * Hook for user login
 */
export const useLogin = () => {
    const { setAccessToken, setUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => authService.login(data),
        onSuccess: (data: LoginResponse) => {
            // Store access token in memory via context
            if (data.accessToken) {
                setAccessToken(data.accessToken);

                // User will be set automatically in setAccessToken,
                // but if provided explicitly, use it
                if (data.user) {
                    setUser(data.user);
                }
            }

            // Invalidate auth query
            queryClient.invalidateQueries({ queryKey: queryKey.auth.current });
            showSuccessToast('Đăng nhập thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Đăng nhập thất bại');
        },
    });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
    const { logout } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Clear token and user
            logout();
        },
        onSuccess: () => {
            // Clear all queries
            queryClient.clear();
            showSuccessToast('Đăng xuất thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Đăng xuất thất bại');
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
            showSuccessToast('OTP đã được gửi đến email của bạn');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể gửi OTP');
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
            showSuccessToast('Xác thực OTP thành công');
        },
        onError: (error) => {
            handleApiError(error, 'OTP không hợp lệ');
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
            showSuccessToast('Đặt lại mật khẩu thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể đặt lại mật khẩu');
        },
    });
};
