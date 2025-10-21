import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات - طلبات التقديم
export interface ApplicationForm {
  id: string;
  kind: string;
  kind_display: string;
  kind_name: string;
  user: string;
  university: string | null;
  university_name: string;
  full_name: string;
  email: string;
  phone: string;
  degreenum: string;
  passport: string;
  degree: 'bachelor' | 'master' | 'phd';
  department: string;
  deepdepartment: string;
  grad_univerBach: string;
  grad_univermaster: string;
  traker: string;
  pdf: string | null;
  fees: string;
  touch: boolean;
  submitted: boolean;
  approved: boolean;
  accepted: boolean;
  received: boolean;
  payoff: boolean;
  date_applied: string;
  date: string;
  updated_at: string;
  completion_percentage: string;
  is_editable: boolean;
  status_display: string;
  images: ApplicationImage[];
  images_count: number;
}

// نوع مبسط للقوائم
export interface ApplicationFormPartial {
  id: string;
  kind: string;
  kind_display: string;
  kind_name: string;
  user: string;
  university: string | null;
  university_name: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  fees: string;
  status_display: string;
  completion_percentage: string;
  is_editable: boolean;
  touch: boolean;
  submitted: boolean;
  approved: boolean;
  accepted: boolean;
  received: boolean;
  payoff: boolean;
  date_applied: string;
  date: string;
  updated_at: string;
}

// نوع صورة الطلب
export interface ApplicationImage {
  id: number;
  form: string;
  image: string;
  image_url: string;
  image_type: 'passport' | 'certificate' | 'document' | 'transcript' | 'photo' | 'other';
  description: string;
  uploaded_at: string;
  file_size: number;
  file_size_mb: number;
  width: number;
  height: number;
  order: number;
  is_active: boolean;
}

// Request Types للطلبات
export interface CreateApplicationFormRequest {
  kind: string;
  university?: string;
  full_name: string;
  email: string;
  phone: string;
  degreenum?: string;
  passport?: string;
  degree?: 'bachelor' | 'master' | 'phd';
  department?: string;
  deepdepartment?: string;
  grad_univerBach?: string;
  grad_univermaster?: string;
  traker?: string;
  fees?: string;
  pdf?: File;
}

export interface UpdateApplicationFormRequest {
  kind?: string;
  university?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  degreenum?: string;
  passport?: string;
  degree?: 'bachelor' | 'master' | 'phd';
  department?: string;
  deepdepartment?: string;
  grad_univerBach?: string;
  grad_univermaster?: string;
  traker?: string;
  fees?: string;
  pdf?: File;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;
}

export interface GetApplicationFormsRequest {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

// Response Types
interface ApplicationFormListResponse extends ApiResponse {
  results: ApplicationFormPartial[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface ApplicationFormResponse extends ApiResponse {
  data: ApplicationForm;
}

interface CreateApplicationFormResponse extends ApiResponse {
  data: ApplicationForm;
}

interface UpdateApplicationFormResponse extends ApiResponse {
  data: ApplicationForm;
}

interface DeleteApplicationFormResponse extends ApiResponse {}

export const applicationFormsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /forms/ - قائمة طلبات التقديم
    getApplicationForms: build.query<ApplicationFormListResponse, GetApplicationFormsRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        const searchParams: any = {
          page: queryParams.page || 1,
          page_size: queryParams.page_size || 10,
        };

        if (queryParams.search) searchParams.search = queryParams.search;
        if (queryParams.ordering) searchParams.ordering = queryParams.ordering;

        return {
          url: "forms/",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["ApplicationForms"],
    }),

