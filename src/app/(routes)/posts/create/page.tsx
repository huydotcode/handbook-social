'use client';
import { FriendSection, Sidebar } from '@/shared/components/layout';
import { CreatePost } from '@/features/post';

const CreatePostPage = () => {
    return (
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <CreatePost
                className="w-[650px] 2xl:w-[550px] md:w-full"
                variant="modal"
            />

            <FriendSection />
        </div>
    );
};

export default CreatePostPage;
