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
     * Login user with email and password
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
     * Send OTP to user email for password reset
     */
    public async sendOTP(email: string): Promise<void> {
        try {
            await authApi.sendOTP({ email });
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
    }: {
        email: string;
        newPassword: string;
    }): Promise<void> {
        try {
            await authApi.resetPassword({ email, newPassword });
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
}

const AuthService = new AuthServiceClass();
export default AuthService;
