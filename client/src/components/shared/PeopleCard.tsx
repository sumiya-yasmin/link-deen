import { useGetProfileById } from '@/hooks/useProfileApi';
import { User } from '@/types';
import { Link } from 'react-router-dom';

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
}: {
  users: User[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-muted shadow animate-pulse mt-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  if (!users?.length) return <p>No users found.</p>;
  return (
    <div>
      {users.map((user: User) => (
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
      ))}
    </div>
  );
}

export default PeopleCard;
