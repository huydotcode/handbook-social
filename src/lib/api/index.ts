/**
 * API Layer - Centralized exports
 * All API services and utilities are exported from here
 */

// API Client
// export { apiClient, default as ApiClient } from '../../core/api/client';
// export type { ApiResponse, ErrorResponse } from '../../core/api/client';

// API Endpoints
// export { API_ENDPOINTS } from '../../core/api/endpoints';

// API Services
// export { authApi } from '../../features/auth/apis/auth.api';
// export { userService } from './services/user.service';
export { adminService } from './services/admin.service';
// export { friendshipService } from './services/friendship.service';
export { locationService } from './services/location.service';
// export { notificationService } from './services/notification.service';
export { postService } from './services/post.service';
export { searchService } from './services/search.service';
// export { uploadService } from './services/upload.service';

// Export types
// export type {
//     LoginDto,
//     SendOTPDto,
//     VerifyOTPDto,
//     ResetPasswordDto,
// } from '../../features/auth/apis/auth.api';
export type {
    CreatePostDto,
    PostQueryParams,
    UpdatePostDto,
} from './services/post.service';
