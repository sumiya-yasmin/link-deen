// import { useGetProfileById } from '@/hooks/useProfileApi';
import { User } from '@/types';
import { Link } from 'react-router-dom';
import { LoadingSkeleton, LoadMoreButton } from './LoadMoreButton';

// const UserCard = ({ userId }: { userId: string }) => {
//   const { data: user, isPending: isLoading } = useGetProfileById(userId);
//   if (isLoading) {
//     return (
//       <div className="p-4 rounded-lg bg-muted shadow animate-pulse mt-2">
//         <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <Link to={`/profile/${user?._id}`}>
//       <div className="px-6 py-8 rounded-lg bg-zinc-800 shadow flex gap-4 justify-center items-center w-full max-w-sm hover:bg-zinc-700 transition">
//         <img
//           src={user.imageUrl}
//           className="rounded-full w-16 h-16 object-cover flex-shrink-0"
//         />
//         <div>
//           <p className="font-semibold text-white w-fit">{user.name}</p>
//           <p className="text-sm text-zinc-400">@{user.username}</p>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export const UserIdList = ({
//   userIds,
//   isLoading,
// }: {
//   userIds: string[];
//   isLoading: boolean;
// }) => {
//   if (isLoading) {
//     return (
//       <div className="p-4 rounded-lg bg-muted shadow animate-pulse mt-2">
//         <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//       </div>
//     );
//   }
//   return (
//     <div className="space-y-2 flex gap-4">
//       {userIds.map((userId: string) => (
//         <UserCard key={userId} userId={userId} />
//       ))}
//     </div>
//   );
// };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {users.map((user: User) => (
          user && (
          <Link to={`/profile/${user?._id}`} key={user._id}>
            <div className="group relative bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 transition-all duration-300 hover:bg-zinc-700/50 hover:border-zinc-600/50 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={user?.imageUrl || '/assets/profile-placeholder.png'}
                className="rounded-full w-16 h-16 object-cover flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-white w-fit">{user.name}</p>
                <p className="text-sm text-zinc-400">@{user.username}</p>
              </div>
            </div>
          </Link>
          )
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
