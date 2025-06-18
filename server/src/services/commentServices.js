import { Post } from '../models/post.js';

class CommentService {
  async addComment(postId, userId, content) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }
    const comment = {
      user: userId,
      content: content.trim(),
      createdAt: Date.now(),
    };
    post.comments.push(comment);

    await post.save();
    return await Post.findById(postId)
      .populate('author', '_id username name imageUrl ')
      .populate('comments.user', '_id username name imageUrl');
  }

  async deleteComment(postId, commentId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (
      comment.user.toString() !== userId &&
      post.author.toString() !== userId
    ) {
      throw new Error('User not authorized');
    }
    post.comments.pull(commentId);
    await post.save();
    return await Post.findById(postId)
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl');
  }

  async getComments(postId, page = 1, limit = 20) {
    const post = await Post.findById(postId)
      .populate('comments.user', '_id username name imageUrl')
      .select('comments');

    if (!post) {
      throw new Error('Post not found');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const comments = post.comments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(startIndex, endIndex);

    return {
      comments,
      pagination: {
        currentPage: page,
        totalComments: post.comments.length,
        hasMore: endIndex < post.comments.length,
      },
    };
  }

  async updateComment(postId, commentId, userId, newContent) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new Error('Post not found');
    }
    if (comment.user.toString() !== userId) {
      throw new Error('User not authorized');
    }

    comment.content = newContent;
    comment.updatedAt = new Date();

    await post.save();

    return await Post.findById(postId)
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl');
  }
}
export default new CommentService();
