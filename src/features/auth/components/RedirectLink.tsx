import { Button } from '@/shared/components/ui/Button';
import React from 'react';

interface RedirectLinkProps {
    text: string;
    linkText: string;
    href: string;
}

const RedirectLink: React.FC<RedirectLinkProps> = ({
    text,
    linkText,
    href,
}) => {
    return (
        <div className="mt-8 text-center">
            <span className="text-slate-600 dark:text-slate-400">{text} </span>
            <Button
                href={href}
                className="text-sm font-bold text-primary-2"
                variant={'text'}
                size={'md'}
            >
                {linkText}
            </Button>
        </div>
    );
};

export default RedirectLink;
