// app/dashboard/forms/createOrUpdate/page.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import { ArrowRight, Loader2, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  useCreateFormMutation, 
  useUpdateFormMutation,
  useGetFormQuery,
  type CreateFormRequest,
} from '@/services/forms'
import { useGetFormKindsQuery, useGetFormKindQuery, type FormKind } from '@/services/formkinds'
import { useGetUniversitiesQuery } from '@/services/universities'

// Components
import { FormSections } from './_components/FormSections'
import { Sidebar } from './_components/Sidebar'
import { FIELD_CATEGORIES } from './_components/FormConstants'

interface FormData extends Omit<CreateFormRequest, 'pdf'> {
  pdf?: File | null
}

// Success Banner Component
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

const CreateOrUpdateForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id

  // API Hooks
  const [createForm, { isLoading: isCreating }] = useCreateFormMutation()
  const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation()
  const { data: formData, isFetching } = useGetFormQuery(id!, { skip: !isEdit || !id })
  const { data: formKindsData, isLoading: isLoadingKinds } = useGetFormKindsQuery({ page: 1, page_size: 100 })
  const { data: universitiesData, isLoading: isLoadingUniversities } = useGetUniversitiesQuery({ page: 1, page_size: 100 })

  // Selected FormKind State
  const [selectedKindId, setSelectedKindId] = useState<string>('')
  const { data: selectedFormKindData } = useGetFormKindQuery(selectedKindId, { skip: !selectedKindId })
  const selectedFormKind: FormKind | undefined = selectedFormKindData?.data

  // Form State
  const [formData2, setFormData2] = useState<FormData>({
    kind: '',
    full_name: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // ✅ Load Form Data (Edit Mode) - محسّن
  useEffect(() => {
    if (formData?.data && isEdit) {
      const form = formData.data
      
      // ✅ تعيين kind_id أولاً
      const kindId = form.kind || ''
      
      const newFormData: FormData = {
        kind: kindId, // ✅ استخدام kind مباشرة من الـ API
        full_name: form.full_name || '',
        email: form.email || '',
        phone: form.phone || '',
      }
      
      // Populate all fields dynamically
      const allFields = [
        ...FIELD_CATEGORIES.personal,
        ...FIELD_CATEGORIES.academic,
        ...FIELD_CATEGORIES.financial,
        ...FIELD_CATEGORIES.additional,
        ...FIELD_CATEGORIES.boolean,
        ...FIELD_CATEGORIES.status,
      ]
      
      allFields.forEach(field => {
        if ((form as any)[field] !== undefined) {
          (newFormData as any)[field] = (form as any)[field]
        }
      })
      
      // ✅ تحديث الـ state مرة واحدة
      setFormData2(newFormData)
      
      // ✅ تعيين selectedKindId لتحميل تفاصيل FormKind
      if (kindId) {
        setSelectedKindId(kindId)
      }
    }
  }, [formData, isEdit])

  // ✅ تحديث selectedKindId عندما يتغير kind في الـ form
  useEffect(() => {
    if (formData2.kind && formData2.kind !== selectedKindId) {
      setSelectedKindId(formData2.kind)
    }
  }, [formData2.kind])

  // Get Active Fields from FormKind
  const getActiveFields = (): string[] => {
    if (!selectedFormKind) return []
    
    const fields: string[] = []
    const allFieldKeys = [
      ...FIELD_CATEGORIES.personal,
      ...FIELD_CATEGORIES.academic,
      ...FIELD_CATEGORIES.financial,
      ...FIELD_CATEGORIES.additional,
      ...FIELD_CATEGORIES.boolean,
      ...FIELD_CATEGORIES.status,
    ]
    
    allFieldKeys.forEach(key => {
      if (selectedFormKind[key as keyof FormKind] === true) {
        fields.push(key)
      }
    })
    
    return fields
  }

  const activeFields = getActiveFields()

  // Categorize Active Fields
  const categorizedFields = {
    personal: activeFields.filter(f => FIELD_CATEGORIES.personal.includes(f)),
    academic: activeFields.filter(f => FIELD_CATEGORIES.academic.includes(f)),
    financial: activeFields.filter(f => FIELD_CATEGORIES.financial.includes(f)),
    additional: activeFields.filter(f => FIELD_CATEGORIES.additional.includes(f)),
    boolean: activeFields.filter(f => FIELD_CATEGORIES.boolean.includes(f)),
    status: activeFields.filter(f => FIELD_CATEGORIES.status.includes(f)),
  }

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData2.kind) newErrors.kind = 'نوع الاستمارة مطلوب'
    if (!formData2.full_name?.trim()) newErrors.full_name = 'الاسم الكامل مطلوب'
    if (!formData2.email?.trim()) newErrors.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData2.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح'
    }
    if (!formData2.phone?.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    else if (!/^07\d{9}$/.test(formData2.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof FormData, value: any) => {
    setFormData2(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData2(prev => ({ ...prev, pdf: file }))
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
      const submitData: CreateFormRequest = {
        ...formData2,
        pdf: formData2.pdf || undefined,
      }

      if (isEdit && id) {
        await updateForm({ id, data: submitData }).unwrap()
        const successMsg = `تم تحديث الاستمارة "${formData2.full_name}" بنجاح!`
        setSuccessMessage(successMsg)
        toast.success(successMsg)
      } else {
        await createForm(submitData).unwrap()
        const successMsg = `تم إضافة الاستمارة "${formData2.full_name}" بنجاح!`
        setSuccessMessage(successMsg)
        toast.success(successMsg)
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
      toast.error(errorMessage)
    }
  }

  const isLoading = isCreating || isUpdating

  // Loading State
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {successMessage && <SuccessBanner message={successMessage} onClose={() => setSuccessMessage(null)} />}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'تعديل الاستمارة' : 'إضافة استمارة جديدة'}
          </h1>
          <p className="text-muted-foreground">
            {selectedFormKind ? selectedFormKind.name : 'إدارة الاستمارات'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <FormSections
              selectedFormKind={selectedFormKind}
              formKindId={formData2.kind}
              formData={formData2}
              errors={errors}
              categorizedFields={categorizedFields}
              isLoading={isLoading}
              isEdit={isEdit}
              isLoadingKinds={isLoadingKinds}
              formKindsData={formKindsData}
              universitiesData={universitiesData}
              isLoadingUniversities={isLoadingUniversities}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
            />
          </div>

          {/* Sidebar - Right Side */}
          <Sidebar
            formData={formData2}
            selectedFormKind={selectedFormKind}
            isSuccess={isSuccess}
            isLoading={isLoading}
            isEdit={isEdit}
            activeFieldsCount={activeFields.length}
            onBack={() => router.back()}
          />
        </div>
      </form>
    </div>
  )
}

export default CreateOrUpdateForm