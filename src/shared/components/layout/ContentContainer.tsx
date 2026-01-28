import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const contentContainerVariants = cva('', {
    variants: {
        variant: {
            withSidebar:
                'ml-[--sidebar-width] px-4 xl:ml-[--sidebar-width-xl] xl:w-[calc(100vw-var(--sidebar-width-xl))] lg:ml-[--sidebar-width-xl] lg:w-[calc(100vw-var(--sidebar-width-lg))] md:ml-0 md:w-full md:px-2 w-[--content-container-width] xl:w-[--content-container-xl-width] lg:w-[--content-container-lg-width] md:w-[--content-container-md-width]',
            centered:
                'mx-auto w-[--content-width] xl:w-[--content-width-xl] lg:w-[--content-width-lg] md:w-[--content-width-md] lg:ml-',
        },
    },
    defaultVariants: {
        variant: 'withSidebar',
    },
});

interface ContentContainerProps extends VariantProps<
    typeof contentContainerVariants
> {
    children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
    children,
    variant,
}) => {
    return (
        <div
            className={cn(
                contentContainerVariants({
                    variant,
                })
            )}
        >
            {children}
        </div>
    );
};

export default ContentContainer;
