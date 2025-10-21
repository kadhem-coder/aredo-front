import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات - الأخبار
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  news_type_name: string;
  news_type_id: string;
  news_type: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  images: NewsImage[];
  created_at: string;
  updated_at: string;
  images_count: number;
}
interface NewsResponse extends ApiResponse {
  data: News;  // هنا تتوقع أن البيانات داخل property اسمه data
}
// نوع صورة الخبر
export interface NewsImage {
  id: number;
  news: string;
  image: string;
  image_url: string;
  image_type: 'gallery' | 'inline' | 'thumbnail' | 'banner' | 'infographic' | 'other';
  title: string;
  caption: string;
  order: number;
  is_active: boolean;
  uploaded_at: string;
}


// Request Types للأخبار
export interface CreateNewsRequest {
  title: string;
  content: string;
  news_type_id: string;
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
  news_type_id?: string;
}

export interface GetNewsRequest {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  news_type_id?: string;
}

// Request Types لصور الأخبار
export interface CreateNewsImageRequest {
  news: string;
  image: File;
  image_type?: 'gallery' | 'inline' | 'thumbnail' | 'banner' | 'infographic' | 'other';
  title?: string;
  caption?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateNewsImageRequest {
  image_type?: 'gallery' | 'inline' | 'thumbnail' | 'banner' | 'infographic' | 'other';
  title?: string;
  caption?: string;
  order?: number;
  is_active?: boolean;
}

// Response Types
interface NewsListResponse extends ApiResponse {
  results: News[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface NewsResponse extends ApiResponse {
  data: News;
}

interface CreateNewsResponse extends ApiResponse {
  data: News;
}

interface UpdateNewsResponse extends ApiResponse {
  data: News;
}

interface DeleteNewsResponse extends ApiResponse {}

interface NewsImageResponse extends ApiResponse {
  data: NewsImage;
}

interface CreateNewsImageResponse extends ApiResponse {
  data: NewsImage;
}

interface UpdateNewsImageResponse extends ApiResponse {
  data: NewsImage;
}

interface DeleteNewsImageResponse extends ApiResponse {}

interface NewsImagesListResponse extends ApiResponse {
  results: NewsImage[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const newsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /news/ - قائمة الأخبار
    getNews: build.query<NewsListResponse, GetNewsRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        const searchParams: any = {
          page: queryParams.page || 1,
          page_size: queryParams.page_size || 10,
        };

        if (queryParams.search) searchParams.search = queryParams.search;
        if (queryParams.ordering) searchParams.ordering = queryParams.ordering;
        if (queryParams.news_type_id) searchParams.news_type_id = queryParams.news_type_id;

        return {
          url: "news/",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["News"],
    }),

    // GET /news/{id}/ - الحصول على خبر محدد
    getNewsById: build.query<NewsResponse, string>({
      query: (id: string) => ({
        url: `news/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "News", id }],
    }),

    // POST /news/ - إنشاء خبر جديد
    createNews: build.mutation<any, CreateNewsRequest>({
      query: (body: CreateNewsRequest) => {
        const formData = new FormData();
        formData.append('title', body.title);
        formData.append('content', body.content);
        formData.append('news_type', body.news_type_id);

        return {
          url: "news/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["News"],
    }),

    // PATCH /news/{id}/ - تحديث خبر جزئي
    updateNews: build.mutation<any, { id: string; data: UpdateNewsRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append('title', data.title);
        if (data.content !== undefined) formData.append('content', data.content);
        if (data.news_type_id !== undefined) formData.append('news_type_id', data.news_type_id);

        return {
          url: `news/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "News",
        { type: "News", id },
      ],
    }),

    // PUT /news/{id}/ - تحديث خبر كامل
    replaceNews: build.mutation<any, { id: string; data: CreateNewsRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('news_type_id', data.news_type_id);

        return {
          url: `news/${id}/`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "News",
        { type: "News", id },
      ],
    }),

    // DELETE /news/{id}/ - حذف خبر
    deleteNews: build.mutation<DeleteNewsResponse, string>({
      query: (id: string) => ({
        url: `news/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "News",
        { type: "News", id },
      ],
    }),

    // GET /news/search/ - البحث المتقدم في الأخبار
    searchNews: build.query<NewsListResponse, { 
      query: string; 
      filters?: {
        news_type?: string;
        has_images?: boolean;
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
          if (filters.news_type) params.news_type = filters.news_type;
          if (filters.has_images !== undefined) params.has_images = filters.has_images;
        }

        return {
          url: "news/search/",
          method: "GET",
          params,
        };
      },
      providesTags: ["News"],
    }),

    // POST /news-images/ - رفع صورة جديدة للخبر
    createNewsImage: build.mutation<any, CreateNewsImageRequest>({
      query: (body: CreateNewsImageRequest) => {
        const formData = new FormData();
        formData.append('news', body.news);
        formData.append('image', body.image);
        
        if (body.image_type) formData.append('image_type', body.image_type);
        if (body.title) formData.append('title', body.title);
        if (body.caption) formData.append('caption', body.caption);
        if (body.order !== undefined) formData.append('order', body.order.toString());
        if (body.is_active !== undefined) formData.append('is_active', body.is_active.toString());

        return {
          url: "news-images/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["News", "NewsImages"],
    }),

    // GET /news-images/ - قائمة صور الأخبار
    getNewsImages: build.query<NewsImagesListResponse, {
      news?: string;
      page?: number;
      page_size?: number;
      ordering?: string;
      is_active?: boolean;
    }>({
      query: (params = {}) => {
        const searchParams: any = {
          page: params.page || 1,
          page_size: params.page_size || 10,
        };

        if (params.news) searchParams.news = params.news;
        if (params.ordering) searchParams.ordering = params.ordering;
        if (params.is_active !== undefined) searchParams.is_active = params.is_active;

        return {
          url: "news-images/",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["NewsImages"],
    }),

    // GET /news-images/{id}/ - الحصول على صورة محددة
    getNewsImage: build.query<NewsImage, number>({
      query: (id: number) => ({
        url: `news-images/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "NewsImages", id }],
    }),

    // PATCH /news-images/{id}/ - تحديث صورة خبر جزئي
    updateNewsImage: build.mutation<UpdateNewsImageResponse, { id: number; data: UpdateNewsImageRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        
        if (data.image_type) formData.append('image_type', data.image_type);
        if (data.title !== undefined) formData.append('title', data.title);
        if (data.caption !== undefined) formData.append('caption', data.caption);
        if (data.order !== undefined) formData.append('order', data.order.toString());
        if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());

        return {
          url: `news-images/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "News",
        "NewsImages",
        { type: "NewsImages", id },
      ],
    }),

    // DELETE /news-images/{id}/ - حذف صورة خبر
    deleteNewsImage: build.mutation<DeleteNewsImageResponse, number>({
      query: (id: number) => ({
        url: `news-images/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "News",
        "NewsImages",
        { type: "NewsImages", id },
      ],
    }),

