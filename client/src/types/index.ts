export interface User {
  id: string;
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
}