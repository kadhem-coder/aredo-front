
import { api } from "./api";
import { ApiResponse } from "../types/api";

// ==================== ENUMS & TYPES ====================

// درجة الشهادة
export type DegreeType = "bachelor" | "master" | "phd";

// المحافظات العراقية
export type GovernorateCode =
  | "baghdad"
  | "basra"
  | "nineveh"
  | "erbil"
  | "sulaymaniyah"
  | "duhok"
  | "kirkuk"
  | "diyala"
  | "anbar"
  | "salah_al_din"
  | "najaf"
  | "karbala"
  | "babil"
  | "wasit"
  | "maysan"
  | "dhi_qar"
  | "muthanna"
  | "qadisiyyah"
  | "halabja";

// ==================== MAIN FORM INTERFACE ====================

/**
 * Form Interface - يمثل الاستمارة الكاملة كما تأتي من الـ API
 * جميع الحقول هنا للقراءة فقط من الـ backend
 */
export interface Form {
  // ========== الحقول للقراءة فقط (ReadOnly) ==========
  id: string; // UUID
  pdf: string | null; // URL to uploaded PDF
  date_applied: string; // ISO 8601 datetime
  date: string; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  user: string; // UUID - المستخدم الذي أنشأ الاستمارة

  // ========== حقول العرض المحسوبة من Backend ==========
  kind_display: string; // اسم النوع بالعربي
  kind_name: string; // اسم النوع بالإنجليزي
  status_display: string; // حالة الاستمارة بالعربي
  completion_percentage: string; // نسبة الإكمال كنص
  is_editable: boolean; // هل يمكن تعديل الاستمارة؟
  university_name: string; // اسم الجامعة
  required_fields: string; // JSON string للحقول المطلوبة
  allowed_fields: string; // JSON string للحقول المسموح تعديلها

  // ========== حقول البيانات الأساسية ==========
  full_name: string; // maxLength: 255, minLength: 1
  email: string; // maxLength: 254, minLength: 1, format: email
  phone: string; // maxLength: 255, minLength: 1
  notes?: string; // maxLength: 500, minLength: 1
  department?: string; // maxLength: 255
  fees?: string; // maxLength: 100
  degreenum?: string; // maxLength: 20
  passport?: string; // maxLength: 255
  degree?: DegreeType; // bachelor | master | phd
  deepdepartment?: string; // maxLength: 100
  grad_univerBach?: string; // maxLength: 100
  grad_univermaster?: string; // maxLength: 100
  traker?: string; // maxLength: 255
  address?: string; // maxLength: 255
  nearestPoint?: string; // maxLength: 255
  govern?: GovernorateCode; // enum
  by?: GovernorateCode; // enum
  pages?: string; // maxLength: 255
  magazine?: string; // maxLength: 255
  mushref?: string; // maxLength: 255
  univerFees?: string; // maxLength: 255
  kind_fees?: string; // maxLength: 255

  // ========== حقول Boolean ==========
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;

  // ========== العلاقات (Foreign Keys) ==========
  kind: string; // UUID - نوع الاستمارة (مطلوب)
  university?: string | null; // UUID - الجامعة (اختياري، nullable)
}

// ==================== REQUEST TYPES ====================

/**
 * CreateFormRequest - البيانات المطلوبة لإنشاء استمارة جديدة
 * ملاحظة: الحقول المطلوبة تعتمد على نوع الاستمارة (kind)
 */
export interface CreateFormRequest {
  // ========== الحقل المطلوب ==========
  kind: string; // UUID - مطلوب دائماً

