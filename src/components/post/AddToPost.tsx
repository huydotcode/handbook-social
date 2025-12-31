'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { ChangeEvent, useId } from 'react';

interface Props {
    className?: string;
    handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AddToPost: React.FC<Props> = ({ className = '', handleChangeImage }) => {
    const inputFileId = useId(); // Tạo ID duy nhất cho mỗi instance
    return (
        <div
            className={cn(
                'relative mt-2 flex items-center justify-between rounded-xl border-t-2 px-2 py-2 shadow-md dark:border-none dark:shadow-none',
                className
            )}
        >
            <h5 className={'text-sm'}>Thêm vào bài viết của bạn</h5>

            <div className="flex items-center">
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:cursor-pointer">
                    <label
                        className="flex h-10 w-10 cursor-pointer items-center  justify-center rounded-xl hover:cursor-pointer hover:bg-secondary-2 dark:hover:bg-dark-secondary-2"
                        htmlFor={inputFileId}
                    >
                        <Image
                            src={'/assets/img/images.png'}
                            alt=""
                            width={24}
                            height={24}
                        />
                    </label>
                    <input
                        className="hidden"
                        id={inputFileId}
                        type="file"
                        accept="image/*, video/*"
                        multiple
                        onChange={handleChangeImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddToPost;
