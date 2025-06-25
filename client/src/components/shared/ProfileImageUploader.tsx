import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useUploadProfileImage } from '@/hooks/useProfileApi';
import {
  Camera,
  Loader2,
  User,
  X,
  Check,
  Eye,
  Trash,
  Settings,
  CircleX,
} from 'lucide-react';

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
  const [showViewImageOptions, setShowViewImageOptions] = useState(false);

  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const imageOptionsRef = useRef<HTMLDivElement>(null);

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
  const handleViewImageOptionsClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setTimeout(() => {
      setShowViewImageOptions((prev) => !prev);
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(e.target as Node)
      ) {
        setShowOptionsMenu(false);
      }

      if (
        imageOptionsRef.current &&
        !imageOptionsRef.current.contains(e.target as Node)
      ) {
        setShowViewImageOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu, showViewImageOptions]);

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

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showOptionsMenu && (
        <div
          ref={optionsMenuRef}
          className={`absolute ${
            type === 'cover' ? 'top-4 right-14' : 'left-40 top-14'
          } bg-black/40 z-20 flex items-center justify-center`}
        >
          <div className="bg-dark-4 rounded-lg shadow p-3 space-y-3 w-52 text-center ">
            <p className="text-gray-500 ">Choose an action</p>
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
            <label className="flex  items-center justify-center text-white text-sm cursor-pointer  duration-200">
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

      {viewImage && currentImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div
            className={`relative w-full flex flex-col items-center justify-center ${
              type === 'cover' ? 'max-w-5xl' : 'max-w-3xl'
            }`}
          >
            <div className={`absolute z-20 top-4 right-50`}>
              <Settings
                className="w-6 h-6 cursor-pointer text-light-2 hover:text-white"
                onClick={handleViewImageOptionsClick}
              />
            </div>
            <img
              src={currentImage}
              alt="Full View"
              className="w-auto max-h-[90vh] rounded-md shadow-lg object-contain"
            />
            {showViewImageOptions && (
              <div
                ref={imageOptionsRef}
                className={`absolute top-4 right-14 mt-1 w-42 p-2 flex flex-col items-center bg-dark-2 border border-dark-4 rounded-md shadow-lg z-10 overflow-hidden`}
              >
                <button
                  onClick={handleDelete}
                  className="flex justify-center text-l font-bold items-center gap-2 w-full text-center px-3 py-2 text-red-500  hover:bg-dark-3 transition-colors"
                >
                  <Trash className="w-6 h-6" /> Delete
                </button>
                <button
                  onClick={() => setViewImage(false)}
                  className="flex justify-center w-full gap-2 px-3 py-2 text-l text-gray-500 font-bold hover:bg-dark-3 transition-colors"
                >
                  <CircleX className="w-6 h-6" /> Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-1 text-sm text-red-500 text-center animate-pulse">
          {error}
        </div>
      )}
    </>
  );
};

export default ProfileImageUploader;
