export interface UploadResponse {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    key: string;
  }
  
  export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
  }
  
  export interface UploadError extends Error {
    code: string;
    details?: Record<string, any>;
  }