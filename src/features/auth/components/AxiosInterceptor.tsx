'use client';
import { useAuth } from '@/context';
import { setAccessTokenGetter, setRefreshTokenCallback } from '@/lib/axios';
import { useEffect, useRef } from 'react';

export default function AxiosInterceptor() {
    const { accessToken, refreshAccessToken } = useAuth();
    const isSetupRef = useRef(false);

    // Set callbacks only once on mount
    useEffect(() => {
        if (!isSetupRef.current) {
            // Set token getter that always returns current token
            setAccessTokenGetter(() => {
                return accessToken;
            });

            // Set refresh callback
            setRefreshTokenCallback(refreshAccessToken);

            isSetupRef.current = true;
        }
    }, [accessToken, refreshAccessToken]);

    // Update token getter when accessToken changes (without re-setting callback)
    useEffect(() => {
        if (isSetupRef.current) {
            setAccessTokenGetter(() => accessToken);
        }
    }, [accessToken]);

    return null;
}
