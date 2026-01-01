import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../../lib/axios';
import { PaginationResult } from '@/types';

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

/**
 * API Client Class
 * Handles all HTTP requests to the server API
 */
class ApiClient {
    // Reuse shared axios instance with interceptors (token + refresh)
    private client = axiosInstance;

    /**
     * GET request
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data.data as T;
    }

    /**
     * GET request with pagination
     */
    async getPaginated<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<PaginationResult<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return {
            data: response.data.data as T[],
            pagination: {
                hasNext: response.data.meta?.hasNext || false,
                hasPrev: response.data.meta?.hasPrev || false,
                page: response.data.meta?.page || 1,
                pageSize: response.data.meta?.pageSize || 0,
                total: response.data.meta?.total || 0,
                totalPages: response.data.meta?.totalPages || 0,
            },
        };
    }

    /**
     * POST request
     */
    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(
            url,
            data,
            config
        );
        return response.data.data as T;
    }

    /**
     * PUT request
     */
    async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(
            url,
            data,
            config
        );
        return response.data.data as T;
    }

    /**
     * PATCH request
     */
    async patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.patch<ApiResponse<T>>(
            url,
            data,
            config
        );
        return response.data.data as T;
    }

    /**
     * DELETE request
     */
    async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return response.data.data as T;
    }

    /**
     * File upload with progress tracking
     */
    async uploadFile<T = any>(
        url: string,
        file: File,
        fieldName: string = 'file',
        onProgress?: (progress: number) => void
    ): Promise<T> {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(progress);
                }
            },
        });

        return response.data.data as T;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
