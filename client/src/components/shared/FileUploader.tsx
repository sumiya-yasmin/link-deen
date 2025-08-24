import { ImageUp, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
  setClearFilePreview: React.Dispatch<React.SetStateAction<() => void>>;
  onRemove?: () => void;
};

function FileUploader({
  fieldChange,
  mediaUrl,
  setClearFilePreview,
  onRemove,
}: FileUploaderProps) {
  // const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState('');
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.svg'],
    },
  });

  useEffect(() => {
    setClearFilePreview(() => () => {
      // setFile([]);
      setFileUrl('');
    });
  }, [setClearFilePreview]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setFile([]);
    setFileUrl('');
    onRemove?.(); // also trigger parent's clear
  };
const previewUrl = fileUrl || mediaUrl;

  return (
    <div
      {...getRootProps()}
      className="flex flex-col bg-dark-3 rounded-xl cursor-pointer items-center justify-center"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {previewUrl ? (
        <>
          <div className="relative flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={previewUrl}
              alt="image"
              className="h-80 lg:h-[480px] lg:object-contain w-full rounded-[24px] object-cover object-top"
            />
            <X
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
            />
          </div>
          <p className="text-light-4 text-center small-regular w-full p-4 border-t border-t-dark-4">
            Click or Drag photo to replace
          </p>
        </>
      ) : (
        <div className="flex-center flex-col p-7 h-80 lg:h-[512px]">
          <ImageUp className="w-24 h-24 text-[#CD7F32]" />
          <h3 className="text-light-2 text-[16px] font-medium leading-[140%] mb-2 mt-6">
            Drag Photo here
          </h3>
          <p className="text-light-4 text-[14px] font-normal leading-[140%] mb-6">
            SVG, PNG, JPG
          </p>
          <Button
            type="button"
            className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2"
          >
            Select from device
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
