import { useAddComment, useGetComments } from "@/hooks/useCommentApis";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const CommentsSection = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const { data, isLoading } = useGetComments(postId);
  const { mutate: addComment } = useAddComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(newComment);
    setNewComment("");
     console.log(postId)
     console.log(data)
  };

  if (isLoading) return <p className="text-light-3 mt-4">Loading comments...</p>;

  return (
    <div className="mt-4 border-t border-dark-4 pt-4">
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-dark-3 text-white px-3 py-2 rounded-lg border border-dark-4"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </form>
      )}

      <div className="space-y-3">
        {data?.comments?.length === 0 && <p className="text-light-4">No comments yet.</p>}
        {data?.comments?.map((comment) => (
          <div key={comment._id} className="text-light-2">
            <p className="text-sm font-medium">{comment.user.name}</p>
            <p className="text-xs">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
