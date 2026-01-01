export type PaginationResult<T> = {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};

/**
 * Standardized API Response Interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        pageSize?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    timestamp: string;
    path?: string;
}

/**
 * Error Response Interface
 */
export interface ErrorResponse {
    success: false;
    error: string;
    message: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    path?: string;
}
