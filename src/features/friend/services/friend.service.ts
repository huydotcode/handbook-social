import { IFriend } from '@/types/entites';
import { friendApi } from '../apis/friend.api';
import { FriendsWithConversationsResponse } from '../types/friend.types';

// Helper to normalize friendship record to IFriend
const mapFriendshipToFriend = (
    record: any,
    currentUserId: string
): IFriend | null => {
    if (!record) return null;
    const friend =
        record.user1?._id === currentUserId ? record.user2 : record.user1;
    if (!friend) return null;

    return {
        _id: friend._id,
        name: friend.name,
        username: friend.username,
        avatar: friend.avatar,
        isOnline: !!friend.isOnline,
        lastAccessed: friend.lastAccessed,
    };
};

class FriendServiceClass {
    /**
     * Get friends of a user
     */
    async getFriends(userId: string): Promise<IFriend[]> {
        try {
            const res = await friendApi.getFriends(userId);
            return (res || [])
                .map((f) => mapFriendshipToFriend(f, userId))
                .filter((f): f is IFriend => !!f);
        } catch (error) {
            console.error('Error getting friends:', error);
            throw error;
        }
    }

    /**
     * Get friends count
     */
    async getFriendsCount(userId: string): Promise<number> {
        try {
            const res = await friendApi.getFriendsCount(userId);
            return res?.count ?? 0;
        } catch (error) {
            console.error('Error getting friends count:', error);
            throw error;
        }
    }

    /**
     * Check if friendship exists
     */
    async checkFriendship(userId: string): Promise<boolean> {
        try {
            const res = await friendApi.checkFriendship(userId);
            return !!res?.areFriends;
        } catch (error) {
            console.error('Error checking friendship:', error);
            return false;
        }
    }

    /**
     * Get common friends
     */
    async getCommonFriends(
        userId1: string,
        userId2: string
    ): Promise<string[]> {
        try {
            const res = await friendApi.getCommonFriends(userId1, userId2);
            return res?.commonFriends ?? [];
        } catch (error) {
            console.error('Error getting common friends:', error);
            return [];
        }
    }

    /**
     * Add friend
     */
    async addFriend(userId2: string): Promise<any> {
        return await friendApi.addFriend(userId2);
    }

    /**
     * Remove friend
     */
    async removeFriend(userId: string): Promise<boolean> {
        try {
            const result = await friendApi.removeFriend(userId);
            return result.success;
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    }

    /**
     * Get friends with conversations
     */
    async getFriendsWithConversations(
        userId: string
    ): Promise<FriendsWithConversationsResponse> {
        return await friendApi.getFriendsWithConversations(userId);
    }
}

export const FriendService = new FriendServiceClass();
