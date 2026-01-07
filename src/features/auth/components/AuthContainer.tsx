import React from 'react';

interface AuthContainerProps {
    children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
    return (
        <div className="relative mx-auto w-full max-w-md rounded-xl border-2 border-primary-1 shadow-xl dark:border-none dark:bg-dark-secondary-1 dark:shadow-none">
            <div className="relative z-10 px-8 py-4 md:px-6 md:py-4">
                {children}
            </div>
        </div>
    );
};

export default AuthContainer;
