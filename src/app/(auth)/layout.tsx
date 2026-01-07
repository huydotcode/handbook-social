'use client';
import { DarkmodeButton, Loading } from '@/shared/components/ui';
import { useAuth } from '@/core/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import {
    FaComments,
    FaPenFancy,
    FaSearch,
    FaStore,
    FaUser,
    FaUsers,
} from 'react-icons/fa';

const features = [
    {
        icon: <FaPenFancy className="h-6 w-6" />,
        title: 'Đăng bài & Tương tác',
        description:
            'Chia sẻ cảm xúc, hình ảnh và nhận phản hồi từ cộng đồng một cách nhanh chóng.',
        image: '/assets/img/lading_page_img_1.png',
    },
    {
        icon: <FaComments className="h-6 w-6" />,
        title: 'Nhắn tin cá nhân & nhóm',
        description:
            'Giao tiếp trực tiếp với bạn bè hoặc tạo nhóm để thảo luận, trao đổi tiện lợi.',
    },
    {
        icon: <FaUser className="h-6 w-6" />,
        title: 'Trang cá nhân',
        description:
            'Xây dựng hồ sơ cá nhân độc đáo, chia sẻ sở thích và hoạt động của bạn.',
    },
    {
        icon: <FaUsers className="h-6 w-6" />,
        title: 'Trang nhóm cộng đồng',
        description:
            'Tham gia hoặc tạo nhóm theo sở thích để kết nối với những người cùng chí hướng.',
    },
    {
        icon: <FaStore className="h-6 w-6" />,
        title: 'Chợ mua sắm',
        description:
            'Mua bán đồ cũ, hàng handmade hoặc sản phẩm cá nhân ngay trong nền-tảng.',
    },
    {
        icon: <FaSearch className="h-6 w-6" />,
        title: 'Tìm kiếm người dùng',
        description:
            'Tìm kiếm bạn bè, nhóm hoặc bài viết nhanh chóng với hệ thống tìm kiếm thông minh.',
    },
];

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <Loading fullScreen />;
    }

    // Avoid flashing auth pages when redirecting
    if (isAuthenticated) {
        return <Loading fullScreen />;
    }

    return (
        <div className="relative min-h-screen bg-white dark:bg-dark-secondary-2">
            {/* Darkmode Button */}
            <div className="flex w-full justify-end p-4">
                <DarkmodeButton className="block" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-52px)] w-full max-w-7xl items-center justify-center p-4">
                {/* Desktop Layout: Features left, Login right */}
                <div className="grid h-full w-screen grid-cols-2 gap-2 lg:grid-cols-1">
                    {/* Features Section - Left side on desktop */}
                    <div className="flex flex-1 flex-col justify-center rounded-xl p-4 lg:w-full md:w-full md:max-w-screen">
                        <div className="relative mb-4">
                            <h1 className="animate-fade-in text-center text-3xl font-bold text-primary-2 dark:text-white">
                                Chào mừng đến với Handbook
                            </h1>
                            <p className="animate-fade-in-delay-2 mt-2 text-center text-base font-medium text-secondary-1 dark:text-slate-300">
                                Nền tảng mạng xã hội Việt Nam.
                            </p>
                        </div>

                        <LandingFeatures />
                    </div>

                    {/* Login Section - Right side on desktop */}
                    <div className="flex flex-1 flex-col items-center justify-center md:w-full">
                        <div className="animate-fade-in-delay-3 w-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandingFeatures = () => {
    return (
        <section className="group w-full max-w-full p-2 lg:hidden">
            <div className="relative h-full overflow-x-hidden">
                <div className="flex animate-marquee p-2 group-hover:[animation-play-state:paused]">
                    {[...features, ...features].map((feature, index) => (
                        <div
                            key={index}
                            className="mx-2 flex min-w-[300px] flex-col gap-3 rounded-xl p-3 shadow-lg dark:bg-dark-secondary-1"
                        >
                            <h3 className="text-center text-base font-bold text-slate-800 dark:text-white">
                                {feature.title}
                            </h3>

                            <p className="text-center text-base text-slate-800 dark:text-white">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AuthLayout;