    // POST /news-images/bulk-upload/ - رفع عدة صور دفعة واحدة
    bulkUploadNewsImages: build.mutation<any, {
      news: string;
      images: File[];
      image_type?: 'gallery' | 'inline' | 'thumbnail' | 'banner' | 'infographic' | 'other';
    }>({
      query: (body) => {
        const formData = new FormData();
        formData.append('news', body.news);
        
        body.images.forEach((image, index) => {
          formData.append(`images`, image);
        });
        
        if (body.image_type) formData.append('image_type', body.image_type);

        return {
          url: "news-images/bulk-upload/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["News", "NewsImages"],
    }),

    // POST /news-images/reorder/ - إعادة ترتيب الصور
    reorderNewsImages: build.mutation<any, {
      images: { id: number; order: number }[];
    }>({
      query: (body) => ({
        url: "news-images/reorder/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["News", "NewsImages"],
    }),
  }),
});

// Export hooks للاستخدام في المكونات الوظيفية
export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useReplaceNewsMutation,
  useDeleteNewsMutation,
  useSearchNewsQuery,
  useCreateNewsImageMutation,
  useGetNewsImagesQuery,
  useGetNewsImageQuery,
  useUpdateNewsImageMutation,
  useDeleteNewsImageMutation,
  useBulkUploadNewsImagesMutation,
  useReorderNewsImagesMutation,
  useLazyGetNewsQuery,
  useLazyGetNewsByIdQuery,
  useLazySearchNewsQuery,
  useLazyGetNewsImagesQuery,
} = newsApi;