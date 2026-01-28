'use client';
import SidebarCollapse from '@/shared/components/layout/sidebar/SidebarCollapse';
import { Button } from '@/shared/components/ui/Button';
import { useSidebarCollapse } from '@/core/context/SidebarContext';
import { cn } from '@/lib/utils';
import { searchType } from '@/shared/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Sidebar = () => {
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const typeParams = searchParams.get('type') || 'all';

    return (
        <SidebarCollapse>
            <Button
                className="justify-start p-0"
                variant={'custom'}
                href={'/market'}
            >
                <h1 className="text-2xl font-bold">Tìm kiếm</h1>
            </Button>

            <Button
                className={cn('mt-2 w-full justify-start pl-4', {
                    'bg-primary-2 text-white hover:text-dark-primary-1 dark:bg-dark-primary-1':
                        path === '/search' && !searchParams.get('type'),
                })}
                onClick={() => {
                    setIsSidebarOpen(false);
                    router.push(`/search?q=${query}`);
                }}
            >
                Tất cả
            </Button>

            {searchType.map((type) => (
                <Button
                    key={type.name}
                    className={cn('mt-2 w-full justify-start pl-4', {
                        'bg-primary-2 text-white hover:text-dark-primary-1 dark:bg-dark-primary-1':
                            type.name === typeParams,
                    })}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push(`/search?type=${type.name}&q=${query}`);
                    }}
                >
                    <type.icon className="h-5 w-5" /> {type.label}
                </Button>
            ))}
        </SidebarCollapse>
    );
};

export default Sidebar;
