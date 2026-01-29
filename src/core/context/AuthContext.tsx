'use client';
import { axiosAuth } from '@/core/api/axios-instance';
import { useQueryClient } from '@tanstack/react-query';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    role?: string;
    isBlocked?: boolean;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Decode JWT token to get user info
 */
function decodeToken(token: string): User | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            username: decoded.username || '',
            avatar: decoded.picture || '',
            role: decoded.role || 'user',
            isBlocked: decoded.isBlocked || false,
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

/**
 * Auth Provider - Manages user authentication state
 * Uses access token in memory + refresh token in httpOnly cookie
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUserState] = useState<User | null>(null);
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();
    const initializingRef = useRef(false);

    // Refresh access token from cookie on mount
    useEffect(() => {
        const initAuth = async () => {
            if (typeof window === 'undefined' || initializingRef.current) {
                return;
            }

            initializingRef.current = true;

            try {
                const response = await axiosAuth.post('/auth/refresh');
                const newAccessToken = response.data.data.accessToken;

                setAccessTokenState(newAccessToken);
                const decodedUser = decodeToken(newAccessToken);
                setUserState(decodedUser);
            } catch (error) {
                console.log('No valid refresh token');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const setAccessToken = useCallback((token: string | null) => {
        setAccessTokenState(token);
        setIsLoading(false);
        if (token) {
            const decodedUser = decodeToken(token);
            setUserState(decodedUser);
        } else {
            setUserState(null);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await axiosAuth.post('/auth/refresh');
            const newAccessToken = response.data.data.accessToken;
            setAccessTokenState(newAccessToken);
            const decodedUser = decodeToken(newAccessToken);
            setUserState(decodedUser);
        } catch (error) {
            setAccessTokenState(null);
            setUserState(null);
            throw error;
        }
    }, []);

    const setUser = useCallback((newUser: User | null) => {
        setUserState(newUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await axiosAuth.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessTokenState(null);
            setUserState(null);
            queryClient.clear();
        }
    }, [queryClient]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoading,
                isAuthenticated: !!user,
                setUser,
                setAccessToken,
                logout,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
