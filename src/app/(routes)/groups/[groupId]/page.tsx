'use client';
import { InfinityPostComponent } from '@/features/post/components';
import GroupService from '@/features/group/services/group.service';
import React, { use, useEffect } from 'react';
import Infomation from '../_components/Infomation';
import Header from '../_components/Header';
import { useGroup } from '@/features/group';
import { Loading } from '@/shared/components/ui';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ groupId: string }>;
}

const GroupPage: React.FC<Props> = ({ params }) => {
    const { groupId } = use(params);
    const { data: group, isLoading } = useGroup(groupId);

    if (isLoading) {
        return <Loading fullScreen />;
    }

    if (!group) notFound();

    return (
        <>
            <div className="mt-2 flex justify-between lg:flex-col-reverse">
                <div className="mr-4 flex flex-1 lg:mt-4 md:mr-0 md:mt-2 md:w-full">
                    <InfinityPostComponent groupId={group._id} type="group" />
                </div>

                <Infomation group={group} />
            </div>
        </>
    );
};
export default GroupPage;
