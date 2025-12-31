import ProfileService from '@/lib/services/profile.service';
import { cn } from '@/lib/utils';
import { IProfile } from '@/types/entites';
import React from 'react';
import { AboutSection, FriendsSection, PhotosSection } from '.';
import { UserService } from '@/features/user';

interface Props {
    className?: string;
    profile: IProfile;
}

const InfomationSection: React.FC<Props> = async ({ className, profile }) => {
    const [friends, photos] = await Promise.all([
        UserService.getFriendsByUserId({
            userId: profile.user._id,
        }),
        ProfileService.getProfilePicturesAction(profile.user._id),
    ]);

    return (
        <div
            className={cn(
                'w-[36%] grid-flow-row grid-cols-1 md:grid md:w-full',
                className
            )}
        >
            <AboutSection profile={profile} />
            <PhotosSection photos={photos} />
            <FriendsSection friends={friends} />
        </div>
    );
};
export default InfomationSection;
