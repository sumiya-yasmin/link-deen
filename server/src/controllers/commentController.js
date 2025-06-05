import commentServices from '../services/commentServices';

class CommentController {
  async addComment(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const content = req.body;
      if (!content?.trim()) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      const updatedPost = await commentServices.addComment(
        postId,
        userId,
        content
      );
      res.status(201).json(updatedPost);
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: error.message || 'Failed to add comment' });
    }
  }

  async deleteComment(req, res) {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user.id;
      const updatedPost = await commentServices.deleteComment(
        postId,
        commentId,
        userId
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Delete comment error:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to delete comment' });
    }
  }

  async getComments(req, res) {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const data = await commentService.getComments(postId, page, limit);
      res.status(200).json(data);
    } catch (error) {
      console.error('Get comments error:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to fetch comments' });
    }
  }

  async updateComment(req, res) {
    try {
      const { postId, commentId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content?.trim()) {
        return res.status(400).json({ error: 'Updated content is required' });
      }

      const updatedPost = await commentService.updateComment(
        postId,
        commentId,
        userId,
        content
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Update comment error:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to update comment' });
    }
  }
}

export default new CommentController;
