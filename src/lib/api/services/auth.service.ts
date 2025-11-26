import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    username: string;
    name: string;
    password: string;
    avatar?: string;
}

export interface SendOTPDto {
    email: string;
}

export interface VerifyOTPDto {
    email: string;
    otp: string;
}

export interface ResetPasswordDto {
    email: string;
    newPassword: string;
}

export interface LoginResponse {
    token: string;
    user?: {
        id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
        username: string;
    };
}

export const authService = {
    /**
     * Register user
     */
    register: (data: RegisterDto) => {
        return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
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
