import API from '@/lib/axios';
import { PaginatedComments } from '@/types';

type addCommentParams = {
  postId: string;
  content: string;
};

type getCommentParams = {
  postId: string;
  page?: number;
  limit?: number;
};

type updateCommentParams = {
  postId: string;
  commentId: string;
  content: string;
};

type deleteCommentParams = {
  postId: string;
  commentId: string;
};

export const addComment = async ({ postId, content }: addCommentParams) => {
  const response = await API.post(`/post/${postId}/comments`, { content });
  return response.data;
};

export const updateComment = async ({
  postId,
  commentId,
  content,
}: updateCommentParams) => {
  const response = await API.patch(`/post/${postId}/comments/${commentId}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async ({
  postId,
  commentId,
}: deleteCommentParams) => {
  const response = await API.delete(`/post/${postId}/comments/${commentId}`);
  return response.data;
};

export const getComments = async ({
  postId,
  page = 1,
  limit = 10,
}: getCommentParams): Promise<PaginatedComments> => {
  const response = await API.get(`/post/${postId}/comments`, {
    params: { page, limit },
  });
  return response.data;
};
