/**
 * Error handling utilities for API hooks
 */
import toast from 'react-hot-toast';

export interface ApiError {
    message?: string;
    error?: string;
}

/**
 * Extracts error message from various error types
 */
export const getErrorMessage = (
    error: unknown,
    defaultMessage: string
): string => {
    if (error instanceof Error) {
        return error.message || defaultMessage;
    }

    if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        if (apiError.message) return apiError.message;
        if (apiError.error) return apiError.error;
    }

    if (typeof error === 'string') {
        return error;
    }

    return defaultMessage;
};

/**
 * Handles API errors with toast notification
 */
export const handleApiError = (
    error: unknown,
    defaultMessage: string
): void => {
    const message = getErrorMessage(error, defaultMessage);
    toast.error(message);
};

/**
 * Shows success toast notification
 */
export const showSuccessToast = (message: string): void => {
    toast.success(message);
};
