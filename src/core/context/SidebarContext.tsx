'use client';
import { createContext, useContext, useState } from 'react';

interface SidebarCollapseContextProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarCollapseContext = createContext<
    SidebarCollapseContextProps | undefined
>(undefined);

export const useSidebarCollapse = () => {
    const context = useContext(SidebarCollapseContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
};

export default function SidebarProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <SidebarCollapseContext.Provider
            value={{ isSidebarOpen, setIsSidebarOpen }}
        >
            {children}
        </SidebarCollapseContext.Provider>
    );
}
