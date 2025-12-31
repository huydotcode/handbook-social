import { IGroup, IPost, IUser } from '@/types/entites';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface SearchQueryParams {
    q: string;
    page?: number;
    page_size?: number;
}

export interface SearchResult {
    users?: IUser[];
    posts?: IPost[];
    groups?: IGroup[];
}

export const searchService = {
    /**
     * General search (users, posts, groups)
     */
    search: (params: SearchQueryParams) => {
        return apiClient.get<SearchResult>(API_ENDPOINTS.SEARCH.GENERAL, {
            params,
        });
    },

    /**
     * Search users
     */
    searchUsers: (params: SearchQueryParams) => {
        return apiClient.get<IUser[]>(API_ENDPOINTS.SEARCH.USERS, { params });
    },

    /**
     * Search posts
     */
    searchPosts: (params: SearchQueryParams) => {
        return apiClient.get<IPost[]>(API_ENDPOINTS.SEARCH.POSTS, { params });
    },

    /**
     * Search groups
     */
    searchGroups: (params: SearchQueryParams) => {
        return apiClient.get<IGroup[]>(API_ENDPOINTS.SEARCH.GROUPS, { params });
    },
};
