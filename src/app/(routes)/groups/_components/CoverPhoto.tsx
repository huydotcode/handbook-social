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
import GroupService from '@/features/group/services/group.service';
import ImageService from '@/lib/services/image.service';
import { uploadImageWithFile } from '@/shared/utils/upload-image';
import { IGroup } from '@/types/entites';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
    onGroupUpdate?: (updatedGroup: IGroup) => void;
}

const CoverPhoto: React.FC<Props> = ({ group, onGroupUpdate }) => {
    const { user } = useAuth();
    const canChangeCoverPhoto = user?.id === group.creator._id;
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [groupData, setGroupData] = useState<IGroup>(group);
    const path = usePathname();
    const router = useRouter();

    const handleChangeCoverPhoto = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-cover-photo',
            duration: 3000,
        });

        try {
            if (!file) {
                toast.error('Vui lòng chọn ảnh để tải lên');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn tệp hình ảnh');
                return;
            }

            const images = await uploadImageWithFile({
                file,
            });

            const coverPhotoId = images._id;
            const coverPhotoUrl =
                await ImageService.getUrlByImageId(coverPhotoId);

            if (!coverPhotoUrl) {
                toast.error('Có lỗi xảy ra');
                return;
            }

            await GroupService.updateCoverPhoto({
                groupId: group._id,
                coverPhoto: coverPhotoUrl,
                path,
            });

            // Cập nhật cover photo ngay lập tức
            const updatedGroup = { ...groupData, coverPhoto: coverPhotoUrl };
            setGroupData(updatedGroup);
            if (onGroupUpdate) {
                onGroupUpdate(updatedGroup);
            }

            toast.success('Cập nhật ảnh bìa thành công', {
                id: 'uplodate-cover-photo',
            });

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setFile(null);
        }
    };

    return (
        <>
            <div
                className="relative h-[40vh] min-h-[500px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${groupData.coverPhoto || '/assets/img/cover-page.jpg'}`,
                }}
            >
                {canChangeCoverPhoto && (
                    <Dialog
                        open={openModal}
                        onOpenChange={(isOpen) => setOpenModal(isOpen)}
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
                                        onClick={handleChangeCoverPhoto}
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
        </>
    );
};

export default CoverPhoto;
