'use client';

import { useAuth } from '@/core/context/AuthContext';
import { Button } from '@/shared/components/ui/Button';
import { Icons } from '@/shared/components/ui';

export const BlockedPage = () => {
    const { logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-6">
                <Icons.Logo className="h-24 w-24" />
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">
                Tài khoản đã bị khóa
            </h1>

            <p className="mb-8 max-w-[500px] text-muted-foreground">
                Tài khoản của bạn hiện đang bị vô hiệu hóa bởi quản trị viên.
                Vui lòng liên hệ bộ phận hỗ trợ nếu bạn cho rằng đây là sự nhầm
                lẫn.
            </p>

            <Button onClick={logout} variant="default" size="lg">
                <Icons.LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
            </Button>
        </div>
    );
};
