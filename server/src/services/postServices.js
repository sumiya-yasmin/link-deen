import { Post } from '../models/post.js';
import uploadService from './uploadService.js';

class PostService {
  async createPost(postData, userId) {
    const post = new Post({
      ...postData,
      author: userId,
    });
    await post.save();
    return await Post.findById(post._id).populate(
      'author',
      '_id username name imageUrl'
    );
  }

  async updatePost(postId, postData, userId) {
    const post = await Post.findById(postId);
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
    ).populate('author', '_id username name imageUrl');
    return updatedPost;
  }

  async deletePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('No post found with the post id');
    }
    if (post.author.toString() !== userId) {
      throw new Error('Not authorized to delete the post');
    }
    if (post.image) {
      await uploadService.deleteImage(post.image);
    }
    await Post.findByIdAndDelete(postId);
    return { message: 'Post deleted successfully' };
  }

  async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl');

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  async getAllPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl')
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
    const skip = (page - 1) * limit;
    const posts = await Post.find({ author: userId })
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments({ author: userId });
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
      .populate('author', '_id username name imageUrl')
      .populate('comments.user', '_id username name imageUrl');
  }

  async getRecentPosts(limit = 10, cursor) {
    const query = {};
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', '_id username name imageUrl');
    const hasNextPage = posts.length > limit;
    const slicedPosts = hasNextPage ? posts.slice(0, limit) : posts;
    const nextCursor = hasNextPage
      ? slicedPosts[slicedPosts.length - 1].createdAt.toISOString()
      : null;
    return {
      posts: slicedPosts,
      nextCursor,
    };
  }

  async getPopularPosts(limit = 10, cursor, timeframe = 'today') {
    const date = new Date();
    if (timeframe === 'today') date.setDate(date.getDate() - 1);
    else if (timeframe === 'week') date.setDate(date.getDate() - 7);
    else if (timeframe === 'month') date.setMonth(date.getMonth() - 1);

    const matchCondition = {
      createdAt: { $gte: date },
    };

    if (cursor) {
      const [likesCountCursor, createdAtCursor] = cursor.split('|');
      matchCondition.$or = [
        { likesCount: { $lt: parseInt(likesCountCursor) } },
        {
          likesCount: parseInt(likesCountCursor),
          createdAt: { $lt: new Date(createdAtCursor) },
        },
      ];
    }

    const aggregatedPosts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        },
      },
      { $match: matchCondition },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: limit + 1 },
    ]);

    const populatedPosts = await Post.populate(aggregatedPosts, {
      path: 'author',
      select: '_id name username imageUrl',
    });

    const hasNextPage = populatedPosts.length > limit;
    const slicedPosts = hasNextPage
      ? populatedPosts.slice(0, limit)
      : populatedPosts;

    const nextCursor = hasNextPage
      ? `${slicedPosts[slicedPosts.length - 1].likesCount}|${slicedPosts[
          slicedPosts.length - 1
        ].createdAt.toISOString()}`
      : null;

    return { posts: slicedPosts, nextCursor };
  }

  async getSearchedPosts(query, limit = 10, cursor) {
    if (!query || !query.trim()) {
      throw new Error('Search query is required');
    }

    const searchRegex = new RegExp(query, 'i');
    const matchFilter = {
      $or: [
        { caption: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ],
    };

    if (cursor) {
      matchFilter.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(matchFilter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate('author', '_id name username imageUrl');

      const hasNextPage = posts.length> limit;
      const slicedPosts = hasNextPage? posts.slice(0, limit) : posts;
      const nextCursor = hasNextPage? slicedPosts[slicedPosts.length -1].createdAt.toISOString() : null;
      return{
        posts: slicedPosts,
        nextCursor,
      }
  }
}

export default new PostService();
