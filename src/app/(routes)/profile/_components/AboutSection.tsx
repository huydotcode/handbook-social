'use client';
import { Icons } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/core/context';
import { cn } from '@/lib/utils';
import { IProfile } from '@/types/entites';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import ModalEditBio from './ModalEditBio';
import ModalEditInfo from './ModalEditInfo';

interface Props {
    profile: IProfile;
}

const AboutSection: React.FC<Props> = ({ profile }) => {
    const bio = profile.bio;
    const path = usePathname();

    const isAboutPage = path.includes('about');

    const [showModal, setShowModal] = useState({
        bio: false,
        info: false,
    });

    const { user } = useAuth();
    const canEdit = user?.id === profile.user._id;

    const renderInfo = (info: Date | string): string => {
        if (!isNaN(Date.parse(info.toString()))) {
            const date = new Date(info);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } else if (typeof info === 'string') {
            return info.trim().length === 0 ? 'Trống' : info;
        }
        return '';
    };

    const toggleModal = (type: keyof typeof showModal) => {
        setShowModal((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <section
            className={cn(
                'relative rounded-xl bg-secondary-1 px-4 py-2 shadow-md dark:bg-dark-secondary-1',
                isAboutPage && 'flex md:flex-col'
            )}
        >
            <article
                className={cn(
                    isAboutPage &&
                        'w-[30%] border-r pr-4 md:w-full md:border-r-0 md:pr-0'
                )}
            >
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-bold">Giới thiệu</h5>
                    {canEdit && bio.length > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleModal('bio')}
                        >
                            <Icons.Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="text-sm">{bio}</p>

                {canEdit && bio.length === 0 && (
                    <Button
                        className="mt-2"
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleModal('bio')}
                    >
                        Thêm tiểu sử
                    </Button>
                )}

                <ModalEditBio
                    show={showModal.bio}
                    bio={bio}
                    handleClose={() => toggleModal('bio')}
                />
            </article>

            {isAboutPage && (
                <article className="flex-1 p-2 md:p-0">
                    <div className="flex items-center justify-between">
                        <h5 className="text-xl font-bold">Thông tin</h5>
                        {canEdit && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleModal('info')}
                            >
                                <Icons.Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <ul>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Work className="mr-2" />
                            Làm việc tại {profile.work || 'Trống'}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.School className="mr-2" />
                            Học tại {profile.education || 'Trống'}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Location className="mr-2" />
                            Sống tại {profile.location || 'Trống'}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Birthday className="mr-2" />
                            Sinh nhật ngày:{' '}
                            {renderInfo(
                                (profile.dateOfBirth as Date) || 'Trống'
                            )}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Location className="mr-2" />
                            Tham gia vào{' '}
                            {renderInfo(profile.createdAt || 'Trống')}
                        </li>

                        <ModalEditInfo
                            profile={profile}
                            show={showModal.info}
                            handleClose={() => toggleModal('info')}
                        />
                    </ul>
                </article>
            )}
        </section>
    );
};

export default AboutSection;
