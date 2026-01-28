'use client';
import { useSidebarCollapse } from '@/core/context/SidebarContext';
import { cn } from '@/lib/utils';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { navLink } from '@/shared/constants';
import { useBreakpoint, useOutsideAlerter } from '@/shared/hooks';
import { Breakpoint } from '@/shared/hooks/useBreakpoint';
import { cva, type VariantProps } from 'class-variance-authority';
import { Type } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import SidebarItem from './SidebarItem';
import SidebarList from './SidebarList';
import SidebarUser from './SidebarUser';

const sidebarVariants = cva(
    'no-scrollbar fixed top-[56px] z-20 h-[calc(100vh-56px)] max-w-screen border-r-2 bg-secondary-1 p-2 transition-transform duration-300 ease-in-out dark:border-none dark:bg-dark-secondary-1',
    {
        variants: {
            mobile: {
                open: 'md:translate-x-0',
                closed: 'md:-translate-x-full',
            },
            desktop: {
                visible: 'translate-x-0',
                hidden: 'hidden md:hidden',
            },
            width: {
                default: 'w-[var(--sidebar-width)]',
                sm: 'w-[var(--sidebar-width-sm)]',
                md: 'w-[var(--sidebar-width-md)]',
                lg: 'w-[var(--sidebar-width-lg)]',
                xl: 'w-[var(--sidebar-width-xl)]',
                full: 'w-full',
                responsive:
                    'w-[var(--sidebar-width-responsive)] md:w-[var(--sidebar-width-md)] lg:w-[var(--sidebar-width-lg)] xl:w-[var(--sidebar-width-xl)] 2xl:w-[var(--sidebar-width-2xl)]',
            },
            direction: {
                left: 'left-0',
                right: 'right-0',
            },
            hidden: {
                none: '',
                sm: 'sm:hidden',
                md: 'md:hidden',
                lg: 'lg:hidden',
                xl: 'xl:hidden',
                '2xl': '2xl:hidden',
            },
        },
        defaultVariants: {
            mobile: 'closed',
            desktop: 'visible',
            width: 'default',
            direction: 'left',
            hidden: 'none',
        },
    }
);

type Type = 'main' | 'secondary' | 'fixed';

interface Props extends VariantProps<typeof sidebarVariants> {
    collapseBreakpoints?: Breakpoint[];
    children?: React.ReactNode;
    showOnlyMobile?: boolean;
    defaultOpen?: boolean;
    type?: Type;
    direction?: 'left' | 'right';
    hidden?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const SidebarCollapse: React.FC<Props> = ({
    children,
    collapseBreakpoints = ['sm', 'md', 'lg'],
    showOnlyMobile = false,
    defaultOpen = false,
    width,
    type = 'main',
    direction = 'left',
    hidden,
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
                sidebarVariants({
                    mobile: isMobile
                        ? isSidebarOpen
                            ? 'open'
                            : 'closed'
                        : undefined,
                    desktop: !isMobile
                        ? !showOnlyMobile
                            ? 'visible'
                            : 'hidden'
                        : undefined,
                    width,
                    direction,
                    hidden: hidden ?? 'none',
                })
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

                {type == 'main' && (
                    <>
                        <SidebarUser />
                        <SidebarList>
                            {navLink.map((link) => (
                                <SidebarItem key={link.name} link={link} />
                            ))}
                        </SidebarList>
                    </>
                )}

                {children && children}
            </div>
        </div>
    );
};
export default SidebarCollapse;
