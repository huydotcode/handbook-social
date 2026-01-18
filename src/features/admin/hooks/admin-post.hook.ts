import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useQuery } from '@tanstack/react-query';
import { AdminPostService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminPosts = (params?: AdminQueryParams) => {
    return useQuery({
        queryKey: queryKey.admin.posts.index,
        queryFn: () => AdminPostService.getPosts(params),
        ...defaultQueryOptions,
    });
};
