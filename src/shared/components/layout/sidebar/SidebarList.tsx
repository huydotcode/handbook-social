'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SidebarListProps {
    children: React.ReactNode;
    className?: string;
}

const SidebarList: React.FC<SidebarListProps> = ({ children, className }) => {
    return (
        <ul
            className={cn(
                `flex w-full flex-col items-center justify-between overflow-hidden bg-white dark:bg-dark-secondary-1`,
                className
            )}
        >
            {children}
        </ul>
    );
};

export default SidebarList;
