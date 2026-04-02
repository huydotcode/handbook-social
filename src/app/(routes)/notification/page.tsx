'use client';

import { useAuth } from '@/core/context/AuthContext';
import { NotificationService, useNotifications } from '@/features/notification';
import { Button } from '@/shared/components/ui/Button';
import { useQueryInvalidation } from '@/shared/hooks';
import NotificationItem from '@/shared/components/layout/NotificationItem';
import { toast } from 'sonner';

export default function NotificationPage() {
    const { user } = useAuth();
    const { data: notifications, isLoading } = useNotifications(user?.id);
    const { invalidateNotifications } = useQueryInvalidation();

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            await invalidateNotifications(user?.id as string);
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div className="relative top-[56px] min-h-[calc(100vh-56px)] w-full bg-primary-1 pb-10 dark:bg-dark-primary-1">
            <div className="mx-auto mt-2 w-[600px] max-w-screen md:w-full md:px-2">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-dark-primary-1">Thông báo</h1>

                    {notifications && notifications.length > 0 && (
                        <Button size={'sm'} variant={'outline'} onClick={handleMarkAllAsRead}>
                            Đánh dấu đã đọc tất cả
                        </Button>
                    )}
                </div>

                <div className="dark:bg-dark-secondary-2/50 rounded-xl bg-white p-4 shadow-sm">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center dark:text-dark-primary-1">
                            <p>Đang tải thông báo...</p>
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <NotificationItem key={notification._id} data={notification} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center dark:text-dark-primary-1">
                            <p>Không có thông báo nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
