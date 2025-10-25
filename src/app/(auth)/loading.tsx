import AuthContainer from './auth/_components/AuthContainer';

const Loading = () => {
    return (
        <AuthContainer>
            {/* Header Skeleton */}
            <div className="mb-8 border-b-2 text-center">
                <div className="mx-auto mb-2 h-7 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <div className="space-y-4">
                {/* Form Skeleton */}
                <div className="space-y-4">
                    {/* Field 1 */}
                    <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    {/* Field 2 */}
                    <div className="space-y-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex justify-end">
                            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                </div>

                {/* Divider Skeleton */}
                <div className="my-8 flex items-center">
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                    <span className="px-4 text-sm font-medium text-transparent">
                        hoặc
                    </span>
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                </div>

                {/* Social Button Skeleton */}
                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>

                {/* Redirect Link Skeleton */}
                <div className="mt-8 flex justify-center">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
            </div>
        </AuthContainer>
    );
};

export default Loading;
