'use client';
import AddFriendAction from '@/app/(routes)/profile/_components/AddFriendAction';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { IUser } from '@/types/entites';

const SearchUserItem = ({
    data,
    isFriend,
}: {
    data: IUser;
    isFriend: boolean;
}) => {
    return (
        <div className="flex items-center rounded-xl bg-secondary-1 px-4 py-2 shadow-sm">
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar}
                width={32}
                height={32}
            />

            <div className="flex flex-1 items-center justify-between">
                <div className="ml-2 flex flex-col gap-2">
                    <Button variant="text" href={`/profile/${data._id}`}>
                        {data.name}
                    </Button>
                </div>

                <div>
                    {!isFriend && (
                        <AddFriendAction
                            className="px-4 text-sm"
                            userId={data._id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUserItem;
