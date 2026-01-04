import { env } from './env.config';

export const socketConfig = {
    url: env.NEXT_PUBLIC_REALTIME_SERVER_API || 'http://localhost:5000',
};
