export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
    timestamp: string;
    pagination?: PaginationInfo;
  }
  
  export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
  }