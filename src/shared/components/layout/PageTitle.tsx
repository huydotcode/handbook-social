import React from 'react';

interface PageTitleProps {
    title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
    return <h1 className="px-2 text-2xl font-bold">{title}</h1>;
};

export default PageTitle;
