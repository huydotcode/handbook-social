'use client';
import {
    AppProvider,
    SocialProvider,
    SocketProvider,
    VideoCallProvider,
    AuthProvider,
} from '@/context';
import { AxiosInterceptor } from '@/components/auth/AxiosInterceptor';
import { VideoCallWrapper } from '@/components/video-call';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { FunctionComponent, ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Create QueryClient with default options
 */
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 5 minutes
                staleTime: 1000 * 60 * 5,
                // Cache data for 10 minutes (previously cacheTime, renamed in v5)
                gcTime: 1000 * 60 * 10,
                // Don't refetch on window focus
                refetchOnWindowFocus: false,
                // Don't refetch on mount if data is fresh
                refetchOnMount: false,
                // Retry failed requests once
                retry: 1,
                // Retry delay increases exponentially
                retryDelay: (attemptIndex) =>
                    Math.min(1000 * 2 ** attemptIndex, 30000),
            },
            mutations: {
                // Retry failed mutations once
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AxiosInterceptor />
                <SocketProvider>
                    <SocialProvider>
                        <AppProvider>
                            <VideoCallProvider>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="system"
                                    enableSystem
                                >
                                    <Toaster
                                        position="bottom-left"
                                        reverseOrder={false}
                                    />
                                    {children}
                                    <VideoCallWrapper />
                                </ThemeProvider>
                            </VideoCallProvider>
                        </AppProvider>
                    </SocialProvider>
                </SocketProvider>
            </AuthProvider>
            {/* React Query DevTools - only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
};

export default Providers;
