import { Button } from '../../ui/Button';

interface SidebarTitleProps {
    title: string;
    href: string;
}

const SidebarTitle = ({ title, href }: SidebarTitleProps) => {
    return (
        <Button
            className="justify-start p-0 text-2xl font-bold"
            variant={'custom'}
            href={href}
        >
            {title}
        </Button>
    );
};

export default SidebarTitle;
