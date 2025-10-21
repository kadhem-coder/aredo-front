import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات
export interface NewsType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  news_count: number;
}

// Request Types
export interface CreateNewsTypeRequest {
  name: string;
  description?: string;
  color: string;
  is_active?: boolean;
}

export interface UpdateNewsTypeRequest {
  name?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

export interface GetNewsTypesRequest {
  page?: number;
  page_size?: number;
  search?: string; // البحث في الاسم والوصف
  ordering?: string; // ترتيب النتائج (name, -name, created_at, -created_at, etc.)
  is_active?: boolean; // تصفية حسب الحالة النشطة
}

// Response Types
interface NewsTypesListResponse extends ApiResponse {
  results: NewsType[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface NewsTypeResponse extends ApiResponse {
  data: NewsType;
}

interface CreateNewsTypeResponse extends ApiResponse {
  data: NewsType;
}

interface UpdateNewsTypeResponse extends ApiResponse {
  data: NewsType;
}

interface DeleteNewsTypeResponse extends ApiResponse {}

export const newsTypesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /newstype/ - قائمة تصنيفات الأخبار
    getNewsTypes: build.query<NewsTypesListResponse, GetNewsTypesRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        const searchParams: any = {
          page: queryParams.page || 1,
          page_size: queryParams.page_size || 10,
        };

        // إضافة filters إضافية
        if (queryParams.search) searchParams.search = queryParams.search;
        if (queryParams.ordering) searchParams.ordering = queryParams.ordering;
        if (queryParams.is_active !== undefined) searchParams.is_active = queryParams.is_active;

        return {
          url: "newstype/",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["NewsTypes"],
    }),

    // GET /newstype/{id}/ - الحصول على تصنيف محدد
    getNewsType: build.query<NewsType, string>({
      query: (id: string) => ({
        url: `newstype/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "NewsTypes", id }],
    }),

    // POST /newstype/ - إنشاء تصنيف جديد
    createNewsType: build.mutation<CreateNewsTypeResponse, CreateNewsTypeRequest>({
      query: (body: CreateNewsTypeRequest) => ({
        url: "newstype/",
        method: "POST",
        credentials: "same-origin",
        body,
      }),
      invalidatesTags: ["NewsTypes"],
    }),

    // PATCH /newstype/{id}/ - تحديث تصنيف جزئي
    updateNewsType: build.mutation<UpdateNewsTypeResponse, { id: string; data: UpdateNewsTypeRequest }>({
      query: ({ id, data }) => ({
        url: `newstype/${id}/`,
        method: "PATCH",
        credentials: "same-origin",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "NewsTypes",
        { type: "NewsTypes", id },
      ],
    }),

    // PUT /newstype/{id}/ - تحديث تصنيف كامل
    replaceNewsType: build.mutation<UpdateNewsTypeResponse, { id: string; data: CreateNewsTypeRequest }>({
      query: ({ id, data }) => ({
        url: `newstype/${id}/`,
        method: "PUT",
        credentials: "same-origin",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "NewsTypes",
        { type: "NewsTypes", id },
      ],
    }),

    // DELETE /newstype/{id}/ - حذف تصنيف
    deleteNewsType: build.mutation<DeleteNewsTypeResponse, string>({
      query: (id: string) => ({
        url: `newstype/${id}/`,
        method: "DELETE",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "NewsTypes",
        { type: "NewsTypes", id },
      ],
    }),

    // GET /newstype/active/ - الحصول على التصنيفات النشطة فقط
    getActiveNewsTypes: build.query<NewsTypesListResponse, GetNewsTypesRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "newstype/",
          method: "GET",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 50,
            is_active: true,
            ordering: queryParams.ordering || "name",
            ...(queryParams.search && { search: queryParams.search }),
          },
        };
      },
      providesTags: ["NewsTypes"],
    }),

    // GET /newstype/statistics/ - إحصائيات التصنيفات
    getNewsTypesStatistics: build.query<{
      total_count: number;
      active_count: number;
      inactive_count: number;
      total_news_count: number;
      most_used_category: {
        id: string;
        name: string;
        news_count: number;
      } | null;
    }, void>({
      query: () => ({
        url: "newstype/statistics/",
        method: "GET",
      }),
      providesTags: ["NewsTypes"],
    }),

    // POST /newstype/{id}/toggle-active/ - تفعيل/إلغاء تفعيل تصنيف
    toggleNewsTypeActive: build.mutation<UpdateNewsTypeResponse, string>({
      query: (id: string) => ({
        url: `newstype/${id}/toggle-active/`,
        method: "POST",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "NewsTypes",
        { type: "NewsTypes", id },
      ],
    }),

    // GET /newstype/search/ - البحث المتقدم في التصنيفات
    searchNewsTypes: build.query<NewsTypesListResponse, { 
      query: string; 
      filters?: {
        is_active?: boolean;
        has_news?: boolean;
        color?: string;
      };
      page?: number;
      page_size?: number;
    }>({
      query: ({ query: searchQuery, filters, page, page_size }) => {
        const params: any = {
          search: searchQuery,
          page: page || 1,
          page_size: page_size || 10,
        };

        if (filters) {
          if (filters.is_active !== undefined) params.is_active = filters.is_active;
          if (filters.has_news !== undefined) params.has_news = filters.has_news;
          if (filters.color) params.color = filters.color;
        }

        return {
          url: "newstype/search/",
          method: "GET",
          params,
        };
      },
      providesTags: ["NewsTypes"],
    }),

    // POST /newstype/bulk-update/ - تحديث متعدد للتصنيفات
    bulkUpdateNewsTypes: build.mutation<{
      updated_count: number;
      updated_items: NewsType[];
    }, {
      ids: string[];
      data: UpdateNewsTypeRequest;
    }>({
      query: ({ ids, data }) => ({
        url: "newstype/bulk-update/",
        method: "POST",
        credentials: "same-origin",
        body: {
          ids,
          ...data,
        },
      }),
      invalidatesTags: ["NewsTypes"],
    }),

    // DELETE /newstype/bulk-delete/ - حذف متعدد للتصنيفات
    bulkDeleteNewsTypes: build.mutation<{
      deleted_count: number;
      deleted_ids: string[];
    }, string[]>({
      query: (ids: string[]) => ({
        url: "newstype/bulk-delete/",
        method: "DELETE",
        credentials: "same-origin",
        body: { ids },
      }),
      invalidatesTags: ["NewsTypes"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetNewsTypesQuery,
  useGetNewsTypeQuery,
  useCreateNewsTypeMutation,
  useUpdateNewsTypeMutation,
  useReplaceNewsTypeMutation,
  useDeleteNewsTypeMutation,
  useGetActiveNewsTypesQuery,
  useGetNewsTypesStatisticsQuery,
  useToggleNewsTypeActiveMutation,
  useSearchNewsTypesQuery,
  useBulkUpdateNewsTypesMutation,
  useBulkDeleteNewsTypesMutation,
  useLazyGetNewsTypesQuery,
  useLazyGetNewsTypeQuery,
  useLazyGetActiveNewsTypesQuery,
  useLazyGetNewsTypesStatisticsQuery,
  useLazySearchNewsTypesQuery,
} = newsTypesApi;

