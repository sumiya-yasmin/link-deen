import { useAuth } from '@/context/AuthContext';
import { useGetProfileById } from '@/hooks/useProfileApi';
import { formatDate, formatNumber } from '@/lib/utils';
import { Calendar, MessageCircle, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import ProfileImageUploader from './ProfileImageUploader';
import EditProfileModal from './EditProfile';
import { useState } from 'react';

export const ProfileCard = ({ totalPosts = 0 }: { totalPosts: number }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data: profile, isPending: userLoading } = useGetProfileById(id!);
  const { user } = useAuth();

  if (userLoading) return <p>Loading...</p>;
  if (!profile) return <p>User not found</p>;

  const isCurrentUser = profile._id === user?._id;

  const handleShowDetails = () => {
    if (!showDetails) {
      setShowDetails(true);
    }
    if (showDetails) {
      setShowDetails(false);
    }
  };

  return (
    <div className=" rounded-2xl w-full shadow-md overflow-hidden ">
      <div className="relative h-56">
        {isCurrentUser ? (
          <ProfileImageUploader
            type="cover"
            currentImage={profile.coverImageUrl}
            className="h-56 w-full"
          />
        ) : (
          <div className="h-56 w-full bg-gradient-to-r from-blue-500 to-purple-600">
            {profile.coverImageUrl && (
              <img
                src={profile.coverImageUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
      </div>

      <div className="relative px-6 pb-6 bg-dark-2">
        <div className="absolute -top-16 left-6">
          <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {isCurrentUser ? (
              <ProfileImageUploader
                type="profile"
                currentImage={profile.imageUrl}
                className="w-40 h-40 rounded-full"
              />
            ) : (
              <>
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-2 justify-end">
          {isCurrentUser ? (
            <button
              onClick={() => setEditOpen(true)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <button className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-200">
              Follow
            </button>
          )}
        </div>
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          defaultValues={{
            name: profile.name,
            username: profile.username,
            bio: profile.bio || '',
          }}
        />
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-3 text-gray-700 leading-relaxed">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center text-gray-700">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="font-semibold">
                {formatNumber(totalPosts ?? 0)}
              </span>
              <span className="text-gray-500 ml-1">Posts</span>
            </div>

            {/* <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-semibold">{formatNumber(profile.stats.followingCount)}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
            
            <div className="flex items-center text-gray-700">
            <Heart className="w-4 h-4 mr-1" />
              <span className="font-semibold">{formatNumber(profile.stats.followersCount)}</span>
              <span className="text-gray-500 ml-1">Followers</span>
              </div> */}
          </div>
          <div
            className="text-center text-gray-600"
            onClick={() => handleShowDetails()}
          >
            Show more info
          </div>
          {showDetails && (
            <div className="flex items-center mt-3 text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Joined {formatDate(profile.createdAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
