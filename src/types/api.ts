// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
  };
}

// -----------------------------
// Pagination Types
// -----------------------------

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
}





// Base pagination request parameters
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// Common filter parameters
export interface FilterParams {
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// Combined pagination and filter parameters
export interface PaginatedFilterParams extends PaginationParams, FilterParams {}

// -----------------------------
// User Related Types
// -----------------------------

export interface UserStats {
  pillars_count: number;
  leaders_count: number;
  families_count: number;
  voters_count: number;
  entities_count: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  user_type: string;
  phone: string | null;
  address: string | null;
  district: any; // يمكنك تعديل هذا لاحقًا
  office: any;   // يمكن تعديله لاحقًا
  group: any;
  governorate: any;
  is_active: boolean;
  max_devices: number;
  last_login_at: string;
  created_at: string;
  stats: UserStats;
}

// -----------------------------
// Permissions
// -----------------------------

export interface ActionPermission {
  action: string; // مثل create, read, etc.
}

export interface ResourcePermission {
  resource: string;
  resource_ar: string;
  permissions: ActionPermission[];
}

// -----------------------------
// Session Info
// -----------------------------

export interface DeviceInfo {
  device: string;
  browser: string;
}

export interface SessionInfo {
  id: string;
  ip_address: string;
  user_agent: string;
  login_at: string;
  expires_in_minutes: number;
  device_info: DeviceInfo;
}

// -----------------------------
// Login Response
// -----------------------------

export interface SigninRequest {
  phone_number: string;
  password: string;
}

export interface SigninResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  session_id: string;
  user: User;
  permissions: ResourcePermission[];
  session_info: SessionInfo;
}

export interface SigninResponse extends ApiResponse<SigninResponseData> {}