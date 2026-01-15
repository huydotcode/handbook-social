import { InfinityPostComponent } from '@/features/post/components';
import ProfileService from '@/features/user/services/profile.service';
import { isValidObjectId } from '@/lib/utils';
import { FC } from 'react';
import { InfomationSection } from '../_components';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
    params: Promise<{ userId: string }>;
}

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
    const { userId } = await params;
    const profile = await ProfileService.getByUserId(userId);
    if (!profile) notFound();

    const props = isValidObjectId(userId)
        ? {
              userId: userId,
          }
        : { username: userId };

    return (
        <div className="flex justify-between md:flex-col">
            <InfomationSection profile={profile} />

            <div className="w-[60%] md:w-full">
                <InfinityPostComponent {...props} type="profile" />
            </div>
        </div>
    );
};

export default ProfilePage;
