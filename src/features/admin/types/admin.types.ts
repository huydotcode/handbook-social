export interface AdminQueryParams {
    page?: number;
    page_size?: number;
    limit?: number;
    q?: string;
    role?: string;
    isBlocked?: boolean;
    isVerified?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
