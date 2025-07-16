import { Heart, MessageCircle, Bookmark, Share2, Moon } from 'lucide-react';

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
    variant?: 'default' | 'hikmah';
};

const PostStats = ({
  likes = 0,
  comments = 0,
  isLiked = true,
  isSaved = false,
  onLike,
  onSave,
  onShare,
  onToggleComments,
   variant = 'default',
}: //  showComments = true,
PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20 pt-4 border-t border-dark-4 text-light-3">
      <div className="flex gap-2 mr-5">
        <button
          onClick={onLike}
          className="flex items-center gap-2 hover:bg-dark-3 md:px-8 md:py-4 rounded-2xl group"
        >
          {variant === 'default' ? (
          <Heart
            className={`w-6 h-6 cursor-pointer group-hover:text-[#CD7F32] ${
              isLiked ? 'fill-[#CD7F32] text-[#CD7F32]' : ''
            }`}
          />
          ):(
            <Moon 
             className={`w-6 h-6 cursor-pointer group-hover:text-[#CD7F32] ${
              isLiked ? 'fill-yellow-500 text-yellow-500' : ''
            }`}
            />
          )
         }
          <span className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
            {likes}
          </span>
        </button>
      </div>
      <div className="flex items-center gap-2 group hover:bg-dark-3 md:px-8 md:py-4 rounded-2xl" onClick={onToggleComments}>
        <MessageCircle className="w-6 h-6 group-hover:text-[#CD7F32]" />
        {variant === 'hikmah' && (
          <span>Reflections</span>
        )}
        <span>{comments}</span>
      </div>
      <div className="flex gap-8">
        <button onClick={onShare} className='hover:bg-dark-3 md:p-4 rounded-2xl hover:text-[#CD7F32]'>
          <Share2 className="w-5 h-5 " />
        </button>
        <button onClick={onSave} className='hover:text-[#CD7F32] hover:bg-dark-3 md:p-4 rounded-2xl'>
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
