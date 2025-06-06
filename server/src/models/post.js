import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    caption: { type: String, maxlength: 2200, trim: true },
    imageUrl: { type: String },
    location: { type: String, maxlength: 100, trtim: true },
    tags: [{ type: String, trim: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  { timestamps: true }
);

PostSchema.pre('save', function (next) {
  if (!this.caption && !this.imageUrl) {
    const error = new Error('The post can not be empty');
    error.name = 'Validation Error';
    return next(error);
  }
  next();
});
export const Post = mongoose.model('Post', PostSchema);
