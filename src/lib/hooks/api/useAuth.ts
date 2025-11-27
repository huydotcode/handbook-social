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
    const { setUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => authService.login(data),
        onSuccess: (data: LoginResponse) => {
            // Store token
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('accessToken', data.token);

                // Set user in context if provided
                if (data.user) {
                    setUser(data.user);
                } else {
                    // Decode token to get user info
                    try {
                        const base64Url = data.token.split('.')[1];
                        const base64 = base64Url
                            .replace(/-/g, '+')
                            .replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(
                                    (c) =>
                                        '%' +
                                        (
                                            '00' + c.charCodeAt(0).toString(16)
                                        ).slice(-2)
                                )
                                .join('')
                        );
                        const decoded = JSON.parse(jsonPayload);
                        setUser({
                            id: decoded.id,
                            name: decoded.name,
                            email: decoded.email,
                            username: decoded.username || '',
                            avatar: decoded.picture || '',
                            role: decoded.role || 'user',
                        });
                    } catch (error) {
                        console.error('Error decoding token:', error);
                    }
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
