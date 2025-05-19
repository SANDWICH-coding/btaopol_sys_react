import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import clsx from 'clsx';

const FileInput = ({
  label = 'Upload File',
  accept = 'image/*',
  onChange,
  required = false,
  error = '',
  className = '',
}) => {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    onChange?.(file);
  };

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={() => fileRef.current?.click()}
        className={clsx(
          "cursor-pointer flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed rounded-xl transition-all",
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50',
        )}
      >
        <UploadCloud className="w-6 h-6 text-gray-500" />
        <p className="text-sm text-gray-600">
          {fileName || 'Click to upload'}
        </p>
        <input
          type="file"
          ref={fileRef}
          accept={accept}
          required={required}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
