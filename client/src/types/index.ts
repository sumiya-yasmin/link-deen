export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  imageUrl: string;
}


export interface Post {
  _id: string;
  caption: string;
  image: string;
  location: string;
  tags: string[];
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
