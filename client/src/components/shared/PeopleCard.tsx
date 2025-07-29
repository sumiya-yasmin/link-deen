import { useGetProfileById } from "@/hooks/useProfileApi";
import { User } from "@/types"

const UserCard = ({userId}: {userId: string}) => {
const { data: user, isPending: isLoading } = useGetProfileById(userId);
 if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-muted shadow animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!user) return null;

   return (
    <div className="p-6 rounded-lg bg-muted shadow flex gap-4 justify-center items-center">
      <img src={user.imageUrl} className="rounded-full w-16 h-16 object-cover flex-shrink-0" />
      <div>
      <p className="font-semibold">{user.name}</p>
      <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  );
}

export const UserIdList = ({userIds, isLoading}: {userIds: string [], isLoading: boolean}) => {
  return(
       <div className="space-y-2 flex">
        {
    userIds.map((userId: string)=> (
      <UserCard key={userId} userId={userId} />
    ))
        }
       </div>
  )
}


export function PeopleCard({users, isLoading}: {users: User[], isLoading: boolean}) {
      if (isLoading) return <p>Loading...</p>;
  if (!users?.length) return <p>No users found.</p>;
  return (
    <div>
        {users.map((user : User) => (
            <div key={user._id} className="p-4 rounded-lg bg-muted shadow">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        ))}
    </div>
  )
}

export default PeopleCard