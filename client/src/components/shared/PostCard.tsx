import { useAuth } from '@/context/AuthContext';
import { formatDateString } from '@/lib/utils';
import { Post } from '@/types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { useDeletePost, useLikePost } from '@/hooks/usePostApis';
import CommentsSection from './CommentsSection';
import PostSettings from './PostSettings';
import { MessageCircle } from 'lucide-react';

type PostCardProps = {
  post: Post;
  mode?: 'preview' | 'details' | 'minimal';
};

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, mode = 'preview' }, ref) => {
    const { user } = useAuth();
    const { mutate: likePost } = useLikePost();
    const { mutate: deletePost } = useDeletePost();

    const isLiked = user?._id ? post.likes.includes(user._id) : false;
    const likeCount = post.likes.length;
    const isOwner = user?._id === post.author._id;

    const [showComments, setShowComments] = useState(mode === 'details');
    const toggleComments = () => setShowComments((prev) => !prev);
    const commentCount = post.comments.length;

    const handleLike = () => {
      likePost(post._id);
    };

    const wrapperClass =
      mode === 'details'
        ? 'w-full max-w-3xl px-2 md:px-0'
        : mode === 'minimal'
        ? 'w-full max-w-xs'
        : 'bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm';

    if (mode === 'minimal') {
      return (
        <Link
          to={`/post/${post._id}`}
          ref={ref}
          className={`${wrapperClass} group hover:shadow-lg transition-shadow duration-200 rounded-md overflow-hidden`}
        >
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-[250px] object-cover rounded-md"
            />
          )}
          {!post.image && (
            <div className="w-full h-[250px] p-10">{post?.caption}</div>
          )}
          <div className="px-3 py-2 flex items-center justify-between bg-dark-3">
            <div className="flex items-center gap-2">
              <img
                src={
                  post?.author?.imageUrl || '/assets/profile-placeholder.png'
                }
                alt="avatar"
                className="h-6 w-6 rounded-full"
              />
              <p className="text-sm text-light-1 truncate">
                {post.author.username}
              </p>
            </div>
            <div className="flex gap-3 text-muted-foreground text-xs">
              <span>❤️ {likeCount}</span>
              <span className="flex gap-1">
                {' '}
                <MessageCircle className="h-3 w-3" /> {commentCount}
              </span>
            </div>
          </div>
        </Link>
      );
    }
    if (post.type === 'hikmah') {
      return (
        <div
          ref={ref}
          className={`${wrapperClass} bg-gradient-to-br from-[#1A202C] to-[#2D3748] text-[#E2E8F0]`}
        >
            <div className="flex items-start justify-between mb-4 p-4">
              <div className="flex flex-col items-start">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-full mb-2">
                  ✨ HIKMAH
                </span>
              </div>
              <p className="text-sm text-[#A0AEC0]">{post.tags}</p>

              {isOwner && (
                <PostSettings
                  user={user}
                  post={post}
                  onDeletePost={(deleteData: string) => deletePost(deleteData)}
                />
              )}
            </div>

          <Link to={`/post/${post._id}`}>
            <div className="text-center my-6 p-4">
              <p className="italic font-serif text-xl leading-relaxed text-[#F7FAFC]">
                “{post.caption}”
              </p>
              {post.source && (
                <p className="mt-4 text-sm text-[#CBD5E0] font-medium">
                  — {post.source}
                </p>
              )}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full max-h-[400px] object-cover rounded-xl mt-4"
                />
              )}
            </div>
              </Link>
            <div className="flex items-center gap-3 justify-end mt-10 p-4">
              <div className="flex flex-col">
                <Link to={`/profile/${post.author._id}`}>
                  <p className="text-sm font-semibold">{post.author.name}</p>
                </Link>
                <span className="text-xs text-gray-500">
                  {formatDateString(post.createdAt)}
                </span>
              </div>
              {/* <Link to={`/profile/${post.author._id}`}>
            <img
              src={post.author.imageUrl || '/assets/profile-placeholder.png'}
              alt="profile"
              className="h-10 w-10 rounded-full border border-[#CD7F32]"
            />
          </Link> */}
            </div>
          <div className="p-4 mt-4">
            <PostStats
              likes={likeCount}
              comments={commentCount}
              isLiked={isLiked}
              isSaved={post.isSaved}
              onLike={handleLike}
              onToggleComments={toggleComments}
              variant="hikmah"
            />
            {showComments && <CommentsSection postId={post._id} />}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={wrapperClass}>
        <div className="flex justify-between gap-8 items-center">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author._id}`}>
              <img
                src={
                  post?.author?.imageUrl || '/assets/profile-placeholder.png'
                }
                alt="profile"
                className="h-12 w-12 rounded-full border-2 border-[#CD7F32]"
              />
            </Link>
            <div className="flex flex-col">
              <Link to={`/profile/${post.author._id}`}>
                <p className="text-[16px] font-medium leading-[140%] lg:text-[18px] lg:font-bold text-light-1">
                  {post.author.name}
                </p>
              </Link>
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
          {isOwner && (
            <PostSettings
              user={user}
              post={post}
              onDeletePost={(deleteData: string) => deletePost(deleteData)}
            />
          )}
        </div>
        {mode === 'preview' ? (
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
        ) : (
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
        )}

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
