export interface GroupQueryParams {
    user_id?: string;
    page?: number;
    page_size?: number;
}

export interface CreateGroupDto {
    name: string;
    description?: string;
    privacy: 'public' | 'private';
    cover?: string;
    avatar?: string;
}

export interface UpdateGroupDto {
    name?: string;
    description?: string;
    privacy?: 'public' | 'private';
    cover?: string;
    avatar?: string;
}

export type CreateGroupPayload = {
    name: string;
    description: string;
    avatar: string; // media id
    type: string;
    members?: Array<
        | string
        | {
              user?: string;
              userId?: string;
              role?: 'ADMIN' | 'MEMBER';
          }
    >;
};
