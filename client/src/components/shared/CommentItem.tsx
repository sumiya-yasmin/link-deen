import { Comment, User } from '@/types';
import { Ellipsis } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
interface CommentItemProps {
  comment: Comment;
  user: User | null;
  onUpdateComment: (updateData: { commentId: string; content: string }) => void;
}
export const CommentItem = ({
  comment,
  user,
  onUpdateComment,
}: CommentItemProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const optionsRef = useRef<HTMLDivElement>(null);
  const isOwner = user?._id === comment.user._id;

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
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };
  const handleSaveEdit = () => {
    if (
      editedContent.trim() &&
      editedContent.trim() !== comment.content.trim()
    ) {
      onUpdateComment({
        commentId: comment._id,
        content: editedContent.trim(),
      });
    }
    setIsEditing(false);
     setShowOptions(false)
    // setEditedContent(comment.content);
  };
  const handleDeleteClick = () => {
    setShowOptions(false);
  };
  return (
    <div
      key={comment._id}
      className="text-light-2 p-2 border border-dark-4 rounded-lg"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <img
            src="/assets/profile-placeholder.png"
            alt="profile"
            className="h-6 w-6 rounded-full border-2 border-[#CD7F32]"
          />
          <p className="text-sm font-medium">{comment.user.name}</p>
        </div>

        {isOwner && (
          <div className="relative" ref={optionsRef}>
            <Ellipsis
              className="w-4 h-4 cursor-pointer"
              onClick={handleOptionsClick}
            />
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-dark-2 border border-dark-4 rounded-md shadow-lg z-10 overflow-hidden">
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-light-2 hover:bg-dark-3 transition-colors"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-dark-3 transition-colors"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-1 w-full">
        {isEditing ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-dark-3 text-white px-3 py-2 rounded-lg border border-dark-4 text-sm resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-[#CD7F32] text-white px-4 py-1 rounded-lg text-sm hover:opacity-80 transition-opacity
                               disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={
                  !editedContent.trim() ||
                  editedContent.trim() === comment.content.trim()
                }
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm pl-8 ">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
