import { useState } from 'react';
import { UploadResponse, UploadProgress, UploadError } from '@/types/upload';

export const useUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0
  });
  const [uploadError, setUploadError] = useState<UploadError | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse | null> => {
    setUploading(true);
    setProgress({
      loaded: 0,
      total: file.size,
      percentage: 0
    });
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate file upload with progress
      const response = await new Promise<UploadResponse>((resolve, reject) => {
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 10;
          
          const newProgress: UploadProgress = {
            loaded: (progressValue / 100) * file.size,
            total: file.size,
            percentage: progressValue
          };
          
          setProgress(newProgress);

          if (progressValue >= 100) {
            clearInterval(interval);
            resolve({
              url: 'https://example.com/uploaded-file',
              filename: file.name,
              mimetype: file.type,
              size: file.size,
              key: `uploads/${Date.now()}-${file.name}`
            });
          }
        }, 500);
      });

      return response;
    } catch (error) {
      const uploadError: UploadError = {
        name: 'UploadError',
        message: error instanceof Error ? error.message : 'Upload failed',
        code: 'UPLOAD_FAILED',
        details: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      };
      setUploadError(uploadError);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = (): void => {
    setUploading(false);
    setProgress({
      loaded: 0,
      total: 0,
      percentage: 0
    });
    setUploadError(null);
  };

  const resetUpload = (): void => {
    setUploading(false);
    setProgress({
      loaded: 0,
      total: 0,
      percentage: 0
    });
    setUploadError(null);
  };

  return {
    uploading,
    progress,
    uploadError,
    uploadFile,
    cancelUpload,
    resetUpload
  };
};