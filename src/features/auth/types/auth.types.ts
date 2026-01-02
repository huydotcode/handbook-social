/**
 * Auth Request DTOs
 */
export interface LoginDto {
    account: string;
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
    };
}

export interface RefreshResponse {
    accessToken: string;
}
