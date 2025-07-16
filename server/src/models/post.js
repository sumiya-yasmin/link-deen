import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    caption: { type: String, maxlength: 2200, trim: true },
    image: { type: String },
    location: { type: String, maxlength: 100, trim: true },
    tags: [{ type: String, trim: true }],
    source: { type: String, trim: true },
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
      new mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
          maxlength: 500,
        },
      },
      {
      timestamps: true,
      }
    )
    ],
    type: {
      type: String,
      enum: ['post', 'hikmah'],
      default: 'post',
  },
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
