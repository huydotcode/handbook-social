'use client';
import { useQueryClient } from '@tanstack/react-query';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
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
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

/**
 * Auth Provider - Manages user authentication state
 * Replaces NextAuth session management
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log('AuthProvider - user', user);
    }, [user]);

    // Load user from token on mount
    useEffect(() => {
        const loadUser = () => {
            if (typeof window === 'undefined') {
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedUser = decodeToken(token);
                setUserState(decodedUser);
            } else {
                setUserState(null);
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    // Listen for storage changes (logout from other tabs)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                if (!e.newValue) {
                    // Token was removed, clear user
                    setUserState(null);
                    queryClient.clear();
                } else {
                    // Token was added, decode and set user
                    const decodedUser = decodeToken(e.newValue);
                    setUserState(decodedUser);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [queryClient]);

    const setUser = useCallback((newUser: User | null) => {
        setUserState(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setUserState(null);
        queryClient.clear();
    }, [queryClient]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                setUser,
                logout,
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
