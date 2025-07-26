import { useGetProfileById } from '@/hooks/useProfileApi';
import { Heart, User, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserListItemProps = {
  userId: string;
  currentUserId: string | null;
  onUserClick: (userId: string) => void;
};

type FollowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  followers: string[];
  following: string[];
  profileName?: string;
  currentUserId: string | null;
  initialTab?: 'followers' | 'following';
};



const UserListItem = ({userId , currentUserId, onUserClick} : UserListItemProps)=>{
  const {data: user, isPending: isLoading} = useGetProfileById(userId);
   if (isLoading) {
    return (
      <div className="flex items-center p-3 animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
    if (!user){
      return
  }
  const isCurrentUser = userId === currentUserId;
  const isFollowing = currentUserId && user.stats.followers?.includes(currentUserId)
  return (
    <div 
      className="flex items-center p-3 bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer transition-colors duration-200 rounded-lg"
      onClick={() => onUserClick(user._id)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {user.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <User className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-200 truncate">{user.name}</h4>
          {isCurrentUser && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">@{user.username}</p>
        {/* {user.bio && (
          <p className="text-xs text-gray-500 truncate mt-1">{user.bio}</p>
        )} */}
      </div>
      
      <div className="flex items-center gap-2">
        {!isCurrentUser && (
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              console.log(isFollowing ? 'Unfollow' : 'Follow', user._id);
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
}

export const FollowModal = ({
  isOpen,
  onClose,
  followers = [],
  following = [],
  profileName = '',
  currentUserId = null,
  initialTab = 'followers',
}: FollowModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
     <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-900 text-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-200">{profileName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'followers'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('followers')}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Followers</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {followers.length}
              </span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'following'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('following')}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              <span>Following</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {following.length}
              </span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'followers' ? (
            followers.length > 0 ? (
              <div className="p-2">
                {followers.map((followerId) => (
                  <UserListItem
                    key={followerId}
                    userId={followerId}
                    onUserClick={handleUserClick}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                <Heart className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No followers yet</p>
                <p className="text-sm text-center">When people follow this profile, they'll appear here.</p>
              </div>
            )
          ) : (
            following.length > 0 ? (
              <div className="p-2">
                {following.map((followingId) => (
                  <UserListItem
                    key={followingId}
                    userId={followingId}
                    onUserClick={handleUserClick}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                <Users className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Not following anyone</p>
                <p className="text-sm text-center">When this profile follows people, they'll appear here.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  
  );
};

export default FollowModal;
