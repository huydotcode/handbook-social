import { useAuth } from '@/core/context';
import Image from 'next/image';
import Link from 'next/link';

const SidebarUser = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Link
            href={`/profile/${user?.id}`}
            className="flex items-center rounded-xl p-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1"
        >
            <Image
                className="rounded-full"
                width={32}
                height={32}
                src={user?.avatar || ''}
                alt={user?.name || ''}
            />

            <span className="ml-2 text-sm dark:text-dark-primary-1">
                {user?.name}
            </span>
        </Link>
    );
};

export default SidebarUser;
