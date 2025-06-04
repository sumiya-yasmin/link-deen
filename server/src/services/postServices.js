import { Post } from '../models/post';

class PostService {
  async createPost(postData, userId) {
    const post = new Post({
      ...postData,
      author: userId,
    });
    await post.save();
    return await Post.findById(post._id).populate('author', 'username name');
  }

  async updatePost(postId, postData, userId) {
    const post = Post.findById(postId);
    if (!post) {
      throw new Error('No post found with the post id');
    }
    if (post.author.toString() !== userId) {
      throw new Error('Not authorized to update the post');
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        ...postData,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('author', 'username name');
    return updatedPost;
  }

  async deletePost(postId, userId) {
    const post = Post.findById(postId);
    if (!post) {
      throw new Error('No post found with the post id');
    }
    if (post.author.toString() !== userId) {
      throw new Error('Not authorized to delete the post');
    }
    await Post.findByIdAndDelete(postId);
    return { message: 'Post deleted successfully' };
  }

  async getAllPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate('author', 'username name')
      .populate('comments.user', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();
    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getUserPosts(userId, page = 1, limit = 10) {
    skip = (page - 1) * limit;
    const posts = await Post.find({ author: userId })
      .populate('author', 'username name')
      .populate('comments.user', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments();
    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async likePost(userId, postId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return await Post.findById(postId)
      .populate('author', 'username name')
      .populate('comments.user', 'username name');
  }

  async addComment(postId, userId, commentData) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }
    post.comments.push({ userId, commentData });

    await post.save();
  }
}

module.exports = new PostService();
