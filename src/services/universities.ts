import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات
export interface University {
  country_name: string;
  id: string;
  name: string;
  country: string;
  university_type: "public" | "private" | "mixed";
  pdf?: string | null;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface CreateUniversityRequest {
  name: string;
  country: string;
  university_type: "public" | "private" | "mixed";
  pdf?: File | null; // إضافة ملف PDF
}

export interface UpdateUniversityRequest {
  name?: string;
  country?: string;
  university_type?: "public" | "private" | "mixed";
  pdf?: File | null; // إضافة ملف PDF
}

export interface GetUniversitiesRequest {
  page?: number;
  page_size?: number;
  country_id?: string;
  university_type?: "public" | "private" | "mixed";
  search?: string;
}

// Response Types
interface UniversitiesListResponse extends ApiResponse {
  results: University[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface UniversityResponse extends ApiResponse {
  data: University;
}

interface CreateUniversityResponse extends ApiResponse {
  data: University;
}

interface UpdateUniversityResponse extends ApiResponse {
  data: University;
}

interface DeleteUniversityResponse extends ApiResponse {}

export const universitiesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /universities/ - قائمة الجامعات
    getUniversities: build.query<UniversitiesListResponse, GetUniversitiesRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        const searchParams: any = {
          page: queryParams.page || 1,
          page_size: queryParams.page_size || 10,
        };

        // إرسال country_id في الـ query params
        if (queryParams.country_id) searchParams.country_id = queryParams.country_id;
        if (queryParams.university_type) searchParams.university_type = queryParams.university_type;
        if (queryParams.search) searchParams.search = queryParams.search;

        return {
          url: "universities/",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["Universities"],
    }),

    // GET /universities/{id}/ - الحصول على جامعة محددة
    getUniversity: build.query<UniversityResponse, string>({
      query: (id: string) => ({
        url: `universities/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Universities", id }],
    }),

    // POST /universities/ - إنشاء جامعة جديدة
    createUniversity: build.mutation<CreateUniversityResponse, CreateUniversityRequest>({
      query: (body: CreateUniversityRequest) => {
        const formData = new FormData();
        formData.append('name', body.name);
        formData.append('country', body.country);
        formData.append('university_type', body.university_type);
        
        // إضافة ملف PDF إذا كان موجوداً
        if (body.pdf) {
          formData.append('pdf', body.pdf);
        }
        
        return {
          url: "universities/",
          method: "POST",
          credentials: "same-origin",
          body: formData,
        };
      },
      invalidatesTags: ["Universities"],
    }),

    // PATCH /universities/{id}/ - تحديث جامعة جزئي
    updateUniversity: build.mutation<UpdateUniversityResponse, { id: string; data: UpdateUniversityRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        
        if (data.name !== undefined) formData.append('name', data.name);
        if (data.country !== undefined) formData.append('country', data.country);
        if (data.university_type !== undefined) formData.append('university_type', data.university_type);
        
        // إضافة ملف PDF إذا كان موجوداً
        if (data.pdf) {
          formData.append('pdf', data.pdf);
        }
        
        return {
          url: `universities/${id}/`,
          method: "PATCH",
          credentials: "same-origin",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Universities",
        { type: "Universities", id },
      ],
    }),

    // PUT /universities/{id}/ - تحديث جامعة كامل
    replaceUniversity: build.mutation<UpdateUniversityResponse, { id: string; data: CreateUniversityRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('country', data.country);
        formData.append('university_type', data.university_type);
        
        // إضافة ملف PDF إذا كان موجوداً
        if (data.pdf) {
          formData.append('pdf', data.pdf);
        }
        
        return {
          url: `universities/${id}/`,
          method: "PUT",
          credentials: "same-origin",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Universities",
        { type: "Universities", id },
      ],
    }),

    // DELETE /universities/{id}/ - حذف جامعة
    deleteUniversity: build.mutation<DeleteUniversityResponse, string>({
      query: (id: string) => ({
        url: `universities/${id}/`,
        method: "DELETE",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "Universities",
        { type: "Universities", id },
      ],
    }),

    // GET /universities/by-country/{countryId}/ - الحصول على جامعات دولة معينة
    getUniversitiesByCountry: build.query<UniversitiesListResponse, { countryId: string; params?: GetUniversitiesRequest }>({
      query: ({ countryId, params }) => {
        const queryParams = params || {};
        return {
          url: `universities/`,
          method: "GET",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 10,
            country_id: countryId,
            ...(queryParams.university_type && { university_type: queryParams.university_type }),
            ...(queryParams.search && { search: queryParams.search }),
          },
        };
      },
      providesTags: ["Universities"],
    }),

    // GET /universities/statistics/ - إحصائيات الجامعات (إضافية)
    getUniversitiesStatistics: build.query<{
      total_count: number;
      public_count: number;
      private_count: number;
      mixed_count: number;
      countries_count: number;
    }, void>({
      query: () => ({
        url: "universities/statistics/",
        method: "GET",
      }),
      providesTags: ["Universities"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUniversitiesQuery,
  useGetUniversityQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useReplaceUniversityMutation,
  useDeleteUniversityMutation,
  useGetUniversitiesByCountryQuery,
  useGetUniversitiesStatisticsQuery,
  useLazyGetUniversitiesQuery,
  useLazyGetUniversityQuery,
  useLazyGetUniversitiesByCountryQuery,
  useLazyGetUniversitiesStatisticsQuery,
} = universitiesApi;

// Export endpoints for direct access
export const {
  getUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  replaceUniversity,
  deleteUniversity,
  getUniversitiesByCountry,
  getUniversitiesStatistics,
} = universitiesApi.endpoints;