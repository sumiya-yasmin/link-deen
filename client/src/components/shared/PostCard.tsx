import { useAuth } from '@/context/AuthContext';
import { formatDateString } from '@/lib/utils';
import { Post } from '@/types';
// import { Settings, SquarePen } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { useLikePost } from '@/hooks/usePostApis';
import CommentsSection from './CommentsSection';
import PostSettings from './PostSettings';

type PostCardProps = {
  post: Post;
};

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post }, ref) => {
    const { user } = useAuth();
    const { mutate: likePost } = useLikePost();

    const isLiked = user?._id ? post.likes.includes(user._id) : false;
    const likeCount = post.likes.length;
      const isOwner = user?._id === post.author._id;

    const handleLike = () => {
      likePost(post._id);
    };

    const [showComments, setShowComments] = useState(false);
    const toggleComments = () => setShowComments((prev) => !prev);
    const commentCount = post.comments.length;
    return (
      <div
        ref={ref}
        className="bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm;"
      >
        <div className="flex justify-between gap-8 items-center">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author._id}`}>
              <img
                src={
                  post?.author?.imageUrl || '/assets/profile-placeholder.png'
                }
                alt="profile"
                className="lg:h-12 w-12 rounded-full border-2 border-[#CD7F32]"
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-[16px] font-medium leading-[140%] lg:text-[18px] lg:font-bold text-light-1">
                {post.author.name}
              </p>
              <div className="flex-center gap-2 text-light-3">
                <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                  {formatDateString(post.createdAt)}
                </p>
                -
                <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                  {post.location}
                </p>
              </div>
            </div>
          </div>
          {/* <Link
            to={`/update-post/${post._id}`}
            className={`${user?._id === post.author._id ? '' : 'hidden'}`}
          >
            <SquarePen className="w-6 h-6" />
          </Link> */}
           {isOwner && (
              <PostSettings
              user={user}
              post={post}
              />
           )
           }

        </div>
        <Link to={`/post/${post._id}`}>
          <div className="text-[14px] lg:text-[16px] font-medium leading-[140%] py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
            {post.image && (
              <img
                src={post.image}
                alt="Post Image"
                className="w-full max-h-[500px] object-cover rounded-xl mt-4"
              />
            )}
          </div>
        </Link>

        <PostStats
          likes={likeCount}
          comments={commentCount}
          isLiked={isLiked}
          isSaved={post.isSaved}
          onLike={handleLike}
          onToggleComments={toggleComments}
          // showComments={showComments}
        />
        {showComments && <CommentsSection postId={post._id} />}
      </div>
    );
  }
);

export default PostCard;
