import { defaultQueryOptions } from '@/lib/react-query';
import queryKey from '@/lib/react-query/query-key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminMediaService } from '../services';
import { AdminQueryParams } from '../types/admin.types';

export const useAdminMedias = (params?: AdminQueryParams) => {
    return useQuery({
        queryKey: queryKey.admin.media.index,
        queryFn: () => AdminMediaService.getMedias(params),
        ...defaultQueryOptions,
    });
};

export const useAdminDeleteMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (mediaId: string) => AdminMediaService.deleteMedia(mediaId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey.admin.media.index,
            });
        },
    });
};
