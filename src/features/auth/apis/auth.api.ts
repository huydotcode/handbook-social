import { API_ENDPOINTS, apiClient } from '@/core/api';
import {
    LoginDto,
    LoginResponse,
    RegisterDto,
    RegisterResponse,
    ResetPasswordDto,
    SendOTPDto,
    VerifyOTPDto,
} from '../types/auth.types';

export const authApi = {
    /**
     * Register user
     */
    register: (data: RegisterDto) => {
        return apiClient.post<RegisterResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );
    },

    /**
     * Login user
     */
    login: (data: LoginDto) => {
        return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    },

    /**
     * Send OTP to user email
     */
    sendOTP: (data: SendOTPDto) => {
        return apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
    },

    /**
     * Verify OTP
     */
    verifyOTP: (data: VerifyOTPDto) => {
        return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    },

    /**
     * Reset password
     */
    resetPassword: (data: ResetPasswordDto) => {
        return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    },
};
