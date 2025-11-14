/**
 * API Hooks - Centralized exports
 * All React Query hooks for API services are exported from here
 */

// Auth hooks
export {
    useLogin,
    useLogout,
    useSendOTP,
    useVerifyOTP,
    useResetPassword,
} from './useAuth';

// User hooks
export { useUsers, useUserFriends } from './useUser';

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

// Comment hooks
export {
    useComment,
    useCommentsByPost,
    useCommentCount,
    useReplyComments,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useAddCommentLove,
    useRemoveCommentLove,
} from './useComment';

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
} from './useConversation';

// Group hooks
export { useJoinedGroups, useGroup } from './useGroup';

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

// Category hooks
export {
    useCategories,
    useAllCategories,
    useSearchCategories,
    useCategoryBySlug,
    useCategory,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from './useCategory';

// Location hooks
export { useLocations } from './useLocation';

// Follow hooks
export { useFollowings } from './useFollow';

// Upload hooks
export { useUploadImage, useUploadVideo } from './useUpload';
