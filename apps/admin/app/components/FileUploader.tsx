'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/utils';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  description?: string;
}

export default function FileUploader({
  onUploadComplete,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  label = 'Upload File',
  description = 'Click to upload or drag and drop',
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const { uploadProgress, upload, reset } = useFileUpload();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');

    if (file.size > maxSize) {
      setError(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const url = await upload(selectedFile);
      onUploadComplete(url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="space-y-2">
            <FiUpload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xs text-gray-500">
              Max size: {formatFileSize(maxSize)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <FiFile className="w-12 h-12 mx-auto text-primary-500" />
            <p className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {selectedFile && uploadProgress.status === 'idle' && (
        <div className="flex space-x-2">
          <button onClick={handleUpload} className="btn-primary flex-1">
            <FiUpload className="inline-block mr-2" />
            Upload
          </button>
          <button onClick={handleRemove} className="btn-secondary">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {uploadProgress.status === 'uploading' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Uploading... {uploadProgress.progress}%
          </p>
        </div>
      )}

      {uploadProgress.status === 'success' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FiCheck className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-sm text-green-600">Upload successful!</p>
        </div>
      )}
    </div>
  );
}
