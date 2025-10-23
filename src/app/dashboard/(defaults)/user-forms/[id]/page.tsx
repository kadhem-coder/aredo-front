"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  FileText, ArrowRight, User, Mail, Phone, AlertCircle, CheckCircle,
  Loader2, Upload, X, Building, GraduationCap, CreditCard, FileImage,
  Shield, MapPin, BookOpen, ChevronDown, DollarSign, Globe, MessageSquare
} from 'lucide-react';
import { useCreateFormMutation } from '@/services/forms';
import { useGetFormKindQuery, type FormKind } from '@/services/formkinds';
import { useGetUniversitiesQuery, type University } from '@/services/universities';

// ==================== CONSTANTS ====================

/**
 * ADMIN-ONLY FIELDS
 * هذه الحقول للإدارة فقط ولن تظهر أبداً في النموذج للمستخدم العادي
 * يتم تجاهلها بالكامل في واجهة المستخدم
 */
const ADMIN_ONLY_FIELDS = [
  'touch',
  'submitted', 
  'approved',
  'accepted',
  'received',
  'payoff'
] as const;

/**
 * USER VISIBLE FIELDS
 * الحقول التي يمكن للمستخدم العادي رؤيتها وتعبئتها
 */
const USER_VISIBLE_FIELDS = [
  'university', 'full_name', 'email', 'notes', 'department', 'fees',
  'degreenum', 'passport', 'degree', 'deepdepartment', 'grad_univerBach',
  'grad_univermaster', 'traker', 'pdf', 'address', 'nearestPoint', 'govern',
  'by', 'pages', 'magazine', 'mushref', 'publishResearch', 'stilal',
  'international', 'univerFees', 'kind_fees', 'phone'
] as const;

// ==================== INTERFACES ====================

interface FormDataType {
  kind: string;
  full_name?: string;
  email?: string;
  phone?: string;
  university?: string;
  department?: string;
  deepdepartment?: string;
  degree?: string;
  degreenum?: string;
  passport?: string;
  grad_univerBach?: string;
  grad_univermaster?: string;
  address?: string;
  nearestPoint?: string;
  govern?: string;
  by?: string;
  fees?: string;
  univerFees?: string;
  kind_fees?: string;
  traker?: string;
  pages?: string;
  magazine?: string;
  mushref?: string;
  notes?: string;
  publishResearch?: boolean;
  stilal?: boolean;
  international?: boolean;
  pdf?: File;
  [key: string]: any;
}

// ==================== FIELD MAPPINGS ====================

const fieldIcons: Record<string, any> = {
  full_name: User,
  email: Mail,
  phone: Phone,
  university: Building,
  department: BookOpen,
  deepdepartment: GraduationCap,
  degree: GraduationCap,
  degreenum: CreditCard,
  passport: Shield,
  grad_univerBach: Building,
  grad_univermaster: Building,
  address: MapPin,
  nearestPoint: MapPin,
  govern: MapPin,
  by: MapPin,
  fees: DollarSign,
  univerFees: DollarSign,
  kind_fees: DollarSign,
  traker: FileText,
  pages: FileText,
  magazine: BookOpen,
  mushref: User,
  notes: MessageSquare,
  publishResearch: Globe,
  stilal: FileText,
  international: Globe,
  pdf: FileImage,
};

const fieldLabels: Record<string, string> = {
  full_name: "الاسم الكامل",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  university: "الجامعة",
  department: "القسم",
  deepdepartment: "التخصص التفصيلي",
  degree: "الدرجة العلمية",
  degreenum: "رقم الشهادة",
  passport: "رقم جواز السفر",
  grad_univerBach: "جامعة البكالوريوس",
  grad_univermaster: "جامعة الماجستير",
  address: "العنوان",
  nearestPoint: "أقرب نقطة",
  govern: "المحافظة",
  by: "المحافظة (بواسطة)",
  fees: "الرسوم",
  univerFees: "رسوم الجامعة",
  kind_fees: "نوع الرسوم",
  traker: "رقم التتبع",
  pages: "عدد الصفحات",
  magazine: "المجلة",
  mushref: "المشرف",
  notes: "الملاحظات",
  publishResearch: "نشر البحث",
  stilal: "استلال",
  international: "دولي",
  pdf: "رفع ملف PDF",
};

