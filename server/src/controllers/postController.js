import postServices from '../services/postServices.js';
import uploadService from '../services/uploadService.js';

class PostController {
  async createPost(req, res) {
    try {
      const userId = req.user.id;
      const { caption, location, tags } = req.body;
      let imageUrl = '';
      if (req.file) {
        imageUrl = await uploadService.uploadImage(req.file);
      }

      const postData = {
        caption,
        location,
        tags: tags ? JSON.parse(tags) : [],
        image: imageUrl,
      };
      const post = await postServices.createPost(postData, userId);
      res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error.message);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const result = await postServices.deletePost(postId, userId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete post' });
    }
  }

  async getPostById(req, res) {
    try {
      const postId = req.params.id;
      post = await postServices.getPostById(postId);
      res.status(200).json(post);
    } catch (error) {
      console.error('Get post by ID error:', error);
      res.status(404).json({ error: error.message || 'Post not found' });
    }
  }

  async likePost(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const post = await postService.likePost(userId, postId);
      res.status(200).json(post);
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ error: error.message || 'Failed to like post' });
    }
  }
}

export default new PostController();
