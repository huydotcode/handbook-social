import { categoryAdminApi } from './admin-category.api';
import { groupAdminApi } from './admin-group.api';
import { locationAdminApi } from './admin-location.api';
import { mediaAdminApi } from './admin-media.api';
import { postAdminApi } from './admin-post.api';
import { userAdminApi } from './admin-user.api';

export * from './admin-category.api';
export * from './admin-group.api';
export * from './admin-location.api';
export * from './admin-media.api';
export * from './admin-post.api';
export * from './admin-user.api';

export const adminApi = {
    ...userAdminApi,
    ...postAdminApi,
    ...groupAdminApi,
    ...locationAdminApi,
    ...categoryAdminApi,
    ...mediaAdminApi,
};
