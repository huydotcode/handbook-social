import type { IUser } from './user.types';
import type { IMedia } from './media.types';
import type { ILocation } from './location.types';
import type { ICategory } from './category.types';

export interface IItem {
    _id: string;
    name: string;
    seller: IUser;
    description: string;
    price: number;
    images: IMedia[];
    location: ILocation;
    category: ICategory;
    slug: string;
    status: string;
    attributes: {
        name: string;
        value: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
