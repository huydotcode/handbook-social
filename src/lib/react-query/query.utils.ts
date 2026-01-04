/**
 * Pagination utilities for React Query infinite queries
 */

/**
 * Creates a getNextPageParam function for infinite queries using heuristic approach
 * Assumes there are more pages if the last page has items equal to pageSize
 *
 * @param pageSize - Number of items per page
 * @returns Function to determine next page parameter
 */
export const createGetNextPageParam = (pageSize: number) => {
    return <T = unknown>(
        lastPage: T[],
        allPages: T[][]
    ): number | undefined => {
        if (Array.isArray(lastPage) && lastPage.length === pageSize) {
            return allPages.length + 1;
        }
        return undefined;
    };
};

/**
 * Creates a getNextPageParam function for search results
 * Handles SearchResult object with users, posts, or groups arrays
 *
 * @param pageSize - Number of items per page
 * @returns Function to determine next page parameter
 */
export const createSearchGetNextPageParam = (pageSize: number) => {
    return (lastPage: any, allPages: any[]): number | undefined => {
        const hasResults =
            (lastPage?.users && lastPage.users.length === pageSize) ||
            (lastPage?.posts && lastPage.posts.length === pageSize) ||
            (lastPage?.groups && lastPage.groups.length === pageSize);

        if (hasResults) {
            return allPages.length + 1;
        }
        return undefined;
    };
};
