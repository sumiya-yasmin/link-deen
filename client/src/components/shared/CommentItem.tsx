import { Comment, User } from '@/types';
import { Ellipsis } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
interface CommentItemProps {
  comment: Comment;
  user: User | null;
}
export const CommentItem = ({ comment, user }: CommentItemProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const isOwner = user?._id === comment.user._id;

  const handleOptionsClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  useEffect(()=>{
     const handleClickOutside = (e: MouseEvent)=>{
          if(optionsRef.current && !optionsRef.current.contains(e.target as Node)){
            setShowOptions(false);
          }
     };
      if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
      return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }

  },[showOptions])
  return (
    <div key={comment._id} className="text-light-2">
      <div className="flex gap-2">
        <img
          src="/assets/profile-placeholder.png"
          alt="profile"
          className="h-6 w-6 rounded-full border-2 border-[#CD7F32]"
        />
        <p className="text-sm font-medium">{comment.user.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs pl-8 ">{comment.content}</p>
        {isOwner && (
          <div className="relative" ref={optionsRef}>
            <Ellipsis className="w-4 h-4" onClick={handleOptionsClick} />
            {showOptions && (
              <div className="absolute right-0 top-full w-32 bg-dark-2 border border-dark-4 rounded-md shadow-lg z-10 overflow-hidden">
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-light-2 hover:bg-dark-3 transition-colors"
                  //   onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-dark-3 transition-colors"
                  //   onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
