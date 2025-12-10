"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  FileText,
  Save,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  Phone,
  Building,
  GraduationCap,
  Upload,
  CheckSquare,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { 
  useCreateFormKindMutation, 
  useUpdateFormKindMutation,
  useGetFormKindQuery,
  type CreateFormKindRequest,
} from '@/services/formkinds'

// مكون رسالة النجاح المخصص
const SuccessBanner = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-green-800 font-medium">{message}</p>
          <p className="text-green-600 text-sm">تم حفظ جميع البيانات بنجاح</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// الأيقونات المتاحة
const iconOptions = [
  { value: 'applicant', label: '👤 طلب متقدم', emoji: '👤' },
  { value: 'cancelcode', label: '❌ إلغاء كود', emoji: '❌' },
  { value: 'translate', label: '🔤 ترجمة', emoji: '🔤' },
  { value: 'langcourse', label: '🗣️ دورة لغة', emoji: '🗣️' },
  { value: 'universityfees', label: '💰 رسوم جامعية', emoji: '💰' },
  { value: 'publish', label: '📖 نشر بحث', emoji: '📖' },
  { value: 'delvary', label: '🚚 توصيل', emoji: '🚚' },
  { value: 'flight', label: '✈️ طيران', emoji: '✈️' },
  { value: 'translate iraq', label: '🇮🇶 ترجمة عراق', emoji: '🇮🇶' },
  { value: 'istalal', label: '📋 استلال', emoji: '📋' },
  { value: 'rahgery', label: '🎫 راهجري', emoji: '🎫' },
  { value: 'higher education', label: '🎓 تعليم عالي', emoji: '🎓' },
]

// تعريف الحقول البولينية
const booleanFields = [
  { key: 'university', label: 'الجامعة', icon: GraduationCap },
  { key: 'full_name', label: 'الاسم الكامل', icon: User },
  { key: 'email', label: 'البريد الإلكتروني', icon: FileText },
  { key: 'phone', label: 'رقم الهاتف ', icon: Phone },
  { key: 'notes', label: 'الملاحظات', icon: FileText },
  { key: 'department', label: 'التخصص', icon: Building },
  { key: 'fees', label: 'الرسوم بالدينار العراقي', icon: FileText },
  { key: 'degreenum', label: 'المعدل', icon: FileText },
  { key: 'passport', label: 'رقم جواز السفر', icon: FileText },
  { key: 'degree', label: 'نوع الدراسة', icon: GraduationCap },
  { key: 'deepdepartment', label: 'التخصص الدقيق', icon: Building },
  { key: 'grad_univerBach', label: 'جامعة التخرج - بكالوريوس', icon: GraduationCap },
  { key: 'grad_univermaster', label: 'جامعة التخرج - ماجستير', icon: GraduationCap },
  { key: 'traker', label: 'المعقب', icon: User },
  { key: 'pdf', label: 'PDF', icon: FileText },
  { key: 'address', label: 'العنوان', icon: Building },
  { key: 'nearestPoint', label: 'أقرب نقطة', icon: Building },
  { key: 'govern', label: 'المحافظة', icon: Building },
  { key: 'by', label: 'بواسطة', icon: User },
  { key: 'pages', label: 'الصفحات', icon: FileText },
  { key: 'magazine', label: 'المجلة', icon: FileText },
  { key: 'mushref', label: 'المشرف', icon: User },
  { key: 'publishResearch', label: 'نشر البحث', icon: FileText },
  { key: 'stilal', label: 'استلال', icon: FileText },
  { key: 'international', label: 'عالمي', icon: Building },
  { key: 'univerFees', label: 'رسوم الجامعة بالدينار العراقي', icon: FileText }, // صلاحيات ادمن 
  { key: 'kind_fees', label: 'اجور الشركة', icon: FileText }, // صلاحيات ادمن 
  { key: 'touch', label: 'تم التواصل', icon: Phone },
  { key: 'submitted', label: 'تم التقديم', icon: CheckSquare },
  { key: 'approved', label: 'تم القبول', icon: CheckSquare },
  { key: 'accepted', label: 'تم الاعتماد', icon: CheckSquare },
  { key: 'received', label: 'تم الاستلام', icon: CheckSquare },
  { key: 'payoff', label: 'تم الدفع', icon: FileText },
  { key: 'date_applied', label: 'تاريخ التقديم', icon: FileText },
  { key: 'date', label: 'التاريخ', icon: FileText },
] as const

