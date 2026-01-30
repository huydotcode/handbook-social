import React from 'react';
interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MessageLayout: React.FC<Props> = ({ children }) => {
    return <>{children}</>;
};
export default MessageLayout;
