import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from './Button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn(
            'mx-auto flex w-full justify-end bg-transparent',
            className
        )}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('flex flex-row items-center gap-1', className)}
        {...props}
    />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
    React.ComponentProps<'a'>;

const PaginationLink = ({
    className,
    isActive,
    size = 'icon',
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? 'page' : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? 'outline' : 'ghost',
                size,
            }),
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn('gap-1 pl-2.5', className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn('gap-1 pr-2.5', className)}
        {...props}
    >
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<'span'>) => (
    <span
        aria-hidden
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationWithLinks,
};

interface PaginationWithLinksProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationWithLinks = ({
    page,
    totalPages,
    onPageChange,
}: PaginationWithLinksProps) => {
    const renderPageNumbers = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            onClick={() => onPageChange(i)}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        isActive={page === 1}
                        onClick={() => onPageChange(1)}
                        className="cursor-pointer"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (page > 3) {
                items.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            onClick={() => onPageChange(i)}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (page < totalPages - 2) {
                items.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            isActive={page === totalPages}
                            onClick={() => onPageChange(totalPages)}
                            className="cursor-pointer"
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        className={
                            page === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            onPageChange(Math.min(totalPages, page + 1))
                        }
                        className={
                            page === totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
