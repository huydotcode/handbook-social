/**
 * API Hooks - Centralized exports
 * All React Query hooks for API services are exported from here
 */

// User hooks
// export { useUsers, useUser, useUserFriends } from './useUser';

// Post hooks
export {
    usePost,
    usePosts,
    useNewFeedPosts,
    useNewFeedGroupPosts,
    useNewFeedFriendPosts,
    useSavedPosts,
    useProfilePosts,
    useGroupPosts,
    useManageGroupPosts,
    useManageGroupPostsPending,
    usePostByMember,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
} from './usePost';

// Message hooks
export {
    useMessages,
    usePinnedMessages,
    useSearchMessages,
} from './useMessage';

// Conversation hooks
export {
    useConversations,
    useConversation,
    useCreateConversation,
    useUpdateConversation,
    useDeleteConversation,
    useAddParticipant,
    useRemoveParticipant,
    usePinMessage,
    useUnpinMessage,
    useGroupConversations,
} from './useConversation';

// Group hooks
export {
    useJoinedGroups,
    useGroup,
    useCheckGroupAccess,
    useCheckGroupAdmin,
    useGroupMembers,
    useGroupMember,
    useAddGroupMember,
    useRemoveGroupMember,
} from '../../../features/group/hooks/group.hook';

// Item hooks
export { useItems, useSearchItems, useItemsBySeller } from './useItem';

// Notification hooks
export {
    useNotificationsByReceiver,
    useRequestsBySender,
} from './useNotification';

// Search hooks
export {
    useSearch,
    useSearchUsers,
    useSearchPosts,
    useSearchGroups,
} from './useSearch';

// Location hooks
export { useLocations } from './useLocation';

// Follow hooks
export { useFollowings } from './useFollow';

// Upload hooks
export { useUploadImage, useUploadVideo } from './useUpload';
