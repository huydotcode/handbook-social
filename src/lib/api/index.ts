/**
 * API Layer - Centralized exports
 * All API services and utilities are exported from here
 */

// API Client
export { apiClient, default as ApiClient } from './client';
export type { ApiResponse, ErrorResponse } from './client';

// API Endpoints
export { API_ENDPOINTS } from './endpoints';

// API Services
// export { authApi } from '../../features/auth/apis/auth.api';
export { userService } from './services/user.service';
export { postService } from './services/post.service';
export { commentService } from './services/comment.service';
export { messageService } from './services/message.service';
export { conversationService } from './services/conversation.service';
export { groupService } from './services/group.service';
export { itemService } from './services/item.service';
export { notificationService } from './services/notification.service';
export { searchService } from './services/search.service';
export { uploadService } from './services/upload.service';
export { locationService } from './services/location.service';
export { followService } from './services/follow.service';
export { categoryService } from './services/category.service';
export { adminService } from './services/admin.service';
export { friendshipService } from './services/friendship.service';

// Export types
// export type {
//     LoginDto,
//     SendOTPDto,
//     VerifyOTPDto,
//     ResetPasswordDto,
// } from '../../features/auth/apis/auth.api';
export type {
    CreatePostDto,
    UpdatePostDto,
    PostQueryParams,
} from './services/post.service';
export type {
    CreateCommentDto,
    UpdateCommentDto,
    CommentQueryParams,
} from './services/comment.service';
export type {
    CreateConversationDto,
    UpdateConversationDto,
    ConversationQueryParams,
} from './services/conversation.service';
export type {
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryQueryParams,
} from './services/category.service';
