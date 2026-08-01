export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
