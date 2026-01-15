'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

interface Props {
    className?: string;
    fullScreen?: boolean;
    title?: string;
    overlay?: boolean;
    text?: string;
    showLogo?: boolean;
    showLoader?: boolean;
}

const Loading: FC<Props> = ({
    fullScreen,
    className,
    title,
    overlay = true,
    text: initText,
    showLogo = true,
    showLoader = false,
}) => {
    const [text, setText] = useState<string>(initText || '');

    useEffect(() => {
        if (initText) {
            setText(initText);
            const interval = setInterval(() => {
                setText((prev) => {
                    if (prev.length === initText.length + 3) return initText;
                    return prev + '.';
                });
            }, 500);

            return () => {
                clearInterval(interval);
            };
        }
    }, [initText]);

    // Text Loading
    if (initText && initText.length > 0) {
        return (
            <div
                className={cn(
                    'flex justify-center text-sm text-secondary-1',
                    className
                )}
            >
                {text}
            </div>
        );
    }

    // Full screen loading
    return (
        <div
            className={cn(
                'loader-container flex flex-col items-center justify-center gap-10 overflow-hidden',
                fullScreen && 'fixed left-0 top-0 z-50 h-screen w-screen',
                title && 'flex-col',
                overlay && 'bg-black bg-opacity-10',
                className
            )}
        >
            {showLogo && (
                <div className="relative h-20 w-20">
                    <Image
                        src={'/assets/img/logo.png'}
                        alt="logo"
                        fill
                        quality={100}
                    />
                </div>
            )}

            {showLoader && (
                <div className="loader">
                    <li className="ball"></li>
                    <li className="ball"></li>
                    <li className="ball"></li>
                </div>
            )}

            {title && <p className="mt-2 text-lg">{title}</p>}
        </div>
    );
};

export default Loading;
