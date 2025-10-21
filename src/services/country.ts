import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات
export interface Country {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface CreateCountryRequest {
  name: string;
  code: string;
}

export interface UpdateCountryRequest {
  name?: string;
  code?: string;
}

export interface GetCountriesRequest {
  page?: number;
  page_size?: number;
}

// Response Types
interface CountriesListResponse extends ApiResponse {
  results: Country[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface CountryResponse extends ApiResponse {
  data: Country;
}

interface CreateCountryResponse extends ApiResponse {
  data: Country;
}

interface UpdateCountryResponse extends ApiResponse {
  data: Country;
}

interface DeleteCountryResponse extends ApiResponse {}

export const countriesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /countries/ - قائمة الدول
    getCountries: build.query<CountriesListResponse, GetCountriesRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "countries/",
          method: "GET",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 10,
          },
        };
      },
      providesTags: ["Countries"],
    }),

    // GET /countries/{id}/ - الحصول على دولة محددة
    getCountry: build.query<CountryResponse, string>({
      query: (id: string) => ({
        url: `countries/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Countries", id }],
    }),

    // POST /countries/ - إنشاء دولة جديدة
    createCountry: build.mutation<CreateCountryResponse, CreateCountryRequest>({
      query: (body: CreateCountryRequest) => ({
        url: "countries/",
        method: "POST",
        credentials: "same-origin",
        body,
      }),
      invalidatesTags: ["Countries"],
    }),

    // PATCH /countries/{id}/ - تحديث دولة جزئي
    updateCountry: build.mutation<UpdateCountryResponse, { id: string; data: UpdateCountryRequest }>({
      query: ({ id, data }) => ({
        url: `countries/${id}/`,
        method: "PATCH",
        credentials: "same-origin",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Countries",
        { type: "Countries", id },
      ],
    }),

    // PUT /countries/{id}/ - تحديث دولة كامل (إضافي)
    replaceCountry: build.mutation<UpdateCountryResponse, { id: string; data: CreateCountryRequest }>({
      query: ({ id, data }) => ({
        url: `countries/${id}/`,
        method: "PUT",
        credentials: "same-origin",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Countries",
        { type: "Countries", id },
      ],
    }),

    // DELETE /countries/{id}/ - حذف دولة
    deleteCountry: build.mutation<DeleteCountryResponse, string>({
      query: (id: string) => ({
        url: `countries/${id}/`,
        method: "DELETE",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "Countries",
        { type: "Countries", id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetCountriesQuery,
  useGetCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useReplaceCountryMutation,
  useDeleteCountryMutation,
  useLazyGetCountriesQuery,
  useLazyGetCountryQuery,
} = countriesApi;

// Export endpoints for direct access
export const {
  getCountries,
  getCountry,
  createCountry,
  updateCountry,
  replaceCountry,
  deleteCountry,
} = countriesApi.endpoints;