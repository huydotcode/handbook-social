import { Button } from '@/shared/components/ui/Button';
import React from 'react';

interface RedirectLinkProps {
    text: string;
    linkText: string;
    href: string;
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ text, linkText, href }) => {
    return (
        <div className="mt-8 text-center">
            <span className="text-sm">{text} </span>
            <Button href={href} className="px-1 text-sm font-bold text-primary-2" variant={'text'} size={'md'}>
                {linkText}
            </Button>
        </div>
    );
};

export default RedirectLink;
