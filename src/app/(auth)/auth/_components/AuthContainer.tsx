import React from 'react';

interface AuthContainerProps {
    children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
    return (
        <div className="relative mx-auto w-full max-w-md rounded-xl shadow-xl dark:bg-dark-secondary-1">
            <div className="relative z-10 px-8 py-4 md:px-6 md:py-4">
                {children}
            </div>
        </div>
    );
};

export default AuthContainer;
