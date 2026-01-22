'use client';
import { useSidebarCollapse } from '@/core/context/SidebarContext';
import { cn } from '@/lib/utils';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useBreakpoint, useOutsideAlerter } from '@/shared/hooks';
import { Breakpoint } from '@/shared/hooks/useBreakpoint';
import React, { useEffect, useRef } from 'react';

interface Props {
    collapseBreakpoints?: Breakpoint[];
    children: React.ReactNode;
    showOnlyMobile?: boolean;
    defaultOpen?: boolean;
}

const SidebarCollapse: React.FC<Props> = ({
    children,
    collapseBreakpoints = ['sm', 'md', 'lg'],
    showOnlyMobile = false,
    defaultOpen = false,
}) => {
    const { breakpoint } = useBreakpoint();
    const sidebarRef = useRef(null);
    const isMobile = collapseBreakpoints.includes(breakpoint);
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarCollapse();
    useOutsideAlerter(
        sidebarRef,
        (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('#sidebar-toggle-btn')) return;
            setIsSidebarOpen(false);
        },
        isMobile
    );

    useEffect(() => {
        if (defaultOpen) {
            setIsSidebarOpen(true);
        }
    }, [defaultOpen, setIsSidebarOpen]);

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile, setIsSidebarOpen]);

    return (
        <div
            className={cn(
                'no-scrollbar fixed left-0 top-[56px] z-20 h-[calc(100vh-56px)] w-[300px] max-w-screen border-r-2 bg-secondary-1 p-2 transition-transform duration-300 ease-in-out dark:border-none dark:bg-dark-secondary-1',
                {
                    'translate-x-0': isMobile && isSidebarOpen,
                    '-translate-x-full': isMobile && !isSidebarOpen,
                    'md:translate-x-0': !isMobile && !showOnlyMobile,
                    'hidden md:hidden': !isMobile && showOnlyMobile,
                }
            )}
            ref={sidebarRef}
        >
            <div className="relative flex h-full flex-col p-2">
                {isSidebarOpen && (
                    <Button
                        className={cn(
                            'absolute -right-[60px] top-4 z-50 hidden rounded-l-none rounded-r-md bg-secondary-2 shadow-xl transition-all duration-300 ease-in-out dark:bg-dark-secondary-2',
                            {
                                'md:block': collapseBreakpoints.includes('md'),
                                'lg:block': collapseBreakpoints.includes('lg'),
                                'sm:block': collapseBreakpoints.includes('sm'),
                                'xl:block': collapseBreakpoints.includes('xl'),
                            }
                        )}
                        variant={'secondary'}
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                    >
                        <Icons.Close className="h-5 w-5" />
                    </Button>
                )}

                {children}
            </div>
        </div>
    );
};
export default SidebarCollapse;
