import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useQuery } from '@tanstack/react-query';
import { AdminCategoryService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminCategories = (params?: AdminQueryParams) => {
    return useQuery({
        // TODO: Update queryKey if needed
        queryKey: queryKey.categories.list(),
        queryFn: () => AdminCategoryService.getCategories(params),
        ...defaultQueryOptions,
    });
};
