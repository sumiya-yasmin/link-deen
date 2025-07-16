import PostForm from '@/components/forms/PostForm';
import { ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePostPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<'post' | 'hikmah'>('post');
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <ImagePlus className="w-10 h-10 text-[#CD7F32]" />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            {type === 'hikmah' ? 'Share Hikmah' : 'Create Post'}
          </h2>
          <div className="bg-dark-3 inline-flex rounded-full p-1">
            {['post', 'hikmah'].map((item) => (
              <button
                key={item}
                onClick={() => setType(item as 'post' | 'hikmah')}
                className={`px-4 py-2 rounded-full transition text-sm font-semibold ${
                  type === item
                    ? 'bg-[#CD7F32] text-white'
                    : 'text-muted-foreground hover:bg-dark-4'
                }`}
              >
                {item === 'post' ? 'Post' : 'Hikmah'}
              </button>
            ))}
          </div>
        </div>
        <PostForm type={type} onCancel={handleCancel} />
      </div>
    </div>
  );
}

export default CreatePostPage;
