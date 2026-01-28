import { cn } from '@/lib/utils';
import { Button } from '../../ui/Button';

interface SidebarSubtitleProps {
    className?: string;
    title: string;
}

const SidebarSubtitle = ({ className = '', title }: SidebarSubtitleProps) => {
    return (
        <h2 className={cn('mt-2 text-lg font-semibold', className)}>{title}</h2>
    );
};

export default SidebarSubtitle;
