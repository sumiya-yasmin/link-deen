import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUploadProfileImage } from '@/hooks/useProfileApi';
import { Camera, Loader2, User, X, Check } from 'lucide-react';

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

  // Use the React Query mutation
  const uploadMutation = useUploadProfileImage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowPreview(true);
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
          handleCancel(); // Close preview modal
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

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden cursor-pointer',
          className
        )}
      >
        {/* Display current image or placeholder */}
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

        {/* Overlay for upload */}
        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-sm cursor-pointer transition-opacity duration-200">
          <div className="flex flex-col items-center">
            <Camera className="w-6 h-6 mb-2" />
            <span>{currentImage ? `Change ${type}` : `Add ${type}`}</span>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {/* Error message */}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
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

            {/* Preview */}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
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
    </>
  );
};

export default ProfileImageUploader;