  // ========== حقول البيانات الأساسية ==========
  full_name?: string; // maxLength: 255
  email?: string; // maxLength: 254, format: email
  phone?: string; // maxLength: 255
  notes?: string; // maxLength: 500
  department?: string; // maxLength: 255
  fees?: string; // maxLength: 100
  degreenum?: string; // maxLength: 20
  passport?: string; // maxLength: 255
  degree?: DegreeType;
  deepdepartment?: string; // maxLength: 100
  grad_univerBach?: string; // maxLength: 100
  grad_univermaster?: string; // maxLength: 100
  traker?: string; // maxLength: 255
  pdf?: File; // ملف PDF للرفع
  address?: string; // maxLength: 255
  nearestPoint?: string; // maxLength: 255
  govern?: GovernorateCode;
  by?: GovernorateCode;
  pages?: string; // maxLength: 255
  magazine?: string; // maxLength: 255
  mushref?: string; // maxLength: 255
  univerFees?: string; // maxLength: 255
  kind_fees?: string; // maxLength: 255

  // ========== حقول Boolean ==========
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;

  // ========== العلاقات ==========
  university?: string | null; // UUID
}

/**
 * UpdateFormRequest - البيانات لتحديث استمارة موجودة
 * جميع الحقول اختيارية (Partial Update)
 */
export interface UpdateFormRequest {
  // ========== حقول البيانات الأساسية ==========
  full_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  department?: string;
  fees?: string;
  degreenum?: string;
  passport?: string;
  degree?: DegreeType;
  deepdepartment?: string;
  grad_univerBach?: string;
  grad_univermaster?: string;
  traker?: string;
  pdf?: File;
  address?: string;
  nearestPoint?: string;
  govern?: GovernorateCode;
  by?: GovernorateCode;
  pages?: string;
  magazine?: string;
  mushref?: string;
  univerFees?: string;
  kind_fees?: string;

  // ========== حقول Boolean ==========
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  touch?: boolean;
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;

  // ========== العلاقات ==========
  kind?: string; // UUID
  university?: string | null; // UUID
}

/**
 * GetFormsRequest - معاملات البحث والفلترة
 */
export interface GetFormsRequest {
  // ========== Pagination ==========
  page?: number;
  page_size?: number;

  // ========== Search ==========
  search?: string; // البحث في full_name, email, phone, department, deepdepartment, university name, form kind, degree number, passport

  // ========== Ordering ==========
  ordering?: string; // مثال: "date_applied", "-full_name", "email", "fees", "updated_at"

  // ========== Boolean Filters ==========
  submitted?: boolean;
  approved?: boolean;
  accepted?: boolean;
  received?: boolean;
  payoff?: boolean;
  touch?: boolean;

  // ========== Form Kind Filters ==========
  kind?: string; // UUID - exact match
  kind__name?: string; // اسم نوع الاستمارة - exact or partial match

  // ========== University Filters ==========
  university?: string; // UUID - exact match
  university__name?: string; // اسم الجامعة - exact or partial match

  // ========== Date Filters ==========
  date_applied?: string; // تاريخ محدد (YYYY-MM-DD)
  date_applied__gte?: string; // من تاريخ (YYYY-MM-DD)
  date_applied__lte?: string; // إلى تاريخ (YYYY-MM-DD)
  date_applied__year?: number; // سنة التقديم (e.g., 2024)
  date_applied__month?: number; // شهر التقديم (1-12)

  // ========== Fees Filters ==========
  fees?: string; // رسوم محددة - exact match
  fees__gte?: string; // رسوم أكبر من أو تساوي
  fees__lte?: string; // رسوم أقل من أو تساوي
}

// ==================== RESPONSE TYPES ====================

/**
 * PaginatedData - البيانات المرجعة مع Pagination
 */
interface PaginatedData {
  count: number; // إجمالي عدد النتائج
  total_pages: number; // إجمالي عدد الصفحات
  current_page: number; // الصفحة الحالية
  page_size: number; // عدد العناصر في الصفحة
  next: string | null; // رابط الصفحة التالية
  previous: string | null; // رابط الصفحة السابقة
  results: Form[]; // قائمة الاستمارات
}

interface FormsListResponse extends ApiResponse {
  data: PaginatedData;
}

interface FormResponse extends ApiResponse {
  data: Form;
}

interface CreateFormResponse extends ApiResponse {
  data: Form;
}

