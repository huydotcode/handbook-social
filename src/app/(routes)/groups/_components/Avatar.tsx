import { useAuth } from '@/core/context';
import GroupService from '@/features/group/services/group.service';
import { cn } from '@/lib/utils';
import { showErrorToast, showLoadingToast, showSuccessToast } from '@/shared';
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
import { uploadImageWithFile } from '@/shared/utils/upload-image';
import { IGroup } from '@/types/entites';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
    group: IGroup;
    onGroupUpdate?: (updatedGroup: IGroup) => void;
}

const Avatar: React.FC<Props> = ({ group, onGroupUpdate }) => {
    const path = usePathname();
    const { user } = useAuth();
    const [hover, setHover] = useState(false);
    const canChangeAvatar = user?.id === group.creator._id;
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [groupData, setGroupData] = useState<IGroup>(group);

    const handleChangeAvatar = async () => {
        setOpenModal(false);
        showLoadingToast('Đang tải ảnh lên...');

        try {
            if (!file) {
                showErrorToast('Vui lòng chọn ảnh để tải lên');
                return;
            }

            const avatar = await uploadImageWithFile({
                file: file,
            });

            if (!avatar?._id) {
                showErrorToast(
                    'Có lỗi xảy ra khi tải ảnh lên, vui lòng thử lại sau'
                );
                return;
            }

            await GroupService.updateAvatar({
                avatarId: avatar._id,
                groupId: group._id,
                path,
            });

            // Cập nhật avatar ngay lập tức
            const updatedGroup = { ...groupData, avatar };
            setGroupData(updatedGroup);
            if (onGroupUpdate) {
                onGroupUpdate(updatedGroup);
            }

            showSuccessToast('Thay đổi ảnh đại diện thành công');
        } catch (error) {
            console.error(error);
            showErrorToast('Có lỗi xảy ra');
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
                src={groupData?.avatar.url || ''}
                alt={groupData?.name || ''}
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
                            handleChange={(files) => {
                                if (files.length > 0) {
                                    setFile(files[0]);
                                }
                            }}
                            onlyImage
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
