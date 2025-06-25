import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUploadProfileImage } from '@/hooks/useProfileApi';
import { Camera, Loader2, User, X, Check, Eye, Trash } from 'lucide-react';

type Props = {
  type: 'profile' | 'cover';
  currentImage?: string;
  className?: string;
};

const ProfileImageUploader = ({ type, currentImage, className }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewImage, setViewImage] = useState(false);

  const uploadMutation = useUploadProfileImage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowPreview(true);

    setShowUploadModal(true);
    setShowOptionsMenu(false);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(
      {
        file: selectedFile,
        imageType: type,
      },
      {
        onSuccess: () => {
          handleCancel();
        },
      }
    );
  };

  const handleCancel = () => {
    setShowPreview(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDelete = () => {};

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden cursor-pointer',
          className
        )}
        onClick={() => setShowOptionsMenu(true)}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={`${type} image`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            {type === 'profile' ? (
              <User className="w-8 h-8 text-gray-600" />
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <span className="text-gray-600 text-sm">Add cover photo</span>
              </div>
            )}
          </div>
        )}

        {/* Hover Overlay (optional) */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showOptionsMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
           <div className="bg-dark-4 rounded-lg shadow p-3 space-y-3 w-52 text-center">
          <p className='text-gray-500 '>Choose an action</p>
          {currentImage && (
            <button
              onClick={() => {
                setViewImage(true);
                setShowOptionsMenu(false);
              }}
              className="w-full hover:underline flex items-center justify-center gap-2"
            >
              <Eye className="w-6 h-6 text-[#CD7F32]  " /> View {type}
            </button>
          )}
          <label 
          className="flex  items-center justify-center text-white text-sm cursor-pointer  duration-200">
            <div className="flex gap-2 justify-center items-center">
              <Camera className="w-6 h-6 text-[#CD7F32]  " />
              <span>{currentImage ? `Change ${type}` : `Add ${type}`}</span>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          <button
            onClick={() => setShowOptionsMenu(false)}
            className="w-full text-gray-500 hover:underline"
          >
            Cancel
          </button>
            </div>
        </div>
      )}
  

    
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 text-center">
          {error}
        </div>
      )}

  
      {showUploadModal && showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-4 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold">
                Update {type === 'profile' ? 'Profile Picture' : 'Cover Photo'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        
            <div className="p-4">
              <div
                className={cn(
                  'relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300',
                  type === 'cover'
                    ? 'aspect-[3/1]'
                    : 'aspect-square max-w-xs mx-auto'
                )}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-600 bg-dark-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                disabled={uploadMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewImage && currentImage &&(
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-xl w-full h-screen">
            <img
              src={currentImage}
              alt="Full View"
              className="w-full h-auto rounded-md shadow-lg"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setViewImage(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {error && (
        <div className="mt-1 text-sm text-red-500 text-center animate-pulse">{error}</div>
      )}
    </>
  );
};

export default ProfileImageUploader;
