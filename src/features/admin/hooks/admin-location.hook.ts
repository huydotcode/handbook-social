import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminLocationService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminLocations = (params?: AdminQueryParams) => {
    return useQuery({
        // TODO: Update queryKey to have admin.locations
        queryKey: queryKey.locations.list(),
        queryFn: () => AdminLocationService.getLocations(params),
        ...defaultQueryOptions,
    });
};

export const useAdminCreateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            name: string;
            slug: string;
            type: string;
            nameWithType: string;
            code: string;
        }) => AdminLocationService.createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.locations.list(),
            });
        },
    });
};
