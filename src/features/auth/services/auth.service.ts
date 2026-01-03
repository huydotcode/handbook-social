import { authApi } from '../apis/auth.api';
import {
    LoginDto,
    LoginResponse,
    RegisterDto,
    RegisterResponse,
} from '../types/auth.types';

class AuthServiceClass {
    /**
     * Register a new user
     */
    public async register(data: RegisterDto): Promise<RegisterResponse> {
        try {
            const response = await authApi.register(data);
            return response;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    /**
     * Login user with account (email or username) and password
     */
    public async login(data: LoginDto): Promise<LoginResponse> {
        try {
            const response = await authApi.login(data);
            return response;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    /**
     * Send OTP to user email (register or forgot_password)
     */
    public async sendOTP(
        email: string,
        type: 'register' | 'forgot_password'
    ): Promise<void> {
        try {
            await authApi.sendOTP({ email, type });
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    }

    /**
     * Verify OTP code
     */
    public async verifyOTP({
        email,
        otp,
    }: {
        email: string;
        otp: string;
    }): Promise<void> {
        try {
            await authApi.verifyOTP({ email, otp });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }

    /**
     * Reset password with email and new password
     */
    public async resetPassword({
        email,
        newPassword,
        otp,
    }: {
        email: string;
        newPassword: string;
        otp: string;
    }): Promise<void> {
        try {
            await authApi.resetPassword({ email, newPassword, otp });
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    /**
     * Login with Google
     */
    public async loginWithGoogle(code: string): Promise<LoginResponse> {
        try {
            const response = await authApi.loginWithGoogle({ code });
            return response;
        } catch (error) {
            console.error('Error logging in with Google:', error);
            throw error;
        }
    }
}

const AuthService = new AuthServiceClass();
export default AuthService;
