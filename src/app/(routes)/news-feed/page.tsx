'use client';
import React from 'react';
import { InfinityPostComponent } from '@/features/post';
import { useSearchParams } from 'next/navigation';
import PageTitle from '@/shared/components/layout/PageTitle';

const FeedsPage = () => {
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || '';
    const type =
        filter === 'friend'
            ? 'new-feed-friend'
            : filter === 'group'
              ? 'new-feed-group'
              : 'new-feed';

    function getTitle() {
        if (filter === 'friend') {
            return 'Bạn bè';
        } else if (filter === 'group') {
            return 'Nhóm';
        }
        return 'Khám phá';
    }

    return (
        <div className="content-width mx-auto">
            <PageTitle title={getTitle()} />
            <InfinityPostComponent showCreatePost={false} type={type} />
        </div>
    );
};

export default FeedsPage;