interface UpdateFormResponse extends ApiResponse {
  data: Form;
}

interface DeleteFormResponse extends ApiResponse {}

// ==================== RTK QUERY API ====================

export const formsApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /forms/
     * الحصول على قائمة الاستمارات مع الفلترة والبحث
     */
    getForms: build.query<FormsListResponse, GetFormsRequest | void>({
      query: (params) => {
        const queryParams = params || {};
        const apiParams: Record<string, any> = {
          page: queryParams.page || 1,
          page_size: queryParams.page_size || 10,
        };

        // Search
        if (queryParams.search) apiParams.search = queryParams.search;

        // Ordering
        if (queryParams.ordering) apiParams.ordering = queryParams.ordering;

        // Boolean Filters
        if (queryParams.submitted !== undefined) apiParams.submitted = queryParams.submitted;
        if (queryParams.approved !== undefined) apiParams.approved = queryParams.approved;
        if (queryParams.accepted !== undefined) apiParams.accepted = queryParams.accepted;
        if (queryParams.received !== undefined) apiParams.received = queryParams.received;
        if (queryParams.payoff !== undefined) apiParams.payoff = queryParams.payoff;
        if (queryParams.touch !== undefined) apiParams.touch = queryParams.touch;

        // Form Kind Filters
        if (queryParams.kind) apiParams.kind = queryParams.kind;
        if (queryParams.kind__name) apiParams.kind__name = queryParams.kind__name;

        // University Filters
        if (queryParams.university) apiParams.university = queryParams.university;
        if (queryParams.university__name) apiParams.university__name = queryParams.university__name;

        // Date Filters
        if (queryParams.date_applied) apiParams.date_applied = queryParams.date_applied;
        if (queryParams.date_applied__gte) apiParams.date_applied__gte = queryParams.date_applied__gte;
        if (queryParams.date_applied__lte) apiParams.date_applied__lte = queryParams.date_applied__lte;
        if (queryParams.date_applied__year) apiParams.date_applied__year = queryParams.date_applied__year;
        if (queryParams.date_applied__month) apiParams.date_applied__month = queryParams.date_applied__month;

        // Fees Filters
        if (queryParams.fees) apiParams.fees = queryParams.fees;
        if (queryParams.fees__gte) apiParams.fees__gte = queryParams.fees__gte;
        if (queryParams.fees__lte) apiParams.fees__lte = queryParams.fees__lte;

        return {
          url: "forms/",
          method: "GET",
          params: apiParams,
        };
      },
      providesTags: ["Forms"],
    }),
    /**
     * GET /forms/{id}/
     * الحصول على استمارة محددة بواسطة ID
     */
    getForm: build.query<FormResponse, string>({
      query: (id: string) => ({
        url: `forms/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Forms", id }],
    }),

    /**
     * POST /forms/
     * إنشاء استمارة جديدة
     */
    createForm: build.mutation<CreateFormResponse, CreateFormRequest>({
      query: (body: CreateFormRequest) => {
        const formData = new FormData();

        // // إضافة جميع الحقول إلى FormData
        // Object.entries(body).forEach(([key, value]) => {
        //   if (value !== undefined && value !== null) {
        //     if (value instanceof File) {
        //       formData.append(key, value);
        //     } else if (typeof value === "boolean") {
        //       formData.append(key, value ? "true" : "false");
        //     } else {
        //       formData.append(key, String(value));
        //     }
        //   }
        // });

        return {
          url: "forms/",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Forms"],
    }),

    /**
     * PATCH /forms/{id}/
     * تحديث استمارة بشكل جزئي
     */
    updateForm: build.mutation<
      UpdateFormResponse,
      { id: string; data: UpdateFormRequest }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: `forms/${id}/`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Forms",
        { type: "Forms", id },
      ],
    }),

    /**
     * DELETE /forms/{id}/
     * حذف استمارة
     */
    deleteForm: build.mutation<DeleteFormResponse, string>({
      query: (id: string) => ({
        url: `forms/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Forms",
        { type: "Forms", id },
      ],
    }),
  }),
});

