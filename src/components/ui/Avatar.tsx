'use client';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    avatar?: string;
    image?: string;
}

interface Props {
    className?: string;
    session?: Session;
    user?: User;
    userUrl?: string;
    imgSrc?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    alt?: string;
    href?: string;
    rounded?: string;
    onlyImage?: boolean;
}

const Avatar: React.FC<Props> = ({
    className,
    session,
    user,
    imgSrc,
    userUrl,
    alt,
    width = 32,
    height = 32,
    fill = false,
    href,
    rounded = 'full',
    onlyImage = false,
}) => {
    // Prefer user over session
    const userId = user?.id || session?.user.id || userUrl;
    const userImage =
        user?.avatar || user?.image || session?.user.image || imgSrc;
    const userName = user?.name || session?.user.name || alt;

    const isUser = !!userId;
    const [isError, setIsError] = useState<boolean>(false);
    const sizeProps = fill
        ? { fill: true }
        : {
              width: width,
              height: height,
          };

    if (onlyImage) {
        return (
            <Image
                className={cn(`rounded-${rounded}`, className)}
                src={isError ? '/assets/img/user-profile.jpg' : userImage || ''}
                alt={userName || ''}
                priority={true}
                onError={() => setIsError(true)}
                {...sizeProps}
            />
        );
    }

    return (
        <Link
            className={className}
            href={(isUser && `/profile/${userId}`) || (href && href) || ''}
        >
            <Image
                className={cn(`rounded-${rounded}`, className)}
                src={isError ? '/assets/img/user-profile.jpg' : userImage || ''}
                alt={userName || ''}
                priority={true}
                onError={() => setIsError(true)}
                {...sizeProps}
            />
        </Link>
    );
};

export const SkeletonAvatar: React.FC<Props> = ({
    className,
    width = 40,
    height = 40,
    rounded = 'full',
}) => {
    return (
        <div
            className={cn(
                'animate-pulse bg-gray-300 dark:bg-gray-600',
                `rounded-${rounded}`,
                className
            )}
            style={{ width: width, height: height }}
        ></div>
    );
};

export default Avatar;
