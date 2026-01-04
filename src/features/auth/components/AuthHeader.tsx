import React from 'react';

interface AuthHeaderProps {
    title: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title }) => {
    return (
        <div className="mb-8 border-b-2 text-center">
            <h2 className="mb-2 text-3xl font-bold uppercase text-primary-2 dark:text-white">
                {title}
            </h2>
        </div>
    );
};

export default AuthHeader;
