import { api } from "./api";
import { ApiResponse } from "../types/api";

// Types للبيانات - تحديث FormKind ليطابق الاستجابة الفعلية
export interface FormKind {
  // الحقول الأساسية
  id: string;
  name: string;
  manager: string;
  phonefield: string; // تغيير من phone إلى phonefield
  description?: string;
  is_active: boolean;
  requires_university: boolean;
  requires_file_upload: boolean;
  icon: string;
  
  // حقول متطلبات النموذج (boolean fields)
  university: boolean;
  full_name: boolean;
  email: boolean;
  notes: boolean;
  department: boolean;
  fees: boolean;
  degreenum: boolean;
  passport: boolean;
  degree: boolean;
  deepdepartment: boolean;
  grad_univerBach: boolean;
  grad_univermaster: boolean;
  traker: boolean;
  pdf: boolean;
  address: boolean;
  nearestPoint: boolean;
  govern: boolean;
  by: boolean;
  pages: boolean;
  magazine: boolean;
  mushref: boolean;
  publishResearch: boolean;
  stilal: boolean;
  international: boolean;
  univerFees: boolean;
  kind_fees: boolean;
  touch: boolean;
  submitted: boolean;
  approved: boolean;
  accepted: boolean;
  received: boolean;
  payoff: boolean;
  date_applied: boolean;
  date: boolean;
  
  // حقول القراءة فقط
  applications_count: string;
  field_requirements: any; // تغيير من string إلى any لأنه object
  created_at: string;
  updated_at: string;
}

// Request Types للإنشاء
export interface CreateFormKindRequest {
  // الحقول المطلوبة
  name: string;
  manager: string;
  phonefield: string; // تغيير من phone إلى phonefield
  is_active: boolean;
  requires_university: boolean;
  requires_file_upload: boolean;
  icon: string;
  
  // حقول اختيارية
  description?: string;
  university?: boolean;
  full_name?: boolean;
  email?: boolean;
  notes?: boolean;
  department?: boolean;
  fees?: boolean;
  degreenum?: boolean;
  passport?: boolean;
  degree?: boolean;
  deepdepartment?: boolean;
  grad_univerBach?: boolean;
  grad_univermaster?: boolean;
  traker?: boolean;
  pdf?: boolean;
  address?: boolean;
  nearestPoint?: boolean;
  govern?: boolean;
  by?: boolean;
  pages?: boolean;
  magazine?: boolean;
  mushref?: boolean;
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  univerFees?: boolean;
  kind_fees?: boolean;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;
  date_applied?: boolean;
  date?: boolean;
}

// Request Types للتحديث (كل الحقول اختيارية)
export interface UpdateFormKindRequest {
  name?: string;
  manager?: string;
  phonefield?: string; // تغيير من phone إلى phonefield
  description?: string;
  is_active?: boolean;
  requires_university?: boolean;
  requires_file_upload?: boolean;
  icon?: string;
  
  university?: boolean;
  full_name?: boolean;
  email?: boolean;
  notes?: boolean;
  department?: boolean;
  fees?: boolean;
  degreenum?: boolean;
  passport?: boolean;
  degree?: boolean;
  deepdepartment?: boolean;
  grad_univerBach?: boolean;
  grad_univermaster?: boolean;
  traker?: boolean;
  pdf?: boolean;
  address?: boolean;
  nearestPoint?: boolean;
  govern?: boolean;
  by?: boolean;
  pages?: boolean;
  magazine?: boolean;
  mushref?: boolean;
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  univerFees?: boolean;
  kind_fees?: boolean;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;
  date_applied?: boolean;
  date?: boolean;
}

export interface GetFormKindsRequest {
  page?: number;
  page_size?: number;
}

// Response Types
interface PaginatedData {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: FormKind[];
}

interface FormKindsListResponse extends ApiResponse {
  data: PaginatedData;
}

interface FormKindResponse extends ApiResponse {
  data: FormKind;
}

interface CreateFormKindResponse extends ApiResponse {
  data: FormKind;
}

interface UpdateFormKindResponse extends ApiResponse {
  data: FormKind;
}

interface DeleteFormKindResponse extends ApiResponse {}

interface ToggleFormKindStatusResponse extends ApiResponse {
  data: FormKind;
}

