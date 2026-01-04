export interface CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
}

export interface CategoryQueryParams {
    page?: number;
    page_size?: number;
}

export interface CategorySearchParams {
    q: string;
    page?: number;
    page_size?: number;
}
