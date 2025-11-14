import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8080/api/v1';

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
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Log request in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `🚀 ${config.method?.toUpperCase()} ${config.url}`,
                        config.data ? { data: config.data } : ''
                    );
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                // Log response in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
                        response.data
                    );
                }

                return response;
            },
            (error: AxiosError<ErrorResponse>) => {
                // Handle errors
                const status = error.response?.status;
                if (status === 401) {
                    this.handleUnauthorized();
                } else if (status === 403) {
                    this.handleForbidden();
                } else if (status && status >= 500) {
                    this.handleServerError(error);
                }

                // Log error in development
                if (process.env.NODE_ENV === 'development') {
                    console.error(
                        `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                        error.response?.data || error.message
                    );
                }

                return Promise.reject(this.transformError(error));
            }
        );
    }

    /**
     * Get authentication token from localStorage
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    /**
     * Handle unauthorized error (401)
     */
    private handleUnauthorized(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Redirect to login page
            window.location.href = '/auth/login';
        }
    }

    /**
     * Handle forbidden error (403)
     */
    private handleForbidden(): void {
        console.warn('Access forbidden');
    }

    /**
     * Handle server error (500+)
     */
    private handleServerError(error: AxiosError): void {
        console.error('Server error:', error);
    }

    /**
     * Transform axios error to our error format
     */
    private transformError(error: AxiosError<ErrorResponse>): ErrorResponse {
        return {
            success: false,
            error:
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'An error occurred',
            message:
                error.response?.data?.message ||
                error.message ||
                'An error occurred',
            statusCode: error.response?.status || 500,
            details: error.response?.data?.details,
            timestamp:
                error.response?.data?.timestamp || new Date().toISOString(),
            path: error.response?.data?.path || error.config?.url,
        };
    }

    /**
     * GET request
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data.data as T;
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
