import postServices from '../services/postServices.js';
import uploadService from '../services/uploadService.js';

class PostController {
  async createPost(req, res) {
    try {
      const userId = req._id;
      const { caption, location, tags } = req.body;
      const tagsArray = tags?.split(',').map((tag) => tag.trim()) || [];

      let imageUrl = '';
      if (req.file) {
        imageUrl = await uploadService.uploadImage(req.file);
      }

      const postData = {
        caption,
        location,
        tags: tagsArray,
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
      const { caption, location, tags, removeImage } = req.body;
      const tagsArray = tags?.split(',').map((tag) => tag.trim()) || [];
      const existingPost = await postServices.getPostById(postId);
      let imageUrl = existingPost?.image;

      if (req.file) {
        if (existingPost?.image) {
          await uploadService.deleteImage(existingPost.image);
        }
        imageUrl = await uploadService.uploadImage(req.file);
      }
      if (removeImage === 'true' && existingPost?.image) {
        await uploadService.deleteImage(existingPost.image);
        imageUrl = '';
      }
      const updateData = {
        caption,
        location,
        tags: tagsArray,
        image: imageUrl,
      };

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
      const existingPost = await postServices.getPostById(postId);
      if (existingPost.image) {
        await uploadService.deleteImage(existingPost.image);
      }
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
      const userId = req._id;
      const postId = req.params.id;

      const post = await postServices.likePost(userId, postId);
      res.status(200).json(post);
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ error: error.message || 'Failed to like post' });
    }
  }

  async getRecentPosts(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;
      const posts = await postServices.getRecentPosts({ limit, cursor });
      res.status(200).json(posts);
    } catch (error) {
      next(error);
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

  async getPopularPosts(req, res) {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || 'today';

    try {
      const result = await postServices.getPopularPosts(
        limit,
        cursor,
        timeframe
      );
      res.status(200).json(result);
    } catch (error) {
      console.error('Popular posts error:', error.message);
      res.status(500).json({ error: 'Failed to fetch popular posts.' });
    }
  }

  async getSearchedPosts(req, res) {
    try {
      const { query, limit = 10, cursor } = req.query;
      const posts = await postServices.getSearchedPosts(
        query,
        parseInt(limit),
        cursor
      );
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
