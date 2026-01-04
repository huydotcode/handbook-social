import React from 'react';

const OrDivider = () => {
    return (
        <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            <span className="px-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                hoặc
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
        </div>
    );
};

export default OrDivider;