export const formKindsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /form-kinds/ - قائمة أنواع الاستمارات
    getFormKinds: build.query<FormKindsListResponse, GetFormKindsRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "form-kinds/",
          method: "GET",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 10,
          },
        };
      },
      providesTags: ["FormKinds"],
    }),

    // GET /form-kinds/{id}/ - الحصول على نوع استمارة محدد
    getFormKind: build.query<FormKindResponse, string>({
      query: (id: string) => ({
        url: `form-kinds/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "FormKinds", id }],
    }),

    // POST /form-kinds/ - إنشاء نوع استمارة جديد
    createFormKind: build.mutation<CreateFormKindResponse, CreateFormKindRequest>({
      query: (body: CreateFormKindRequest) => {
        // تحويل البيانات إلى FormData
        const formData = new FormData();
        
        // إضافة جميع الحقول إلى FormData
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // تحويل boolean إلى string
            formData.append(key, String(value));
          }
        });

        return {
          url: "form-kinds/",
          method: "POST",
          body: formData,
          // لا تضع Content-Type هنا، دع المتصفح يضعه تلقائياً مع boundary
        };
      },
      invalidatesTags: ["FormKinds"],
    }),

    // PATCH /form-kinds/{id}/ - تحديث نوع استمارة جزئي
    updateFormKind: build.mutation<UpdateFormKindResponse, { id: string; data: UpdateFormKindRequest }>({
      query: ({ id, data }) => {
        // تحويل البيانات إلى FormData
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        return {
          url: `form-kinds/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "FormKinds",
        { type: "FormKinds", id },
      ],
    }),

    // PUT /form-kinds/{id}/ - تحديث نوع استمارة كامل
    replaceFormKind: build.mutation<UpdateFormKindResponse, { id: string; data: CreateFormKindRequest }>({
      query: ({ id, data }) => {
        // تحويل البيانات إلى FormData
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        return {
          url: `form-kinds/${id}/`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "FormKinds",
        { type: "FormKinds", id },
      ],
    }),

    // DELETE /form-kinds/{id}/ - حذف نوع استمارة
    deleteFormKind: build.mutation<DeleteFormKindResponse, string>({
      query: (id: string) => ({
        url: `form-kinds/${id}/`,
        method: "DELETE",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "FormKinds",
        { type: "FormKinds", id },
      ],
    }),

    // GET /form-kinds/active/ - الحصول على أنواع الاستمارات النشطة فقط
    getActiveFormKinds: build.query<FormKindsListResponse, GetFormKindsRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "form-kinds/active/",
          method: "GET",
          params: {
            page: queryParams.page || 1,
            page_size: queryParams.page_size || 10,
          },
        };
      },
      providesTags: ["FormKinds"],
    }),

    // PATCH /form-kinds/{id}/toggle-status/ - تبديل حالة النشاط
    toggleFormKindStatus: build.mutation<ToggleFormKindStatusResponse, string>({
      query: (id: string) => ({
        url: `form-kinds/${id}/toggle-status/`,
        method: "PATCH",
        credentials: "same-origin",
      }),
      invalidatesTags: (result, error, id) => [
        "FormKinds",
        { type: "FormKinds", id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetFormKindsQuery,
  useGetFormKindQuery,
  useCreateFormKindMutation,
  useUpdateFormKindMutation,
  useReplaceFormKindMutation,
  useDeleteFormKindMutation,
  useGetActiveFormKindsQuery,
  useToggleFormKindStatusMutation,
  useLazyGetFormKindsQuery,
  useLazyGetFormKindQuery,
  useLazyGetActiveFormKindsQuery,
} = formKindsApi;

// Export endpoints for direct access
export const {
  getFormKinds,
  getFormKind,
  createFormKind,
  updateFormKind,
  replaceFormKind,
  deleteFormKind,
  getActiveFormKinds,
  toggleFormKindStatus,
} = formKindsApi.endpoints;

// Helper functions for common operations
export const formKindsHelpers = {
  // تحقق من صحة بيانات نوع الاستمارة
  validateFormKindData: (data: Partial<CreateFormKindRequest>): string[] => {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push("اسم نوع الاستمارة مطلوب");
    }

    if (data.name && (data.name.length < 1 || data.name.length > 30)) {
      errors.push("اسم نوع الاستمارة يجب أن يكون بين 1 و 30 حرف");
    }

    if (!data.manager || data.manager.trim().length === 0) {
      errors.push("اسم المدير مطلوب");
    }

    if (data.manager && (data.manager.length < 1 || data.manager.length > 100)) {
      errors.push("اسم المدير يجب أن يكون بين 1 و 100 حرف");
    }

    if (!data.phonefield || data.phonefield.trim().length === 0) {
      errors.push("رقم الهاتف مطلوب");
    }

    if (!data.icon || data.icon.trim().length === 0) {
      errors.push("أيقونة نوع الاستمارة مطلوبة");
    }

    if (data.icon && data.icon.length > 50) {
      errors.push("اسم الأيقونة يجب أن يكون أقل من 50 حرف");
    }

    return errors;
  },

  // إنشاء بيانات افتراضية لنوع استمارة جديد
  createDefaultFormKind: (): Partial<CreateFormKindRequest> => ({
    name: "",
    manager: "",
    phonefield: "",
    description: "",
    is_active: true,
    requires_university: false,
    requires_file_upload: false,
    icon: "document",
    
    // القيم الافتراضية للحقول الإضافية
    university: false,
    full_name: false,
    email: false,
    notes: false,
    department: false,
    fees: false,
    degreenum: false,
    passport: false,
    degree: false,
    deepdepartment: false,
    grad_univerBach: false,
    grad_univermaster: false,
    traker: false,
    pdf: false,
    address: false,
    nearestPoint: false,
    govern: false,
    by: false,
    pages: false,
    magazine: false,
    mushref: false,
    publishResearch: false,
    stilal: false,
    international: false,
    univerFees: false,
    kind_fees: false,
    touch: false,
    submitted: false,
    approved: false,
    accepted: false,
    received: false,
    payoff: false,
    date_applied: false,
    date: false,
  }),

  // تنسيق بيانات العرض
  formatFormKindForDisplay: (formKind: FormKind) => ({
    ...formKind,
    displayName: `${formKind.name} - ${formKind.manager}`,
    statusText: formKind.is_active ? "نشط" : "غير نشط",
    requirementsText: [
      formKind.requires_university ? "يتطلب جامعة" : null,
      formKind.requires_file_upload ? "يتطلب رفع ملف" : null,
    ].filter(Boolean).join(" | ") || "لا توجد متطلبات خاصة",
    descriptionText: formKind.description || "لا يوجد وصف متاح",
    applicationsCountText: `${formKind.applications_count} طلب`,
    fieldRequirementsText: typeof formKind.field_requirements === 'object' && formKind.field_requirements !== null 
      ? JSON.stringify(formKind.field_requirements) 
      : (formKind.field_requirements || "لا توجد متطلبات حقول"),
  }),

  // الحصول على الحقول المطلوبة النشطة
  getActiveFields: (formKind: FormKind): string[] => {
    const fieldMap: Record<string, string> = {
      university: "الجامعة",
      full_name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      notes: "الملاحظات",
      department: "القسم",
      fees: "الرسوم",
      degreenum: "رقم الشهادة",
      passport: "جواز السفر",
      degree: "الشهادة",
      deepdepartment: "القسم الفرعي",
      grad_univerBach: "جامعة التخرج - بكالوريوس",
      grad_univermaster: "جامعة التخرج - ماجستير",
      traker: "المتابع",
      pdf: "PDF",
      address: "العنوان",
      nearestPoint: "أقرب نقطة",
      govern: "المحافظة",
      by: "بواسطة",
      pages: "الصفحات",
      magazine: "المجلة",
      mushref: "المشرف",
      publishResearch: "نشر البحث",
      stilal: "استلال",
      international: "دولي",
      univerFees: "رسوم الجامعة",
      kind_fees: "نوع الرسوم",
      touch: "التواصل",
      submitted: "مُقدَّم",
      approved: "موافق عليه",
      accepted: "مقبول",
      received: "مستلم",
      payoff: "الدفع",
      date_applied: "تاريخ التقديم",
      date: "التاريخ",
    };

    const activeFields: string[] = [];
    
    for (const [key, label] of Object.entries(fieldMap)) {
      if (formKind[key as keyof FormKind] === true) {
        activeFields.push(label);
      }
    }
    
    return activeFields;
  },
};