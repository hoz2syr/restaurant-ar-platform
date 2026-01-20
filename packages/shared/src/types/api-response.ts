// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  messageAr?: string;
  details?: Record<string, any>;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Generic List Response
export interface ListResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Success Response Helper
export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ResponseMeta>
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

// Error Response Helper
export function createErrorResponse(
  code: string,
  message: string,
  messageAr?: string,
  details?: Record<string, any>
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      messageAr,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}
