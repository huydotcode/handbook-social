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
import ProfileService from '@/features/user/services/profile.service';
import { uploadImageWithFile } from '@/shared/utils/upload-image';
import { cn } from '@/lib/utils';
import { IUser } from '@/types/entites';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    user: IUser;
}

const Avatar: React.FC<Props> = ({ user }) => {
    const { user: currentUser, setUser } = useAuth();
    const [hover, setHover] = useState(false);
    const canChangeAvatar = currentUser?.id === user._id;
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleChangeAvatar = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-avatar',
            duration: 3000,
        });

        try {
            if (!file) {
                toast.error('Vui lòng chọn ảnh để tải lên');
                return;
            }

            const image = await uploadImageWithFile({
                file,
            });

            await ProfileService.updateAvatar({
                avatar: image.url,
                userId: user._id,
            });

            router.refresh();

            toast.success('Cập nhật ảnh đại diện thành công', {
                id: 'uplodate-avatar',
            });

            if (currentUser) {
                setUser({
                    ...currentUser,
                    avatar: image.url,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div
            className="relative top-[-30px] mr-4 h-[164px] w-[164px] overflow-hidden rounded-full border-8 object-cover dark:border-dark-secondary-2 md:h-[120px] md:w-[120px]"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Image
                className={cn(
                    'rounded-full transition-all duration-200',
                    hover && canChangeAvatar && 'opacity-80'
                )}
                src={user?.avatar || ''}
                alt={user?.name || ''}
                fill
            />

            {canChangeAvatar && (
                <Dialog
                    open={openModal}
                    onOpenChange={(isOpen) => setOpenModal(isOpen)}
                >
                    <DialogTrigger asChild={true}>
                        {hover && (
                            <div className="absolute bottom-0 left-0 right-0 rounded-b-full bg-dark-secondary-1  bg-opacity-90 p-2">
                                <Button
                                    variant={'custom'}
                                    className="w-full text-sm text-white"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Thay đổi
                                </Button>
                            </div>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
                        </DialogHeader>

                        <FileUploader
                            single
                            onlyImage
                            handleChange={(files) => {
                                if (files.length > 0) {
                                    setFile(files[0]);
                                } else {
                                    setFile(null);
                                }
                            }}
                        />

                        <DialogFooter>
                            <div className={'flex justify-end gap-2'}>
                                <Button
                                    className={'min-w-[100px]'}
                                    variant={'primary'}
                                    onClick={handleChangeAvatar}
                                    disabled={!file}
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
    );
};

export default Avatar;
