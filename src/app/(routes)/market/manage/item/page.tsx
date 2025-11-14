'use client';
import ListItem from '@/app/(routes)/market/_components/ListItem';
import { Loading } from '@/components/ui';
import { API_ROUTES } from '@/config/api';
import { useAuth } from '@/context';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';

const ManageItemPage = () => {
    const { user } = useAuth();
    const { data: items, isLoading } = useQuery<IItem[]>({
        queryKey: queryKey.items.bySeller(user?.id as string),
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(
                    API_ROUTES.ITEMS.BY_SELLER(user?.id as string)
                );

                return res.data;
            } catch (error) {
                console.log(error);
            }
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
