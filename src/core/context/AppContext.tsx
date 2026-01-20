'use client';
import { useSocketNotification } from '@/features/notification/hooks/useSocketNotification';
import { soundManager } from '@/shared/utils/sound-manager';
import { useEffect, useState } from 'react';
import { SidebarCollapseContext } from './SidebarContext';

function AppProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useSocketNotification();

    // Preload các âm thanh
    useEffect(() => {
        soundManager.preload(
            'message',
            '/assets/sounds/message-notification.mp3'
        );
        soundManager.preload('phone-ring', '/assets/sounds/phone-ringing.mp3');
    }, []);

    return (
        <SidebarCollapseContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
            }}
        >
            {children}
        </SidebarCollapseContext.Provider>
    );
}

export default AppProvider;
