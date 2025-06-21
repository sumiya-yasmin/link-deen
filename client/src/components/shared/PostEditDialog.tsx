import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import PostForm from '../forms/PostForm';
import { Post } from '@/types';

interface PostEditDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostEditDialog = ({ post, open, onOpenChange }: PostEditDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-dark-1 p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Edit Post</DialogTitle>
          <DialogDescription className="text-light-3">
            Update caption, location, image, and tags.
          </DialogDescription>
        </DialogHeader>

        <PostForm post={post} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default PostEditDialog;
