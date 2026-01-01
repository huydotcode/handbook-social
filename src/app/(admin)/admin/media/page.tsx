'use client';
import { ConfirmModal, Icons, Loading } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/components/ui/tabs';
import VideoPlayer from '@/shared/components/ui/VideoPlayer';
import { adminService } from '@/lib/api/services/admin.service';
import queryKey from '@/lib/queryKey';
import { timeConvert, timeConvert4 } from '@/shared';
import { IMedia } from '@/types/entites';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AdminMediaPage = () => {
    const queryClient = useQueryClient();
    const {
        data: medias,
        isLoading,
        isFetching,
        refetch,
    } = useQuery<IMedia[]>({
        queryKey: queryKey.admin.media.index,
        queryFn: async () => {
            return await adminService.getMedias({
                page_size: 100, // You can adjust the limit as needed
                page: 1, // You can adjust the page as needed
            });
        },
        initialData: [],
    });

    const deleteMediaMutation = useMutation({
        mutationFn: adminService.deleteMedia,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.media.index,
            });
            toast.success('Phương tiện đã được xóa thành công.');
        },
        onError: () => {
            toast.error(
                'Xóa phương tiện không thành công. Vui lòng thử lại sau.'
            );
        },
    });

    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = useState<string | null>(null);

    const handleDeleteMedia = async (mediaId: string) => {
        try {
            toast.loading('Đang xóa phương tiện...', { id: 'delete-media' });
            await deleteMediaMutation.mutateAsync(mediaId);
            setMediaIdToDelete(null);
            setOpenModalConfirmDelete(false);
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const handleClickDelete = (mediaId: string) => {
        setMediaIdToDelete(mediaId);
        setOpenModalConfirmDelete(true);
    };

    // Gallery or list rendering logic can be added here
    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Quản lý phương tiện</h1>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="image">Hình ảnh</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                </TabsList>

                {['all', 'image', 'video'].map((tabValue) => {
                    const filteredMedias =
                        tabValue === 'all'
                            ? medias
                            : medias?.filter(
                                  (media) => media.resourceType === tabValue
                              );

                    return (
                        <TabsContent key={tabValue} value={tabValue}>
                            {!isLoading &&
                                !isFetching &&
                                filteredMedias?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                                        {filteredMedias.map((media) => (
                                            <div
                                                key={media._id}
                                                className="relative flex flex-col items-center justify-center rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1"
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="absolute right-2 top-2 z-10"
                                                    onClick={() =>
                                                        handleClickDelete(
                                                            media._id
                                                        )
                                                    }
                                                >
                                                    <Icons.Delete className="h-4 w-4" />
                                                </Button>

                                                <div className="relative mb-2 h-[300px] w-full overflow-hidden rounded-lg">
                                                    {media.resourceType ===
                                                    'image' ? (
                                                        <Image
                                                            src={media.url}
                                                            alt={media.url}
                                                            fill
                                                            className="h-full w-full object-contain object-center"
                                                        />
                                                    ) : (
                                                        <VideoPlayer
                                                            containerClassName="h-full w-full"
                                                            videoClassName="object-contain object-center"
                                                            src={media.url}
                                                        />
                                                    )}
                                                </div>

                                                <p className="mt-2 text-sm">
                                                    Người đăng{' '}
                                                    {media?.creator?.name ||
                                                        'Không xác định'}
                                                </p>
                                                <p className="text-xs">
                                                    Ngày đăng:{' '}
                                                    {timeConvert4(
                                                        media.createdAt.toString()
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </TabsContent>
                    );
                })}
            </Tabs>

            {(isLoading || isFetching) && <Loading fullScreen />}

            {!isLoading && !isFetching && (!medias || medias.length === 0) && (
                <div className="text-center">
                    <p className="text-gray-500">
                        Không có phương tiện nào được tìm thấy.
                    </p>
                </div>
            )}

            <ConfirmModal
                cancelText="Hủy"
                confirmText="Xóa"
                open={openModalConfirmDelete}
                message="Bạn có chắc chắn muốn xóa phương tiện này?"
                setShow={setOpenModalConfirmDelete}
                onClose={() => setOpenModalConfirmDelete(false)}
                onConfirm={() => {
                    if (mediaIdToDelete) {
                        handleDeleteMedia(mediaIdToDelete);
                    }
                    setOpenModalConfirmDelete(false);
                }}
                title="Xác nhận xóa phương tiện"
            />
        </div>
    );
};

export default AdminMediaPage;
