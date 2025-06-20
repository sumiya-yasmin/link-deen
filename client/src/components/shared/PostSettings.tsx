import { Post, User } from '@/types';
import { Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PostSettingsProps {
  post: Post;
  user: User;
}

const PostSettings = ({ post, user }: PostSettingsProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleOptionsClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
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
    };
  }, [showOptions]);
  return (
    <div className="relative" ref={optionsRef}>
      <Settings
        className="w-6 h-6 cursor-pointer"
        onClick={handleOptionsClick}
      />
      {showOptions && (
        <div className="absolute right-0 top-full mt-1 w-42 p-2 bg-dark-2 border border-dark-4 rounded-md shadow-lg z-10 overflow-hidden">
          <button
            className="block w-full text-left px-3 py-2 text-l text-light-2 hover:bg-dark-3 transition-colors"
            // onClick={handleEditClick}
          >
            Edit Post
          </button>

          <button
            className="block w-full text-left px-3 py-2 text-l text-red-500 hover:bg-dark-3 transition-colors"
            // onClick={handleDeleteClick}
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostSettings;
