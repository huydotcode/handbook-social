'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FC, useCallback, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@/core/context';
import {
    createPostValidation,
    IPostFormData,
    PostService,
} from '@/features/post';
import { cn } from '@/lib/utils';
import { postAudience } from '@/shared/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileUploaderWrapper } from '../shared/FileUploader';
import { Avatar, Icons } from '../ui';
import { Button } from '../ui/Button';
import { EditorField } from '../ui/EditorV2';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import Video from '../ui/video';
import TagInput from './TagInput';
import { usePathname, useRouter } from 'next/navigation';

export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

interface Props {
    className?: string;
    groupId?: string;
    type?: 'default' | 'profile' | 'group';
    variant?: 'default' | 'modal';
    hasMenu?: boolean;
    onSubmitSuccess?: () => void;
}

const CreatePostV2: FC<Props> = ({
    className,
    groupId,
    type = 'default',
    hasMenu = true,
    variant = 'default',
    onSubmitSuccess,
}) => {
    const { user } = useAuth();
    const router = useRouter();

    const [showMenu, setShowMenu] = useState<boolean>(hasMenu);
    const [showTagInput, setShowTagInput] = useState<boolean>(true);
    const fileInputId = useId();

    const createPostForm = useForm<IPostFormData>({
        defaultValues: {
            content: '',
            option: 'public',
            files: [],
            tags: [],
        },
        resolver: zodResolver(createPostValidation),
    });
    const files = createPostForm.watch('files');

    const sendPost = useCallback(
        async (data: IPostFormData) => {
            if (!user) return;

            try {
                const { content, option, files, tags } = data;

                if (!content && files.length === 0) {
                    toast.error('Vui lòng nhập nội dung hoặc thêm ảnh/video.');
                    return;
                }

                const formData = new FormData();
                if (content) formData.append('content', content);
                if (option) formData.append('option', option);
                if (groupId) formData.append('group', groupId);
                if (type) formData.append('type', type);

                if (tags && tags.length > 0) {
                    tags.forEach((tag) => formData.append('tags[]', tag));
                }

                if (files && files.length > 0) {
                    files.forEach((file) => {
                        formData.append('files', file);
                    });
                }

                const newPost = await PostService.create(formData);

                console.log({
                    newPost,
                });

                if (type === 'default') {
                    // toast.success('Đăng bài thành công!');
                    toast(
                        // Button link href to post
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => {
                                router.push(`/posts/${newPost._id}`);
                            }}
                        >
                            <Avatar
                                width={40}
                                height={40}
                                imgSrc={user.avatar}
                                userUrl={user.id}
                            />
                            <div className="flex flex-col gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Đăng bài thành công!
                                </span>

                                <Button
                                    className="w-fit"
                                    href={`/posts/${newPost._id}`}
                                    size={'xs'}
                                    variant={'primary'}
                                >
                                    Xem bài viết
                                </Button>
                            </div>
                        </div>
                    );
                } else {
                    toast.success(
                        'Bài viết của bạn sẽ được duyệt trước khi hiển thị'
                    );
                }

                createPostForm.reset();

                onSubmitSuccess?.();
            } catch (error: any) {
                throw new Error(error);
            }
        },
        [user, groupId, type, createPostForm, onSubmitSuccess, router]
    );

    const mutation = useMutation({
        mutationFn: sendPost,
    });

    const onSubmit = useCallback(
        async (data: IPostFormData) => {
            try {
                toast.promise(mutation.mutateAsync(data), {
                    loading: 'Bài viết đang được đăng...!',
                    error: 'Đã có lỗi xảy ra khi đăng bài!',
                });

                createPostForm.reset();
            } catch (error: any) {
                console.error(error);
            }
        },
        [createPostForm, mutation]
    );

    // Xử lý thay đổi ảnh
    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const newFiles: File[] = Array.from(fileList || []);

            try {
                for (const file of newFiles) {
                    if (
                        file.type.startsWith('video/') &&
                        file.size > MAX_VIDEO_SIZE
                    ) {
                        toast.error(
                            `Video "${file.name}" quá lớn. Vui lòng chọn video nhỏ hơn 50MB.`
                        );
                        return;
                    }
                }

                // LẤY TẤT CẢ FILES HIỆN TẠI từ form
                const currentFiles = createPostForm.getValues('files') || [];

                // Thêm files mới vào danh sách files hiện tại
                const allFiles = [...currentFiles, ...newFiles];

                // Cập nhật form với TẤT CẢ files
                createPostForm.setValue('files', allFiles);
            } catch (error: any) {
                toast.error(error.message || 'Có lỗi xảy ra khi tải file');
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        // Lấy tất cả files hiện tại từ form
        const currentFiles = createPostForm.getValues('files') || [];

        // Loại bỏ file tại index
        const updatedFiles = currentFiles.filter((_, i) => i !== index);

        // Cập nhật lại form với danh sách files đã loại bỏ
        createPostForm.setValue('files', updatedFiles);
    };

    return (
        <>
            <FileUploaderWrapper
                handleChange={(newFiles: File[]) => {
                    createPostForm.setValue('files', [
                        ...(createPostForm.getValues('files') || []),
                        ...newFiles,
                    ]);
                }}
            >
                <div className={cn('relative mx-auto', className)}>
                    <div className="relative mt-3 flex flex-col">
                        <div className="flex items-center">
                            {user && (
                                <Link href="/">
                                    <Image
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                        src={user.avatar || ''}
                                        alt={user.name || ''}
                                    />
                                </Link>
                            )}

                            <div className="ml-2 flex h-12 flex-col">
                                {user && (
                                    <Link
                                        className="h-6"
                                        href={`/profile/${user.id}`}
                                    >
                                        <span className="text-base dark:text-dark-primary-1">
                                            {user.name}
                                        </span>
                                    </Link>
                                )}

                                <select
                                    className="h-10 cursor-pointer border py-1 text-[10px]"
                                    {...createPostForm.register('option')}
                                >
                                    {postAudience.map((audience) => (
                                        <option
                                            key={audience.value}
                                            value={audience.value}
                                            className="text-sm"
                                        >
                                            {audience.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <form
                            className="flex flex-1 flex-col justify-between p-0 pt-3"
                            onSubmit={createPostForm.handleSubmit(onSubmit)}
                            encType="multipart/form-data"
                        >
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <EditorField
                                            className="no-scrollbar max-h-[30vh] overflow-scroll"
                                            onChange={onChange}
                                            value={value}
                                            hasMenu={showMenu}
                                        />
                                    </>
                                )}
                                name="content"
                                control={createPostForm.control}
                            />

                            {showTagInput && (
                                <Controller
                                    name="tags"
                                    control={createPostForm.control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TagInput
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Nhập tag và nhấn Enter"
                                            maxTags={10}
                                            className="mt-2"
                                        />
                                    )}
                                />
                            )}

                            {createPostForm.formState.errors.content && (
                                <p className="text-sm text-red-500">
                                    {
                                        createPostForm.formState.errors.content
                                            .message
                                    }
                                </p>
                            )}

                            {files && files.length > 0 && (
                                <div className="mt-2 flex w-full flex-wrap gap-2">
                                    {files
                                        .sort((a, b) => {
                                            // Sắp xếp video lên đầu
                                            if (
                                                a.type.startsWith('video/') &&
                                                !b.type.startsWith('video/')
                                            ) {
                                                return -1;
                                            }
                                            if (
                                                !a.type.startsWith('video/') &&
                                                b.type.startsWith('video/')
                                            ) {
                                                return 1;
                                            }

                                            return 0;
                                        })
                                        .map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex items-center gap-2"
                                            >
                                                {file.type.startsWith(
                                                    'video/'
                                                ) ? (
                                                    <Video
                                                        className="rounded-lg object-cover"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                    />
                                                ) : (
                                                    <Image
                                                        className="rounded-lg"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt={file.name}
                                                        width={140}
                                                        height={140}
                                                        quality={100}
                                                    />
                                                )}

                                                <Button
                                                    type="button"
                                                    variant={'secondary'}
                                                    size={
                                                        file.type.startsWith(
                                                            'video/'
                                                        )
                                                            ? 'default'
                                                            : 'xs'
                                                    }
                                                    className="absolute right-2 top-2"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                >
                                                    <Icons.Close className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {createPostForm.formState?.errors?.files
                                ?.message && (
                                <p className="text-xs text-red-500">
                                    {
                                        createPostForm.formState.errors.files
                                            ?.message
                                    }
                                </p>
                            )}

                            <div
                                className={cn(
                                    'relative mt-2 flex items-center justify-between rounded-xl bg-primary-1 px-4 py-1 dark:bg-dark-secondary-1',
                                    variant === 'modal' &&
                                        'border border-secondary-2 dark:border-dark-secondary-2'
                                )}
                            >
                                <h5 className={'text-sm'}>
                                    Thêm vào bài viết của bạn
                                </h5>

                                <div className="flex items-center">
                                    {/* Toggle Menu */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={'ghost'}
                                                    size={'xs'}
                                                    className={cn(
                                                        'mr-2 h-10 w-10 rounded-xl hover:bg-secondary-2 dark:hover:bg-dark-secondary-2',
                                                        showMenu
                                                            ? 'bg-secondary-2 dark:bg-dark-secondary-2'
                                                            : 'bg-transparent'
                                                    )}
                                                    onClick={() =>
                                                        setShowMenu(!showMenu)
                                                    }
                                                >
                                                    <Icons.Menu className="h-4 w-4 text-primary-2" />
                                                </Button>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                <span className="text-xs">
                                                    {showMenu
                                                        ? 'Ẩn công cụ'
                                                        : 'Hiện công cụ'}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Tags */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={'ghost'}
                                                    size={'xs'}
                                                    className={cn(
                                                        'mr-2 h-10 w-10 rounded-xl hover:bg-secondary-2 dark:hover:bg-dark-secondary-2',
                                                        showTagInput
                                                            ? 'bg-secondary-2 dark:bg-dark-secondary-2'
                                                            : 'bg-transparent'
                                                    )}
                                                    onClick={() =>
                                                        setShowTagInput(
                                                            !showTagInput
                                                        )
                                                    }
                                                >
                                                    <Icons.Tag className="h-4 w-4 text-primary-2" />
                                                </Button>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                <span className="text-xs">
                                                    Thêm tag
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:cursor-pointer">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <label
                                                        className="flex h-10 w-10 cursor-pointer items-center  justify-center rounded-xl hover:cursor-pointer hover:bg-secondary-2 dark:hover:bg-dark-secondary-2"
                                                        htmlFor={fileInputId}
                                                    >
                                                        <Icons.Images className="h-4 w-4 text-primary-2" />
                                                    </label>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span className="text-xs">
                                                        Thêm ảnh/video
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <input
                                            className="hidden"
                                            id={fileInputId}
                                            type="file"
                                            accept="image/*, video/*"
                                            multiple
                                            onChange={handleChangeImage}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-3 h-10 w-full disabled:cursor-not-allowed"
                                variant={'primary'}
                                disabled={createPostForm.formState.isSubmitting}
                            >
                                {createPostForm.formState.isSubmitting ? (
                                    <>
                                        <Icons.Loading className="h-4 w-4 animate-spin" />{' '}
                                        Đang đăng...
                                    </>
                                ) : (
                                    'Đăng'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </FileUploaderWrapper>
        </>
    );
};

export default CreatePostV2;
