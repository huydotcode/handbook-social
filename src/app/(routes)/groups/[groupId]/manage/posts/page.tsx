'use client';
import { InfinityPostComponent } from '@/shared/components/post';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/components/ui/tabs';
import { use } from 'react';

interface Props {
    params: Promise<{ groupId: string }>;
}

const ManagePostPage: React.FC<Props> = ({ params }) => {
    const { groupId } = use(params);

    return (
        <>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="active" className={'w-[200px]'}>
                        Đã Duyệt
                    </TabsTrigger>
                    <TabsTrigger value="pending" className={'w-[200px]'}>
                        Chờ
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <InfinityPostComponent
                        groupId={groupId}
                        type={'manage-group-posts'}
                        title={'Quản lý bài viết đã duyệt'}
                    />
                </TabsContent>
                <TabsContent value="pending">
                    <InfinityPostComponent
                        groupId={groupId}
                        type={'manage-group-posts-pending'}
                        title={'Quản lý bài viết chờ duyệt'}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default ManagePostPage;
