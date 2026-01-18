'use client';

import { FormatDate } from '@/shared';
import Avatar from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { IUser } from '@/types/entites/user.types';
import { Calendar, Hash, Mail, User } from 'lucide-react';

interface UserDetailModalProps {
    user: IUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserDetailModal = ({
    user,
    open,
    onOpenChange,
}: UserDetailModalProps) => {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thông tin người dùng</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            width={80}
                            height={80}
                            imgSrc={user.avatar}
                            alt={user.name}
                            className="h-20 w-20"
                        />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">
                                {user.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                @{user.username}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge
                                variant={
                                    user.role === 'admin'
                                        ? 'destructive'
                                        : 'secondary'
                                }
                            >
                                {user.role}
                            </Badge>
                            {user.isVerified && (
                                <Badge
                                    variant="default"
                                    className="bg-blue-500"
                                >
                                    Verified
                                </Badge>
                            )}
                            {user.isBlocked && (
                                <Badge variant="destructive">Blocked</Badge>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="grid grid-cols-[25px_1fr] items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium leading-none text-muted-foreground">
                                    ID
                                </p>
                                <p className="text-sm">{user._id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[25px_1fr] items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium leading-none text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-sm">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[25px_1fr] items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium leading-none text-muted-foreground">
                                    Ngày tham gia
                                </p>
                                <p className="text-sm">
                                    {FormatDate.formatISODateToDateTime(
                                        user.createdAt
                                    )}
                                </p>
                            </div>
                        </div>

                        {user.lastAccessed && (
                            <div className="grid grid-cols-[25px_1fr] items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium leading-none text-muted-foreground">
                                        Truy cập gần nhất
                                    </p>
                                    <p className="text-sm">
                                        {FormatDate.formatISODateToDateTime(
                                            user.lastAccessed
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="rounded-md bg-secondary/50 p-2 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Followers
                                </p>
                                <p className="font-bold">
                                    {user.followersCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
