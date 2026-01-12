'use client';
import FileUploader from '@/shared/components/shared/FileUploader';
import { Button } from '@/shared/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useAuth } from '@/core/context';
import { ImageService } from '@/features/image';
import ProfileService from '@/features/user/services/profile.service';
import { uploadImagesWithFiles } from '@/shared/utils/upload-image';
import { IProfile } from '@/types/entites';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    profile: IProfile;
}

const CoverPhoto: React.FC<Props> = ({ profile }) => {
    const { user } = useAuth();
    const canChangeCoverPhoto = user?.id === profile.user._id;
    const [openModal, setOpenModal] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();
    const path = usePathname();

    const handleChangeCoverPhoto = async () => {
        if (files.length === 0) return;

        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'update-cover-photo',
            duration: 3000,
        });

        try {
            const images = await uploadImagesWithFiles({
                files,
            });

            const coverPhotoId = images[0]._id;

            const coverPhotoUrl =
                await ImageService.getUrlByImageId(coverPhotoId);

            if (!coverPhotoUrl) {
                toast.error('Có lỗi xảy ra', {
                    id: 'update-cover-photo',
                });
                return;
            }

            await ProfileService.updateCoverPhoto({
                coverPhoto: coverPhotoUrl,
                userId: profile.user._id,
            });

            // Reset files sau khi upload thành công
            setFiles([]);
            router.refresh();

            toast.success('Cập nhật ảnh bìa thành công!', {
                id: 'update-cover-photo',
            });
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra', {
                id: 'update-cover-photo',
            });
            // Mở lại modal nếu có lỗi để người dùng có thể thử lại
            setOpenModal(true);
        }
    };

    return (
        <>
            <div
                className="relative h-[40vh] min-h-[500px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${profile.coverPhoto || '/assets/img/cover-page.jpg'}`,
                }}
            >
                {canChangeCoverPhoto && (
                    <Dialog
                        open={openModal}
                        onOpenChange={(isOpen) => {
                            setOpenModal(isOpen);
                            // Reset files khi đóng modal
                            if (!isOpen) {
                                setFiles([]);
                            }
                        }}
                    >
                        <DialogTrigger asChild={true}>
                            <Button
                                className="absolute bottom-0 right-0 m-2 text-sm"
                                variant={'secondary'}
                                onClick={() => setOpenModal(true)}
                            >
                                Thay đổi ảnh bìa
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thay đổi ảnh bìa</DialogTitle>
                            </DialogHeader>

                            <FileUploader
                                single
                                onlyImage={true}
                                handleChange={(files) => setFiles(files)}
                            />

                            <DialogFooter>
                                <div className={'flex justify-end gap-2'}>
                                    <Button
                                        className={'min-w-[100px]'}
                                        variant={'primary'}
                                        onClick={handleChangeCoverPhoto}
                                        disabled={files.length === 0}
                                    >
                                        Lưu
                                    </Button>

                                    <Button
                                        variant={'secondary'}
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
};

export default CoverPhoto;
