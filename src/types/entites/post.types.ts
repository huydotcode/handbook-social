import type { IUser } from './user.types';
import type { IMedia } from './media.types';
import type { IGroup } from './group.types';

export interface IPost {
    _id: string;
    option: string;
    text: string;
    media: IMedia[];
    author: IUser;

    group: IGroup | null;

    commentsCount: number;
    lovesCount: number;
    sharesCount: number;

    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    type: 'default' | 'group';
    status: 'active' | 'pending' | 'rejected';

    userHasLoved: boolean;
    userHasSaved: boolean;
}
