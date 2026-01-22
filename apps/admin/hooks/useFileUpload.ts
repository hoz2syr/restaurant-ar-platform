'use client';

import { useState, useCallback } from 'react';
import { fileApi } from '@/lib/api';

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
  });

  const upload = useCallback(async (file: File): Promise<string> => {
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const response = await fileApi.upload(file, (progress) => {
        setUploadProgress({ progress, status: 'uploading' });
      });

      setUploadProgress({
        progress: 100,
        status: 'success',
        url: response.url,
      });

      return response.url;
    } catch (error: any) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: error.message || 'Upload failed',
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadProgress({ progress: 0, status: 'idle' });
  }, []);

  return {
    uploadProgress,
    upload,
    reset,
  };
}
