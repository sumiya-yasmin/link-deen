import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';

type PostStatsProps = {
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onToggleComments?: () => void;
  showComments?: boolean;
};

const PostStats = ({
  likes = 0,
  comments = 0,
  isLiked = true,
  isSaved = true,
  onLike,
  onSave,
  onShare,
  onToggleComments,
}: //  showComments = true,
PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20 pt-4 border-t border-dark-4 text-light-3">
      <div className="flex gap-2 mr-5">
        <button
          onClick={onLike}
          className="flex items-center gap-2 hover:text-primary"
        >
          <Heart
            className={`w-6 h-6 cursor-pointer ${
              isLiked ? 'fill-[#CD7F32] text-[#CD7F32]' : ''
            }`}
          />
          <span className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
            {likes}
          </span>
        </button>
      </div>
      <div className="flex items-center gap-2" onClick={onToggleComments}>
        <MessageCircle className="w-6 h-6" />
        <span>{comments}</span>
      </div>
      <div className="flex gap-4">
        <button onClick={onShare}>
          <Share2 className="w-5 h-5" />
        </button>
        <button onClick={onSave}>
          <Bookmark
            className={`w-5 h-5 ${
              isSaved ? 'fill-[#CD7F32] text-[#CD7F32]' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PostStats;
