/**
 * API Hooks - Centralized exports
 * All React Query hooks for API services are exported from here
 */

// User hooks
// export { useUsers, useUser, useUserFriends } from './useUser';

// Post hooks
export {
    useCreatePost,
    useDeletePost,
    useGroupPosts,
    useManageGroupPosts,
    useManageGroupPostsPending,
    useNewFeedFriendPosts,
    useNewFeedGroupPosts,
    useNewFeedPosts,
    usePost,
    usePostByMember,
    usePosts,
    useProfilePosts,
    useSavedPosts,
    useUpdatePost,
} from './usePost';

// Group hooks
export {
    useAddGroupMember,
    useCheckGroupAccess,
    useCheckGroupAdmin,
    useGroup,
    useGroupMember,
    useGroupMembers,
    useJoinedGroups,
    useRemoveGroupMember,
} from '../../../features/group/hooks/group.hook';

// Notification hooks
export {
    useNotificationsByReceiver,
    useRequestsBySender,
} from './useNotification';

// Search hooks
export {
    useSearch,
    useSearchGroups,
    useSearchPosts,
    useSearchUsers,
} from './useSearch';

// Location hooks
export { useLocations } from './useLocation';

// Follow hooks

// Upload hooks
export { useUploadImage, useUploadVideo } from './useUpload';