// ==================== EXPORTED HOOKS ====================

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useLazyGetFormsQuery,
  useLazyGetFormQuery,
} = formsApi;

// ==================== EXPORTED ENDPOINTS ====================

export const { getForms, getForm, createForm, updateForm, deleteForm } =
  formsApi.endpoints;

// ==================== HELPER FUNCTIONS ====================

export const formsHelpers = {
  /**
   * التحقق من صحة البيانات بناءً على الحقول المطلوبة
   */
  validateFormData: (
    data: Partial<CreateFormRequest>,
    requiredFields: string[]
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = data[field as keyof CreateFormRequest];

      // تحقق من وجود القيمة
      if (
        !value ||
        (typeof value === "string" && value.trim().length === 0)
      ) {
        errors[field] = "هذا الحقل مطلوب";
        return;
      }

      // تحقق خاص للبريد الإلكتروني
      if (field === "email" && typeof value === "string") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field] = "البريد الإلكتروني غير صالح";
        }
      }

      // تحقق خاص لرقم الهاتف العراقي
      if (field === "phone" && typeof value === "string") {
        if (!/^07\d{9}$/.test(value)) {
          errors[field] = "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم";
        }
      }

      // تحقق من أقصى طول للحقول
      if (typeof value === "string") {
        const maxLengths: Record<string, number> = {
          full_name: 255,
          email: 254,
          phone: 255,
          notes: 500,
          department: 255,
          fees: 100,
          degreenum: 20,
          passport: 255,
          deepdepartment: 100,
          grad_univerBach: 100,
          grad_univermaster: 100,
          traker: 255,
          address: 255,
          nearestPoint: 255,
          pages: 255,
          magazine: 255,
          mushref: 255,
          univerFees: 255,
          kind_fees: 255,
        };

        if (maxLengths[field] && value.length > maxLengths[field]) {
          errors[field] = `الحد الأقصى ${maxLengths[field]} حرف`;
        }
      }
    });

    return errors;
  },

  /**
   * إنشاء بيانات افتراضية لاستمارة جديدة
   */
  createDefaultForm: (kindId: string): CreateFormRequest => ({
    kind: kindId,
    full_name: "",
    email: "",
    phone: "",
    publishResearch: false,
    stilal: false,
    international: false,
    touch: false,
    submitted: false,
    approved: false,
    accepted: false,
    received: false,
    payoff: false,
  }),

  /**
   * تنسيق بيانات الاستمارة للعرض
   */
  formatFormForDisplay: (form: Form) => ({
    ...form,
    displayName: `${form.full_name} - ${form.kind_display}`,
    statusText: form.status_display,
    completionText: `${form.completion_percentage}% مكتمل`,
    universityText: form.university_name || "لم يتم التحديد",
    degreeText: form.degree
      ? formsHelpers.getDegreeLabel(form.degree)
      : "لم يتم التحديد",
    governText: form.govern
      ? formsHelpers.getGovernorateLabel(form.govern)
      : "لم يتم التحديد",
    byText: form.by
      ? formsHelpers.getGovernorateLabel(form.by)
      : "لم يتم التحديد",
    dateAppliedText: new Date(form.date_applied).toLocaleDateString("ar-IQ"),
    dateText: new Date(form.date).toLocaleDateString("ar-IQ"),
    createdAtText: new Date(form.created_at).toLocaleDateString("ar-IQ"),
    updatedAtText: new Date(form.updated_at).toLocaleDateString("ar-IQ"),
    editableText: form.is_editable ? "قابل للتعديل" : "غير قابل للتعديل",
  }),

  /**
   * الحصول على الحقول المطلوبة من JSON string
   */
  getRequiredFields: (form: Form): string[] => {
    try {
      return form.required_fields ? JSON.parse(form.required_fields) : [];
    } catch {
      return [];
    }
  },

  /**
   * الحصول على الحقول المسموح بها من JSON string
   */
  getAllowedFields: (form: Form): string[] => {
    try {
      return form.allowed_fields ? JSON.parse(form.allowed_fields) : [];
    } catch {
      return [];
    }
  },

  /**
   * حساب نسبة الإكمال يدوياً
   */
  calculateCompletionPercentage: (
    form: Partial<Form>,
    requiredFields: string[]
  ): number => {
    if (requiredFields.length === 0) return 100;

    const filledRequiredFields = requiredFields.filter((field) => {
      const value = form[field as keyof Form];
      return value !== undefined && value !== null && value !== "";
    });

    return Math.round(
      (filledRequiredFields.length / requiredFields.length) * 100
    );
  },

  /**
   * فلترة الحقول المسموح تحديثها فقط
   */
  filterAllowedFields: (
    data: UpdateFormRequest,
    allowedFields: string[]
  ): UpdateFormRequest => {
    const filtered: UpdateFormRequest = {};

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        filtered[key as keyof UpdateFormRequest] = data[
          key as keyof UpdateFormRequest
        ] as any;
      }
    });

    return filtered;
  },

  /**
   * تحويل كود المحافظة إلى اسم بالعربي
   */
  getGovernorateLabel: (code: GovernorateCode): string => {
    const governorates: Record<GovernorateCode, string> = {
      baghdad: "بغداد",
      basra: "البصرة",
      nineveh: "نينوى",
      erbil: "أربيل",
      sulaymaniyah: "السليمانية",
      duhok: "دهوك",
      kirkuk: "كركوك",
      diyala: "ديالى",
      anbar: "الأنبار",
      salah_al_din: "صلاح الدين",
      najaf: "النجف",
      karbala: "كربلاء",
      babil: "بابل",
      wasit: "واسط",
      maysan: "ميسان",
      dhi_qar: "ذي قار",
      muthanna: "المثنى",
      qadisiyyah: "القادسية",
      halabja: "حلبجة",
    };
    return governorates[code];
  },

  /**
   * تحويل كود الدرجة العلمية إلى اسم بالعربي
   */
  getDegreeLabel: (degree: DegreeType): string => {
    const degrees: Record<DegreeType, string> = {
      bachelor: "بكالوريوس",
      master: "ماجستير",
      phd: "دكتوراه",
    };
    return degrees[degree];
  },

  /**
   * الحصول على جميع المحافظات كخيارات للـ Select
   */
  getGovernorateOptions: (): { value: GovernorateCode; label: string }[] => {
    const codes: GovernorateCode[] = [
      "baghdad",
      "basra",
      "nineveh",
      "erbil",
      "sulaymaniyah",
      "duhok",
      "kirkuk",
      "diyala",
      "anbar",
      "salah_al_din",
      "najaf",
      "karbala",
      "babil",
      "wasit",
      "maysan",
      "dhi_qar",
      "muthanna",
      "qadisiyyah",
      "halabja",
    ];

    return codes.map((code) => ({
      value: code,
      label: formsHelpers.getGovernorateLabel(code),
    }));
  },

  /**
   * الحصول على جميع الدرجات العلمية كخيارات للـ Select
   */
  getDegreeOptions: (): { value: DegreeType; label: string }[] => {
    return [
      { value: "bachelor", label: "بكالوريوس" },
      { value: "master", label: "ماجستير" },
      { value: "phd", label: "دكتوراه" },
    ];
  },

  /**
   * تحقق من إمكانية تعديل الاستمارة
   */
  canEditForm: (form: Form): boolean => {
    return form.is_editable;
  },

  /**
   * تحقق من إمكانية حذف الاستمارة
   */
  canDeleteForm: (form: Form): boolean => {
    // يمكن حذف الاستمارة فقط إذا لم يتم تسليمها أو الموافقة عليها
    return !form.submitted && !form.approved && !form.accepted;
  },

  /**
   * بناء query string للبحث والفلترة
   */
  buildQueryParams: (params: GetFormsRequest): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  },
};