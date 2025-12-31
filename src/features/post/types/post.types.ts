export interface IPostFormData {
    option: 'public' | 'friend' | 'private';
    content: string;
    files: File[];
    tags: string[];
}
