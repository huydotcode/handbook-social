'use client';
import { useSocketNotification } from '@/features/notification/hooks/useSocketNotification';
import { soundManager } from '@/shared/utils/sound-manager';
import { useEffect } from 'react';

function AppProvider({ children }: { children: React.ReactNode }) {
    useSocketNotification();

    // Preload các âm thanh
    useEffect(() => {
        soundManager.preload(
            'message',
            '/assets/sounds/message-notification.mp3'
        );
        soundManager.preload('phone-ring', '/assets/sounds/phone-ringing.mp3');
    }, []);

    return <>{children}</>;
}

export default AppProvider;
