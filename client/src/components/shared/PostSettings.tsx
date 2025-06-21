import { Post, User } from '@/types';
import { Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DeleteConfirmDialog } from '../DeleteConfirmDialog';
import PostEditDialog from './PostEditDialog';

interface PostSettingsProps {
  post: Post;
  user: User;
  onDeletePost: (postId: string) => void;
}

const PostSettings = ({ post, user, onDeletePost }: PostSettingsProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleEditClick = () => {
    setShowOptions(false);
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    onDeletePost(post._id);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };
  return (
    <>
      <div className="relative" ref={optionsRef}>
        <Settings
          className="w-6 h-6 cursor-pointer"
          onClick={handleOptionsClick}
        />
        {showOptions && (
          <div className="absolute right-0 top-full mt-1 w-42 p-2 bg-dark-2 border border-dark-4 rounded-md shadow-lg z-10 overflow-hidden">
            <button
              className="block w-full text-left px-3 py-2 text-l text-light-2 hover:bg-dark-3 transition-colors"
              onClick={handleEditClick}
            >
              Edit Post
            </button>

            <button
              className="block w-full text-left px-3 py-2 text-l text-red-500 hover:bg-dark-3 transition-colors"
              onClick={handleDeleteClick}
            >
              Delete Post
            </button>
          </div>
        )}
      </div>

      {showEditDialog && (
        <PostEditDialog
          post={post}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {showDeleteDialog && (
        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default PostSettings;
