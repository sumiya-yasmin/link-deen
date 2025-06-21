import PostForm from '@/components/forms/PostForm';
import { ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreatePostPage() {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1); 
  };
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <ImagePlus className="w-10 h-10 text-[#CD7F32]" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
      <PostForm onCancel={handleCancel}/>
      </div>
    </div>
  );
}

export default CreatePostPage;
