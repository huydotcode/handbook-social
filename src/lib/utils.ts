import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isValidObjectId = (value: string): boolean => {
    if (!value) return false;
    return /^[a-f\d]{24}$/i.test(value);
};
