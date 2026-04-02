/**
 * Auth Request DTOs
 */
export interface LoginDto {
    account: string;
    password: string;
}

export interface RegisterDto {
    email?: string;
    username: string;
    familyName: string;
    givenName: string;
    password: string;
    otp?: string;
}

export interface CheckUsernameDto {
    username: string;
}

export interface CheckUsernameResponse {
    available: boolean;
    message: string;
}

export interface SendOTPDto {
    email: string;
    type: 'register' | 'forgot_password';
}

export interface VerifyOTPDto {
    email: string;
    otp: string;
}

export interface ResetPasswordDto {
    email: string;
    newPassword: string;
    otp: string;
}

/**
 * Auth Response DTOs
 */
export interface RegisterResponse {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar: string;
}

export interface LoginResponse {
    accessToken: string;
    user?: {
        id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
        username: string;
        isBlocked?: boolean;
    };
}

export interface RefreshResponse {
    accessToken: string;
}
