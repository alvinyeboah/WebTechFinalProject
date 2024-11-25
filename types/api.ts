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
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}
export interface ApiResponse<T> {
  status: number;
  timestamp: string;
  data: T;
  error?: string;
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiErrorResponse extends ApiResponse<null> {
  data: null;
  error: string;
}

export type ApiResponseType<T> = ApiSuccessResponse<T> | ApiErrorResponse;
