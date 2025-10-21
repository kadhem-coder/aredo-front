import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات
export interface User {
  id: string;
  phone_number: string;
  name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Request Types
export interface CreateUserRequest {
  phone_number: string;
  name: string;
  password: string;
  password_confirm: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface RegisterUserRequest {
  phone_number: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
}

export interface GetUsersRequest {
  page?: number;
  page_size?: number;
}

// Response Types
interface UsersListResponse extends ApiResponse {
  results: User[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface UserResponse extends ApiResponse {
  data: User;
}

interface CreateUserResponse extends ApiResponse {
  data: User;
}

interface UpdateUserResponse extends ApiResponse {
  data: User;
}

interface DeleteUserResponse extends ApiResponse {}

interface ToggleStatusResponse extends ApiResponse {
  message?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // POST /register/ - تسجيل مستخدم جديد
    registerUser: build.mutation<CreateUserResponse, RegisterUserRequest>({
      query: (body: RegisterUserRequest) => ({
        url: "register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // GET /admin/users/ - قائمة المستخدمين (للمشرفين فقط)
    getAdminUsers: build.query<UsersListResponse, GetUsersRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "admin/users/",
          method: "GET",
          credentials: "same-origin",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 10,
          },
        };
      },
      providesTags: ["Users"],
    }),

    // GET /admin/users/{id}/ - الحصول على مستخدم محدد (للمشرفين فقط)
    getAdminUser: build.query<UserResponse, string>({
      query: (id: string) => ({
        url: `admin/users/${id}/`,
        method: "GET",
        credentials: "same-origin",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // POST /admin/users/create/ - إنشاء مستخدم جديد (للمشرفين فقط)
    createAdminUser: build.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body: CreateUserRequest) => ({
        url: "admin/users/create/",
        method: "POST",
        credentials: "same-origin",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // PATCH /admin/users/{id}/update/ - تحديث بيانات المستخدم (للمشرفين فقط)
    updateAdminUser: build.mutation<UpdateUserResponse, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `admin/users/${id}/update/`,
        method: "PATCH",
        credentials: "same-origin",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Users",
        { type: "Users", id },
      ],
    }),

    // POST /admin/users/{user_id}/toggle-status/ - تغيير حالة المستخدم النشط (للمشرفين فقط)
    toggleUserStatus: build.mutation<ToggleStatusResponse, string>({
      query: (user_id: string) => ({
        url: `admin/users/${user_id}/toggle-status/`,
        method: "POST",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, user_id) => [
        "Users",
        { type: "Users", id: user_id },
      ],
    }),

    // DELETE /admin/users/{id}/ - حذف مستخدم (إضافي - إذا كان متوفر في API)
    deleteAdminUser: build.mutation<DeleteUserResponse, string>({
      query: (id: string) => ({
        url: `admin/users/${id}/`,
        method: "DELETE",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "Users",
        { type: "Users", id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterUserMutation,
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useToggleUserStatusMutation,
  useDeleteAdminUserMutation,
  useLazyGetAdminUsersQuery,
  useLazyGetAdminUserQuery,
} = usersApi;

// Export endpoints for direct access
export const {
  registerUser,
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  toggleUserStatus,
  deleteAdminUser,
} = usersApi.endpoints;