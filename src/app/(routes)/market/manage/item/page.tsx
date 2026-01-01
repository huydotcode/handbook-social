'use client';
import ListItem from '@/app/(routes)/market/_components/ListItem';
import { useAuth } from '@/core/context';
import { ItemService } from '@/features/item';
import queryKey from '@/lib/queryKey';
import { Loading } from '@/shared/components/ui';
import { IItem } from '@/types/entites';
import { useQuery } from '@tanstack/react-query';

const ManageItemPage = () => {
    const { user } = useAuth();
    const { data: items, isLoading } = useQuery<IItem[]>({
        queryKey: queryKey.items.bySeller(user?.id as string),
        queryFn: () => {
            if (!user?.id) return Promise.resolve([]);
            return ItemService.getBySeller(user.id);
        },
        enabled: !!user?.id,
    });

    return (
        <div className={'h-full w-full'}>
            <h1 className="text-xl font-bold">Các mặt hàng của bạn</h1>

            {isLoading && <Loading fullScreen />}

            {!isLoading && items && <ListItem data={items} isManage />}
        </div>
    );
};

export default ManageItemPage;