const fieldPlaceholders: Record<string, string> = {
  full_name: "أدخل اسمك الكامل",
  email: "example@email.com",
  phone: "07xxxxxxxxx",
  department: "القسم الدراسي",
  deepdepartment: "التخصص التفصيلي",
  degreenum: "رقم الشهادة",
  passport: "رقم جواز السفر",
  grad_univerBach: "جامعة البكالوريوس",
  grad_univermaster: "جامعة الماجستير",
  address: "العنوان الكامل",
  nearestPoint: "أقرب نقطة دالة",
  fees: "مبلغ الرسوم",
  univerFees: "رسوم الجامعة",
  kind_fees: "نوع الرسوم",
  traker: "رقم التتبع",
  pages: "عدد الصفحات",
  magazine: "اسم المجلة",
  mushref: "اسم المشرف",
  notes: "ملاحظات إضافية",
};

const iraqGovernorates = [
  { value: "baghdad", label: "بغداد" },
  { value: "basra", label: "البصرة" },
  { value: "nineveh", label: "نينوى" },
  { value: "erbil", label: "أربيل" },
  { value: "sulaymaniyah", label: "السليمانية" },
  { value: "duhok", label: "دهوك" },
  { value: "kirkuk", label: "كركوك" },
  { value: "diyala", label: "ديالى" },
  { value: "anbar", label: "الأنبار" },
  { value: "salah_al_din", label: "صلاح الدين" },
  { value: "najaf", label: "النجف" },
  { value: "karbala", label: "كربلاء" },
  { value: "babil", label: "بابل" },
  { value: "wasit", label: "واسط" },
  { value: "maysan", label: "ميسان" },
  { value: "dhi_qar", label: "ذي قار" },
  { value: "muthanna", label: "المثنى" },
  { value: "qadisiyyah", label: "القادسية" },
  { value: "halabja", label: "حلبجة" },
];

// ==================== UNIVERSITY SELECT COMPONENT ====================

const UniversitySelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}> = ({ value, onChange, error, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    data: universitiesData, 
    isLoading
  } = useGetUniversitiesQuery({
    page,
    page_size: 20,
    search: searchTerm || undefined
  });

  const universities: University[] = universitiesData?.data?.results || [];
  const selectedUniversity = universities.find((uni: University) => uni.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const Icon = fieldIcons.university;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {fieldLabels.university} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedUniversity?.name || '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={selectedUniversity ? selectedUniversity.name : "ابحث عن الجامعة..."}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="mr-2 text-sm text-gray-600">جاري التحميل...</span>
            </div>
          ) : universities.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {searchTerm ? 'لا توجد جامعات تطابق البحث' : 'لا توجد جامعات متاحة'}
            </div>
          ) : (
            <>
              {universities.map((university: University) => (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => {
                    onChange(university.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-4 py-3 text-right hover:bg-gray-50 flex items-center justify-between transition-colors ${
                    value === university.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  <span className="font-medium">{university.name}</span>
                  <span className="text-xs text-gray-500">
                    {university.university_type === 'public' ? 'حكومية' : 
                     university.university_type === 'private' ? 'خاصة' : 'مختلطة'}
                  </span>
                </button>
              ))}
              
              {universitiesData?.next && (
                <button
                  type="button"
                  onClick={() => {
                    if (universitiesData?.next) setPage(prev => prev + 1);
                  }}
                  className="w-full px-4 py-3 text-center text-blue-600 hover:bg-blue-50 border-t border-gray-200 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    'تحميل المزيد'
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ==================== DYNAMIC FORM FIELD COMPONENT ====================

const DynamicFormField: React.FC<{
  fieldName: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
}> = ({ fieldName, value, onChange, error, required }) => {
  const Icon = fieldIcons[fieldName] || FileText;

  // University Select
  if (fieldName === 'university') {
    return (
      <UniversitySelect
        value={value || ''}
        onChange={onChange}
        error={error}
        required={required}
      />
    );
  }

  // Degree Select
  if (fieldName === 'degree') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">اختر الدرجة العلمية</option>
            <option value="bachelor">بكالوريوس</option>
            <option value="master">ماجستير</option>
            <option value="phd">دكتوراه</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Governorate Select
  if (fieldName === 'govern' || fieldName === 'by') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">اختر المحافظة</option>
            {iraqGovernorates.map(gov => (
              <option key={gov.value} value={gov.value}>{gov.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Boolean Checkboxes (ONLY USER-VISIBLE BOOLEAN FIELDS)
  if (fieldName === 'publishResearch' || fieldName === 'stilal' || fieldName === 'international') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={fieldName}
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor={fieldName} className="text-sm font-semibold text-gray-700 cursor-pointer">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        {error && <p className="text-red-500 text-sm mt-1 mr-8">{error}</p>}
      </div>
    );
  }

  // Textarea for Notes
  if (fieldName === 'notes') {
    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder={fieldPlaceholders[fieldName]}
            rows={4}
            maxLength={500}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Email Input
  if (fieldName === 'email') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder={fieldPlaceholders[fieldName]}
            dir="ltr"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Phone Input
  if (fieldName === 'phone') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder={fieldPlaceholders[fieldName]}
            dir="ltr"
            maxLength={11}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Default Text Input
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {fieldLabels[fieldName]} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={fieldPlaceholders[fieldName] || `أدخل ${fieldLabels[fieldName]}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const DynamicApplicationFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  
  const formKindId = params?.id as string;
  
  const { 
    data: formKindData, 
    isLoading: isLoadingFormKind, 
    error: formKindError 
  } = useGetFormKindQuery(formKindId, {
    skip: !formKindId
  });

  const formKind: FormKind | undefined = formKindData?.data;

  const [formData, setFormData] = useState<FormDataType>({
    kind: formKindId || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  
  const [createForm, { isLoading: isSubmitting }] = useCreateFormMutation();

  /**
   * Get Active Fields (EXCLUDING ADMIN-ONLY FIELDS)
   * الحصول على الحقول النشطة فقط للمستخدم (بدون الحقول الإدارية)
   */
  const getActiveFields = (): string[] => {
    if (!formKind) return [];
    
    const fields: string[] = [];
    
    USER_VISIBLE_FIELDS.forEach(key => {
      // تأكد من أن الحقل نشط في FormKind وليس من الحقول الإدارية
      if (formKind[key as keyof FormKind] === true && !ADMIN_ONLY_FIELDS.includes(key as any)) {
        fields.push(key);
      }
    });
    
    return fields;
  };

  const activeFields = getActiveFields();

  // Initialize Form Data
  useEffect(() => {
    if (formKind && session?.user && formKindId) {
      const initialData: FormDataType = {
        kind: formKindId
      };
      
      const user = session.user as any;
      if (activeFields.includes('full_name')) {
        initialData.full_name = user.name || user.username || '';
      }
      if (activeFields.includes('phone')) {
        initialData.phone = user.phone_number || '';
      }
      
      setFormData(initialData);
    }
  }, [formKind, session, formKindId, activeFields.length]);

  // Auth Check
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any;
      
      if (user.is_staff || user.is_superuser) {
        router.push('/dashboard');
        return;
      }
    } else if (status === "unauthenticated") {
      router.push('/dashboard/auth/login');
    }
  }, [session, status, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    activeFields.forEach(field => {
      const value = formData[field];
      
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        newErrors[field] = `${fieldLabels[field]} مطلوب`;
      }
      
      if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = "البريد الإلكتروني غير صالح";
      }
      
      if (field === 'phone' && value && !/^07\d{9}$/.test(value)) {
        newErrors[field] = "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  try {
    const submitFormData = new FormData();
    
    submitFormData.append('kind', formKindId);
    
    // إضافة الحقول المرئية للمستخدم
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'kind' && value !== undefined && value !== null && value !== '') {
        // تأكد من أن الحقل ليس من الحقول الإدارية
        if (!ADMIN_ONLY_FIELDS.includes(key as any)) {
          if (value instanceof File) {
            submitFormData.append(key, value);
          } else if (typeof value === 'boolean') {
            submitFormData.append(key, value ? 'true' : 'false');
          } else {
            submitFormData.append(key, String(value));
          }
        }
      }
    });

    // إضافة الحقول الإدارية المطلوبة بقيمة false
    if (formKind) {
      ADMIN_ONLY_FIELDS.forEach((field) => {
        const isRequired = formKind[field];
        
        // إذا كان الحقل مطلوباً، أرسله بقيمة false
        if (isRequired === true) {
          submitFormData.append(field, 'false');
        }
      });
    }

    await createForm(submitFormData as any).unwrap();
    
    setSuccess('تم إرسال الاستمارة بنجاح! سيتم مراجعتها والرد عليك قريباً.');
    
    const user = session?.user as any;
    const resetData: FormDataType = { 
      kind: formKindId 
    };
    if (activeFields.includes('full_name')) {
      resetData.full_name = user?.name || user?.username || '';
    }
    if (activeFields.includes('phone')) {
      resetData.phone = user?.phone_number || '';
    }
    setFormData(resetData);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error: any) {
    console.error('خطأ في إرسال الاستمارة:', error);
    
    if (error?.data?.message) {
      setErrors({ general: error.data.message });
    } else {
      setErrors({ general: 'حدث خطأ في إرسال الاستمارة، يرجى المحاولة مرة أخرى' });
    }
  }
};

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: FormDataType) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setFormData((prev: FormDataType) => ({ ...prev, pdf: file }));
        if (errors.pdf) {
          setErrors((prev: Record<string, string>) => {
            const newErrors = { ...prev };
            delete newErrors.pdf;
            return newErrors;
          });
        }
      } else {
        setErrors((prev: Record<string, string>) => ({ ...prev, pdf: 'يجب أن يكون الملف من نوع PDF فقط' }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev: FormDataType) => ({ ...prev, pdf: file }));
    }
  };

  const removeFile = () => {
    setFormData((prev: FormDataType) => ({ ...prev, pdf: undefined }));
  };

  // Loading State
  if (status === "loading" || isLoadingFormKind) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (formKindError || !formKind) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل الاستمارة</h2>
          <p className="text-gray-600 mb-6">لم نتمكن من تحميل بيانات الاستمارة</p>
          <button
            onClick={() => router.push('/forms')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة إلى الاستمارات
          </button>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Group Fields by Category (EXCLUDING ADMIN FIELDS)
  const personalFields = activeFields.filter(f => 
    ['full_name', 'email', 'phone', 'passport', 'address', 'nearestPoint', 'govern', 'by'].includes(f)
  );
  
  const academicFields = activeFields.filter(f => 
    ['university', 'department', 'deepdepartment', 'degree', 'degreenum', 
     'grad_univerBach', 'grad_univermaster'].includes(f)
  );
  
  const financialFields = activeFields.filter(f => 
    ['fees', 'univerFees', 'kind_fees'].includes(f)
  );
  
  const additionalFields = activeFields.filter(f => 
    ['traker', 'pages', 'magazine', 'mushref', 'notes'].includes(f)
  );
  
  const booleanFields = activeFields.filter(f => 
    ['publishResearch', 'stilal', 'international'].includes(f)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="الرجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{formKind.name}</h1>
                  <p className="text-sm text-gray-500">{formKind.manager}</p>
                </div>
              </div>
            </div>
            {session?.user && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>مرحباً، {(session.user as any).name || (session.user as any).username}</span>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-1">تم الإرسال بنجاح!</h3>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-1">خطأ في الإرسال</h3>
                <p className="text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{formKind.name}</h2>
              <p className="text-xl text-white text-opacity-90 mb-2">المدير: {formKind.manager}</p>
              {formKind.description && (
                <p className="text-white text-opacity-80">{formKind.description}</p>
              )}
              {formKind.phonefield && (
                <p className="text-white text-opacity-90 mt-2">للاستفسار: {formKind.phonefield}</p>
              )}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information Section */}
            {personalFields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <User className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">المعلومات الشخصية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {personalFields.map(field => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      error={errors[field]}
                      required={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Academic Information Section */}
            {academicFields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <GraduationCap className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">المعلومات الأكاديمية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {academicFields.map(field => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      error={errors[field]}
                      required={formKind.requires_university && field === 'university'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Financial Information Section */}
            {financialFields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <DollarSign className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">المعلومات المالية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {financialFields.map(field => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      error={errors[field]}
                      required={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information Section */}
            {additionalFields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">معلومات إضافية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {additionalFields.map(field => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      error={errors[field]}
                      required={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Boolean Fields Section */}
            {booleanFields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">خيارات إضافية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {booleanFields.map(field => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      error={errors[field]}
                      required={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Section */}
            {(formKind.requires_file_upload || activeFields.includes('pdf')) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <FileImage className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">المرفقات</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رفع ملف PDF {formKind.requires_file_upload && <span className="text-red-500">*</span>}
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : formData.pdf 
                          ? 'border-green-500 bg-green-50' 
                          : errors.pdf 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {formData.pdf ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-12 h-12 text-green-500" />
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formData.pdf.name}</p>
                            <p className="text-sm text-gray-500">
                              {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <X className="w-4 h-4" />
                          حذف الملف
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-600 mb-2">اسحب ملف PDF هنا أو</p>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            اختيار ملف
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          الحد الأقصى لحجم الملف: 10 MB - نوع الملف: PDF فقط
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.pdf && (
                    <p className="text-red-500 text-sm mt-2">{errors.pdf}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Section */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  بالضغط على "إرسال الاستمارة"، أنت توافق على شروط وأحكام الخدمة
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      إرسال الاستمارة
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Form Info Card */}
        {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">معلومات مهمة</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• تأكد من ملء جميع الحقول المطلوبة بدقة</li>
                <li>• سيتم مراجعة طلبك من قبل: {formKind.manager}</li>
                {formKind.phonefield && (
                  <li>• للاستفسارات، يمكنك الاتصال على: {formKind.phonefield}</li>
                )}
                <li>• ستتلقى إشعاراً عند معالجة طلبك</li>
                {formKind.requires_file_upload && (
                  <li>• رفع ملف PDF مطلوب لهذه الاستمارة</li>
                )}
                {formKind.requires_university && (
                  <li>• يجب اختيار الجامعة لإتمام الطلب</li>
                )}
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DynamicApplicationFormPage;