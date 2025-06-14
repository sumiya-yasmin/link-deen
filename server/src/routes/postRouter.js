import express from 'express';
import { upload } from '../middlewares/upload.js';
import postController from '../controllers/postController.js';
import commentController from '../controllers/commentController.js';
export const postRouter = express.Router();

postRouter.post('/', upload.single('image'), postController.createPost);
postRouter.get('/', postController.getAllPosts);
postRouter.get('/user/:userId', postController.getUserPosts);
postRouter.get('/:id',  postController.getPostById);
postRouter.put('/:id', upload.single('image'), postController.updatePost);
postRouter.delete('/:id', postController.deletePost);

postRouter.post('/:id/like', postController.likePost);

postRouter.post('/:postId/comments', commentController.addComment);
postRouter.get('/:postId/comments', commentController.getComments);
postRouter.delete('/:postId/comments/:commentId', commentController.deleteComment);