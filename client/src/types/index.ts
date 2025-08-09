export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  imageUrl: string;
  coverImageUrl: string;
  bio: string;
  createdAt: string;
  deletedAt: string;
  isDeleted: boolean;
  deletionScheduledAt: string;
}

export interface UserProfile extends User {
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    followers: string[];
    following: string[];
  };
}

export interface Post {
  _id: string;
  type: 'post' | 'hikmah';
  caption: string;
  image: string;
  location: string;
  tags: string[];
  source?: string;
  author: User;
  createdAt: string;
  likes: string[];
  likesCount: number;
  comments: string[];
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export type Comment = {
  _id: string;
  user: {
    _id: string;
    username: string;
    name: string;
    imageUrl?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
};

export type PaginatedComments = {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalComments: number;
    hasMore: boolean;
  };
};

export type PaginatedPostsResponse = {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
