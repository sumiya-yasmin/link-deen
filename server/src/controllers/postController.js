import postServices from '../services/postServices.js';
import uploadService from '../services/uploadService.js';

class PostController {
  async createPost(req, res) {
    try {
      const userId = req._id;
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

  async updatePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req._id;
      const { caption, location, tags } = req.body;
      let imageUrl;

      if (req.file) {
        imageUrl = await uploadService.uploadImage(req.file);
      }
      const updateData = {
        caption,
        location,
        tags: tags ? JSON.parse(tags) : [],
      };

      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const post = await postServices.updatePost(postId, updateData, userId);
      res.json(post);
    } catch (error) {
      console.error('Update post error:', error.message);
      const statusCode = error.message.includes('authorized') ? 403 : 404;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req._id;
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
      const post = await postServices.getPostById(postId);
      res.status(200).json(post);
    } catch (error) {
      console.error('Get post by ID error:', error);
      res.status(404).json({ error: error.message || 'Post not found' });
    }
  }

  async getAllPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await postServices.getAllPosts(page, limit);
      res.json(posts);
    } catch (error) {
      console.error('Get all posts error:', error.message);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  async getUserPosts(req, res) {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await postServices.getUserPosts(userId, page, limit);
      res.json(result);
    } catch (error) {
      console.error('Get user posts error:', error.message);
      res.status(500).json({ error: 'Failed to fetch user posts' });
    }
  }

  async likePost(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const post = await postServices.likePost(userId, postId);
      res.status(200).json(post);
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ error: error.message || 'Failed to like post' });
    }
  }

  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const imageUrl = await uploadService.uploadImage(req.file);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Upload error:', error.message);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
}

export default new PostController();
