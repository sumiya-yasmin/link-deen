import { useGetProfileById } from '@/hooks/useProfileApi';
import { User } from '@/types';
import { Link } from 'react-router-dom';
import { LoadingSkeleton, LoadMoreButton } from './LoadMoreButton';

const UserCard = ({ userId }: { userId: string }) => {
  const { data: user, isPending: isLoading } = useGetProfileById(userId);
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-muted shadow animate-pulse mt-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Link to={`/profile/${user?._id}`}>
      <div className="px-6 py-8 rounded-lg bg-zinc-800 shadow flex gap-4 justify-center items-center w-full max-w-sm hover:bg-zinc-700 transition">
        <img
          src={user.imageUrl}
          className="rounded-full w-16 h-16 object-cover flex-shrink-0"
        />
        <div>
          <p className="font-semibold text-white w-fit">{user.name}</p>
          <p className="text-sm text-zinc-400">@{user.username}</p>
        </div>
      </div>
    </Link>
  );
};

export const UserIdList = ({
  userIds,
  isLoading,
}: {
  userIds: string[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-muted shadow animate-pulse mt-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  return (
    <div className="space-y-2 flex gap-4">
      {userIds.map((userId: string) => (
        <UserCard key={userId} userId={userId} />
      ))}
    </div>
  );
};

export function PeopleCard({
  users,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: {
  users: User[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (!users?.length) return <p>No users found.</p>;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 ">
        {users.map((user: User) => (
          <Link to={`/profile/${user?._id}`} key={user._id}>
            <div className="px-6 py-8 rounded-lg bg-zinc-800 shadow flex gap-4 justify-center items-center w-full max-w-sm hover:bg-zinc-700 transition">
              <img
                src={user.imageUrl || '/assets/profile-placeholder.png'}
                className="rounded-full w-16 h-16 object-cover flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-white w-fit">{user.name}</p>
                <p className="text-sm text-zinc-400">@{user.username}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}
      {hasNextPage && fetchNextPage && (
        <div className="mt-6">
          <LoadMoreButton
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage || false}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default PeopleCard;
