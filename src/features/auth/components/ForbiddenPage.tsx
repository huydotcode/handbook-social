'use client';

import { Button } from '@/shared/components/ui/Button';
import { Icons } from '@/shared/components/ui';
import Link from 'next/link';

export const ForbiddenPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-6">
                <Icons.Logo className="h-24 w-24" />
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">
                Truy cập bị từ chối
            </h1>

            <p className="mb-8 max-w-[500px] text-muted-foreground">
                Bạn chưa được cấp quyền truy cập trang này.
            </p>

            <Button asChild variant="default" size="lg">
                <Link href="/">
                    <Icons.Home className="mr-2 h-4 w-4" />
                    Về trang chủ
                </Link>
            </Button>
        </div>
    );
};