    // GET /forms/{id}/ - الحصول على طلب محدد
    getApplicationFormById: build.query<ApplicationFormResponse, string>({
      query: (id: string) => ({
        url: `forms/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ApplicationForms", id }],
    }),

    // POST - إنشاء طلب جديد (يختار endpoint حسب النوع)
    createApplicationForm: build.mutation<CreateApplicationFormResponse, CreateApplicationFormRequest>({
      query: (body: CreateApplicationFormRequest) => {
        const formData = new FormData();
        
        // الحقول الأساسية المطلوبة لجميع الأنواع
        formData.append('kind', body.kind);
        formData.append('full_name', body.full_name);
        formData.append('phone', body.phone);
        
        // تحديد endpoint حسب نوع الاستمارة
        let endpoint = "forms/applicant/"; // default
        
        switch (body.kind) {
          case 'applicant':
            endpoint = "forms/applicant/";
            // حقول إضافية للطلبات الأكاديمية
            formData.append('email', body.email);
            if (body.university) formData.append('university', body.university);
            if (body.degreenum) formData.append('degreenum', body.degreenum);
            if (body.passport) formData.append('passport', body.passport);
            if (body.degree) formData.append('degree', body.degree);
            if (body.department) formData.append('department', body.department);
            if (body.deepdepartment) formData.append('deepdepartment', body.deepdepartment);
            if (body.grad_univerBach) formData.append('grad_univerBach', body.grad_univerBach);
            if (body.grad_univermaster) formData.append('grad_univermaster', body.grad_univermaster);
            if (body.traker) formData.append('traker', body.traker);
            if (body.fees) formData.append('fees', body.fees);
            if (body.pdf) formData.append('pdf', body.pdf);
            break;
            
          case 'cancelcode':
            endpoint = "forms/cancelcode/";
            // حقول أساسية فقط لكود الإلغاء
            formData.append('email', body.email);
            if (body.university) formData.append('university', body.university);
            break;
            
          case 'delivery':
            endpoint = "forms/delvary/"; // حسب API الموجود
            // حقول أساسية فقط للتوصيل
            break;
            
          case 'translate':
            endpoint = "forms/translate/"; // إذا كان موجود
            // أو استخدم endpoint عام
            formData.append('email', body.email);
            if (body.pdf) formData.append('pdf', body.pdf);
            break;
            
          default:
            // استخدم endpoint عام أو applicant كـ fallback
            endpoint = "forms/applicant/";
            formData.append('email', body.email);
            if (body.university) formData.append('university', body.university);
            break;
        }

        return {
          url: endpoint,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ApplicationForms"],
    }),

    // PATCH /forms/{id}/ - تحديث طلب جزئي
    updateApplicationForm: build.mutation<UpdateApplicationFormResponse, { id: string; data: UpdateApplicationFormRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        
        if (data.kind) formData.append('kind', data.kind);
        if (data.university) formData.append('university', data.university);
        if (data.full_name) formData.append('full_name', data.full_name);
        if (data.email) formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);
        if (data.degreenum) formData.append('degreenum', data.degreenum);
        if (data.passport) formData.append('passport', data.passport);
        if (data.degree) formData.append('degree', data.degree);
        if (data.department) formData.append('department', data.department);
        if (data.deepdepartment) formData.append('deepdepartment', data.deepdepartment);
        if (data.grad_univerBach) formData.append('grad_univerBach', data.grad_univerBach);
        if (data.grad_univermaster) formData.append('grad_univermaster', data.grad_univermaster);
        if (data.traker) formData.append('traker', data.traker);
        if (data.fees) formData.append('fees', data.fees);
        if (data.pdf) formData.append('pdf', data.pdf);
        if (data.touch !== undefined) formData.append('touch', data.touch.toString());
        if (data.submitted !== undefined) formData.append('submitted', data.submitted.toString());
        if (data.approved !== undefined) formData.append('approved', data.approved.toString());
        if (data.accepted !== undefined) formData.append('accepted', data.accepted.toString());
        if (data.received !== undefined) formData.append('received', data.received.toString());
        if (data.payoff !== undefined) formData.append('payoff', data.payoff.toString());

        return {
          url: `forms/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "ApplicationForms",
        { type: "ApplicationForms", id },
      ],
    }),

    // DELETE /forms/{id}/ - حذف طلب
    deleteApplicationForm: build.mutation<DeleteApplicationFormResponse, string>({
      query: (id: string) => ({
        url: `forms/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "ApplicationForms",
        { type: "ApplicationForms", id },
      ],
    }),

    // POST /forms/cancelcode/ - إنشاء كود إلغاء مباشرة
    createCancelCode: build.mutation<any, CreateApplicationFormRequest>({
      query: (body: CreateApplicationFormRequest) => {
        const formData = new FormData();
        formData.append('kind', 'cancelcode');
        formData.append('full_name', body.full_name);
        formData.append('email', body.email);
        formData.append('phone', body.phone);
        
        if (body.university) formData.append('university', body.university);

        return {
          url: "forms/cancelcode/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ApplicationForms"],
    }),

    // POST /forms/delvary/ - إنشاء طلب توصيل مباشرة
    createDeliveryForm: build.mutation<any, CreateApplicationFormRequest>({
      query: (body: CreateApplicationFormRequest) => {
        const formData = new FormData();
        formData.append('kind', 'delivery');
        formData.append('full_name', body.full_name);
        formData.append('phone', body.phone);
        
        return {
          url: "forms/delvary/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ApplicationForms"],
    }),

    // POST /forms/translate/ - إنشاء طلب ترجمة (إذا كان متوفر)
    createTranslateForm: build.mutation<any, CreateApplicationFormRequest>({
      query: (body: CreateApplicationFormRequest) => {
        const formData = new FormData();
        formData.append('kind', 'translate');
        formData.append('full_name', body.full_name);
        formData.append('email', body.email);
        formData.append('phone', body.phone);
        
        if (body.pdf) formData.append('pdf', body.pdf);

        return {
          url: "forms/translate/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ApplicationForms"],
    }),
  }),
});

// Export hooks للاستخدام في المكونات الوظيفية
export const {
  useGetApplicationFormsQuery,
  useGetApplicationFormByIdQuery,
  useCreateApplicationFormMutation,
  useUpdateApplicationFormMutation,
  useDeleteApplicationFormMutation,
  useCreateCancelCodeMutation,
  useCreateDeliveryFormMutation,
  useCreateTranslateFormMutation,
  useLazyGetApplicationFormsQuery,
  useLazyGetApplicationFormByIdQuery,
} = applicationFormsApi;