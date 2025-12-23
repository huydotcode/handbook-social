'use client';
import { Icons } from '@/components/ui';

import { Button } from '@/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { uploadImageWithFile } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { createGroupValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sidebar } from '../_components';
import { useCreateGroup } from '@/lib/hooks/api/useGroup';

const INPUT_CLASSNAME =
    'my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1';

interface ICreateGroup {
    name: string;
    description: string;
    type: 'public' | 'private';
    file?: File;
}

const CreateGroupPage: React.FC = ({}) => {
    const form = useForm<ICreateGroup>({
        defaultValues: {
            type: 'public',
            description: '',
            name: '',
            file: undefined,
        },
        resolver: zodResolver(createGroupValidation),
    });
    const {
        handleSubmit,

        watch,
        formState: { isSubmitting, errors },
    } = form;
    const { user } = useAuth();
    const file = watch('file');
    const fileInputId = useId();
    const router = useRouter();
    const createGroup = useCreateGroup();

    const onSubmit = async (data: ICreateGroup) => {
        if (isSubmitting || createGroup.isPending) return;

        try {
            if (!data.file) {
                toast.error('Vui lòng chọn ảnh đại diện cho nhóm!');
                return;
            }

            const avatar = await uploadImageWithFile({
                file: data.file,
            });

            if (!avatar) {
                toast.error(
                    'Có lỗi xảy ra khi tải ảnh đại diện, vui lòng thử lại!'
                );
                return;
            }

            const newGroup = await createGroup.mutateAsync({
                ...data,
                avatar: avatar._id,
            });

            if (newGroup?._id) {
                router.push(`/groups/${newGroup._id}`);
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <>
            <Sidebar />

            <div className="ml-300 mt-4">
                <div className="mx-auto w-[500px] max-w-screen rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-2">
                    <div className={'flex items-center justify-between'}>
                        <h5 className="text-xl font-bold">Tạo nhóm</h5>
                        <Button href={'/groups'} variant={'text'} size={'xs'}>
                            Trở về trang nhóm
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-4 flex flex-col space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên nhóm</FormLabel>
                                        <FormControl>
                                            <Input
                                                className={INPUT_CLASSNAME}
                                                placeholder="Tên nhóm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Input
                                                className={INPUT_CLASSNAME}
                                                placeholder="Mô tả nhóm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ảnh đại diện */}
                            <div>
                                <label htmlFor={fileInputId}>
                                    Ảnh đại diện
                                </label>
                                <label
                                    className="flex items-center"
                                    htmlFor={fileInputId}
                                >
                                    <span className="mr-2 p-2">
                                        {file ? (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="avatar"
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <Icons.Images className="h-8 w-8" />
                                        )}
                                    </span>
                                    Chọn ảnh đại diện
                                </label>
                                <input
                                    type="file"
                                    id={fileInputId}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            form.setValue('file', files[0]);
                                        } else {
                                            form.setValue('file', undefined);
                                        }
                                    }}
                                />

                                {errors.file && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.file.message}
                                    </p>
                                )}
                            </div>

                            {/* Loại nhóm */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại nhóm</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className={INPUT_CLASSNAME}
                                            >
                                                <option value="public">
                                                    Công khai
                                                </option>
                                                <option value="private">
                                                    Riêng tư
                                                </option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                className="mt-2"
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting || createGroup.isPending}
                                size={'sm'}
                            >
                                {isSubmitting || createGroup.isPending
                                    ? 'Đang tạo nhóm...'
                                    : 'Tạo nhóm'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};
export default CreateGroupPage;
