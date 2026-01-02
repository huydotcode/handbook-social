import { useAuth } from '@/core/context/AuthContext';
import type {
    LoginDto,
    LoginResponse,
    RegisterDto,
    ResetPasswordDto,
    SendOTPDto,
    VerifyOTPDto,
} from '@/features/auth';
import AuthService from '@/features/auth/services/auth.service';
import { queryKey } from '@/lib/react-query/query-key';
import { handleApiError, showSuccessToast } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for user login
 */
export const useLoginMutation = () => {
    const { setAccessToken, setUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => AuthService.login(data),
        onSuccess: (data: LoginResponse) => {
            if (data.accessToken) {
                setAccessToken(data.accessToken);

                if (data.user) {
                    setUser(data.user);
                }
            }

            // Invalidate auth query
            queryClient.invalidateQueries({ queryKey: queryKey.auth.current });
            showSuccessToast('Đăng nhập thành công');
        },
    });
};

/**
 * Hook for user signup
 */
export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: RegisterDto) => AuthService.register(data),
        onSuccess: () => {
            showSuccessToast('Đăng ký tài khoản thành công');
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
        mutationFn: (data: SendOTPDto) => AuthService.sendOTP(data.email),
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
        mutationFn: (data: VerifyOTPDto) =>
            AuthService.verifyOTP({ email: data.email, otp: data.otp }),
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
        mutationFn: (data: ResetPasswordDto) =>
            AuthService.resetPassword({
                email: data.email,
                newPassword: data.newPassword,
            }),
        onSuccess: () => {
            showSuccessToast('Đặt lại mật khẩu thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể đặt lại mật khẩu');
        },
    });
};
