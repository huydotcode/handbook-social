import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';

export interface ApiError {
    message?: string;
    error?: string;
}

export const getErrorMessage = (
    error: unknown,
    defaultMessage: string
): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
    }

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

export const handleApiError = (
    error: unknown,
    defaultMessage: string
): void => {
    const message = getErrorMessage(error, defaultMessage);
    toast.error(message);
};

export const showSuccessToast = (message: string): void => {
    toast.success(message);
};