const CreateOrUpdateFormKind = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id

  // API Hooks
  const [createFormKind, { isLoading: isCreating }] = useCreateFormKindMutation()
  const [updateFormKind, { isLoading: isUpdating }] = useUpdateFormKindMutation()
  const { data: formKindResponse, isFetching } = useGetFormKindQuery(id!, {
    skip: !isEdit || !id,
  })

  // Form State
  const [formData, setFormData] = useState<CreateFormKindRequest>({
    name: '',
    manager: '',
    phonefield: '',
    description: '',
    is_active: true,
    requires_university: false,
    requires_file_upload: false,
    icon: 'applicant',
    // Initialize all boolean fields to false
    ...Object.fromEntries(booleanFields.map(field => [field.key, false]))
  })

  const [errors, setErrors] = useState<{
    name?: string;
    manager?: string;
    phonefield?: string;
    icon?: string;
    description?: string;
  }>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Set form data when form kind data is loaded
  useEffect(() => {
    if (formKindResponse?.data && isEdit) {
      const formKind = formKindResponse.data
      setFormData({
        name: formKind.name || '',
        manager: formKind.manager || '',
        phonefield: formKind.phonefield || '',
        description: formKind.description || '',
        is_active: formKind.is_active ?? true,
        requires_university: formKind.requires_university ?? false,
        requires_file_upload: formKind.requires_file_upload ?? false,
        icon: formKind.icon || 'applicant',
        // Set all boolean fields from API
        ...Object.fromEntries(
          booleanFields.map(field => [
            field.key, 
            formKind[field.key as keyof typeof formKind] ?? false
          ])
        )
      })
    }
  }, [formKindResponse, isEdit])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<CreateFormKindRequest> = {}

    if (!formData.name.trim()) newErrors.name = 'اسم نوع الاستمارة مطلوب'
    else if (formData.name.length > 30) newErrors.name = 'اسم نوع الاستمارة يجب أن يكون أقل من 30 حرف'

    if (!formData.manager.trim()) newErrors.manager = 'اسم المدير مطلوب'
    else if (formData.manager.length > 100) newErrors.manager = 'اسم المدير يجب أن يكون أقل من 100 حرف'

    if (!formData.phonefield.trim()) newErrors.phonefield = 'رقم الهاتف مطلوب'

    if (!formData.icon.trim()) newErrors.icon = 'أيقونة الاستمارة مطلوبة'

    // if (formData.description && formData.description.length > 500) {
    //   newErrors.description = 'الوصف يجب أن يكون أقل من 500 حرف'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof CreateFormKindRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // فقط نتحقق من الحقول الموجودة في errors
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج')
      return
    }

    try {
      if (isEdit && id) {
        await updateFormKind({
          id,
          data: formData
        }).unwrap()
        
        const successMsg = `تم تحديث نوع الاستمارة "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(successMsg, {
          description: `تم حفظ التغييرات على نوع الاستمارة`,
          duration: 4000,
        })
      } else {
        const response = await createFormKind(formData).unwrap()
        
        const successMsg = `تم إضافة نوع الاستمارة "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(successMsg, {
          description: `تم إنشاء نوع استمارة جديد بنجاح`,
          duration: 4000,
        })
      }
      
      setIsSuccess(true)
      
      setTimeout(() => {
        setIsSuccess(false)
        setSuccessMessage(null)
        router.back()
      }, 2000)

    } catch (error: any) {
      console.error('خطأ في حفظ البيانات:', error)
      
      const errorMessage = error?.data?.message || 'حدث خطأ أثناء حفظ البيانات'
      const operation = isEdit ? 'تحديث' : 'إضافة'
      
      toast.error(`فشل في ${operation} نوع الاستمارة`, {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  // الحصول على الأيقونة المحددة
  const getSelectedIcon = () => {
    const selectedIcon = iconOptions.find(option => option.value === formData.icon)
    return selectedIcon ? selectedIcon.emoji : '📄'
  }

  // Count active fields
  const activeFieldsCount = booleanFields.filter(
    field => formData[field.key as keyof CreateFormKindRequest]
  ).length

  const isLoading = isCreating || isUpdating

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Success Banner */}
      {successMessage && (
        <SuccessBanner 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'تعديل نوع الاستمارة' : 'إضافة نوع استمارة جديد'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تعديل بيانات نوع الاستمارة' : 'إضافة نوع استمارة جديد في النظام'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Form Kind Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">اسم نوع الاستمارة *</Label>
                  <Input
                    id="name"
                    placeholder="مثال: طلب تقديم للوظيفة"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                    maxLength={30}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Manager Name */}
                <div className="space-y-2">
                  <Label htmlFor="manager">اسم المدير المسؤول *</Label>
                  <Input
                    id="manager"
                    placeholder="اسم المدير المسؤول عن هذا النوع"
                    value={formData.manager}
                    onChange={(e) => handleChange('manager', e.target.value)}
                    className={errors.manager ? 'border-destructive' : ''}
                    disabled={isLoading}
                    maxLength={100}
                  />
                  {errors.manager && (
                    <p className="text-sm text-destructive">{errors.manager}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phonefield">رقم الهاتف *</Label>
                  <Input
                    id="phonefield"
                    type="tel"
                    placeholder="رقم هاتف المدير المسؤول"
                    value={formData.phonefield}
                    onChange={(e) => handleChange('phonefield', e.target.value)}
                    className={errors.phonefield ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.phonefield && (
                    <p className="text-sm text-destructive">{errors.phonefield}</p>
                  )}
                </div>

                {/* Description */}
                {/* <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف نوع الاستمارة (اختياري)"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>وصف مختصر لنوع الاستمارة</span>
                    <span>{formData.description?.length || 0}/500</span>
                  </div>
                </div> */}

                {/* Icon Selection */}
                <div className="space-y-2">
                  <Label htmlFor="icon">أيقونة الاستمارة *</Label>
                  <Select 
                    value={formData.icon} 
                    onValueChange={(value) => handleChange('icon', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.icon ? 'border-destructive' : ''}>
                      <SelectValue placeholder="اختر أيقونة" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.icon && (
                    <p className="text-sm text-destructive">{errors.icon}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  إعدادات ومتطلبات الاستمارة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">حالة الاستمارة</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد ما إذا كانت الاستمارة نشطة ومتاحة للاستخدام
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {formData.is_active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="relative inline-flex items-center">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleChange('is_active', checked)}
                        disabled={isLoading}
                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {formData.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </div>

                {/* University Requirement */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">يتطلب اختيار جامعة</Label>
                    <p className="text-sm text-muted-foreground">
                      هل يتطلب هذا النوع من الاستمارات إدخال بيانات الجامعة؟
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className={`h-4 w-4 ${
                      formData.requires_university ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <Switch
                      checked={formData.requires_university}
                      onCheckedChange={(checked) => handleChange('requires_university', checked)}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                    />
                    <span className={`text-sm font-medium ${
                      formData.requires_university ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {formData.requires_university ? 'مطلوب' : 'غير مطلوب'}
                    </span>
                  </div>
                </div>

                {/* File Upload Requirement */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">يتطلب رفع ملفات</Label>
                    <p className="text-sm text-muted-foreground">
                      هل يتطلب هذا النوع من الاستمارات رفع ملفات مرفقة؟
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Upload className={`h-4 w-4 ${
                      formData.requires_file_upload ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <Switch
                      checked={formData.requires_file_upload}
                      onCheckedChange={(checked) => handleChange('requires_file_upload', checked)}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300"
                    />
                    <span className={`text-sm font-medium ${
                      formData.requires_file_upload ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {formData.requires_file_upload ? 'مطلوب' : 'غير مطلوب'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    تكوين الحقول المطلوبة
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {activeFieldsCount} من {booleanFields.length} حقل نشط
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>ملاحظة:</strong> اختر الحقول التي تريد أن تظهر في هذا النوع من الاستمارات. انقر على المفتاح لتفعيل أو إلغاء تفعيل الحقل.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {booleanFields.map((field) => {
                    const Icon = field.icon
                    const isActive = formData[field.key as keyof CreateFormKindRequest] as boolean
                    
                    return (
                      <div
                        key={field.key}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'border-green-500 bg-green-50 shadow-sm' 
                            : 'border-gray-300 hover:border-primary/40 bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-md transition-colors ${
                            isActive 
                              ? 'bg-green-100' 
                              : 'bg-muted'
                          }`}>
                            <Icon className={`h-4 w-4 ${
                              isActive ? 'text-green-600' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <Label 
                            htmlFor={field.key}
                            className={`text-sm font-medium cursor-pointer ${
                              isActive ? 'text-green-700' : 'text-foreground'
                            }`}
                          >
                            {field.label}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="text-xs font-bold text-white px-3 py-1.5 bg-green-600 rounded-full whitespace-nowrap">
                              ✓ مفعّل
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-600 px-3 py-1.5 bg-gray-200 rounded-full whitespace-nowrap">
                              غير مفعّل
                            </span>
                          )}
                          <Switch
                            id={field.key}
                            checked={isActive}
                            onCheckedChange={(checked) => handleChange(field.key as keyof CreateFormKindRequest, checked)}
                            disabled={isLoading}
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {activeFieldsCount === 0 && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      ⚠️ لم يتم تفعيل أي حقول. قم بتفعيل الحقول المطلوبة للاستمارة.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>معاينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-300 ${
                  isSuccess ? 'border-green-500 bg-green-50 scale-105' : ''
                }`}>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback 
                      className={`font-bold transition-transform duration-300 bg-blue-500 text-white ${
                        isSuccess ? 'scale-110' : ''
                      }`}
                    >
                      <span className="text-lg">{getSelectedIcon()}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors duration-300 ${
                      isSuccess ? 'text-green-800' : ''
                    }`}>
                      {formData.name || 'اسم نوع الاستمارة'}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      isSuccess ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      المدير: {formData.manager || 'اسم المدير'}
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${
                      isSuccess ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {formData.phonefield || 'رقم الهاتف'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {formData.is_active ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          نشط
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          غير نشط
                        </span>
                      )}
                      {formData.requires_university && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          جامعة
                        </span>
                      )}
                      {formData.requires_file_upload && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          ملف
                        </span>
                      )}
                      {activeFieldsCount > 0 && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          {activeFieldsCount} حقل
                        </span>
                      )}
                    </div>
                  </div>
                  {isSuccess && (
                    <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
                {formData.description && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {formData.description}
                    </p>
                  </div>
                )}
                
                {/* Active Fields Summary */}
                {activeFieldsCount > 0 && (
                  <div className="mt-4">
                    <Separator className="mb-3" />
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        الحقول النشطة ({activeFieldsCount}):
                      </p>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {booleanFields
                          .filter(field => formData[field.key as keyof CreateFormKindRequest])
                          .map(field => (
                            <span
                              key={field.key}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {field.label}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    variant={isSuccess ? "default" : "outline"}
                    disabled={isLoading}
                    className={`w-full transition-all duration-300 ${
                      isSuccess 
                        ? 'bg-green-500 hover:bg-green-600 text-white transform scale-105' 
                        : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جاري الحفظ...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4 ml-2" />
                        تم الحفظ بنجاح!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 ml-2" />
                        {isEdit ? 'حفظ التغييرات' : 'إضافة نوع الاستمارة'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <X className="h-4 w-4 ml-2" />
                    إلغاء
                  </Button>
                </div>

                {/* Form Statistics */}
                <Separator className="my-4" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>الحالة:</span>
                    <span className="font-medium">{formData.is_active ? 'نشط' : 'غير نشط'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>متطلبات خاصة:</span>
                    <span className="font-medium">
                      {formData.requires_university || formData.requires_file_upload 
                        ? `${formData.requires_university ? 'جامعة' : ''}${formData.requires_university && formData.requires_file_upload ? ' + ' : ''}${formData.requires_file_upload ? 'ملف' : ''}`
                        : 'لا توجد'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>عدد الحقول النشطة:</span>
                    <span className="font-medium">{activeFieldsCount} حقل</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    نصائح مفيدة
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• اختر اسماً واضحاً ومختصراً لنوع الاستمارة</li>
                    <li>• حدد المدير المسؤول ورقم تواصله</li>
                    <li>• فعّل الحقول المطلوبة فقط لتبسيط النموذج</li>
                    {/* <li>• استخدم الوصف لتوضيح الغرض من الاستمارة</li> */}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateOrUpdateFormKind