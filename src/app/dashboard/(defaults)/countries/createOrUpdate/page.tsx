"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  Globe,
  Save,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { 
  useCreateCountryMutation, 
  useUpdateCountryMutation,
  useGetCountryQuery,
} from '@/services/country'
import { formatDate } from '@/utils/formatDate'

interface FormData {
  name: string
  code: string
}

// تعريف أنواع الاستجابة من API
interface CountryResponse {
  id: string | number
  name: string
  code: string
  createdAt?: string
  updatedAt?: string
}

interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

interface CreateCountryResponse extends ApiResponse<CountryResponse> {}
interface UpdateCountryResponse extends ApiResponse<CountryResponse> {}

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

const CreateOrUpdateCountry = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id

  // API Hooks
  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation()
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation()
  const { data: countryData, isFetching } = useGetCountryQuery(id!, {
    skip: !isEdit || !id,
  })

  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Set form data when country data is loaded
  useEffect(() => {
    if (countryData?.data && isEdit) {
      const country = countryData.data
      setFormData({
        name: country.name || '',
        code: country.code || '',
      })
    }
  }, [countryData, isEdit])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'اسم الدولة مطلوب'
    if (!formData.code.trim()) {
      newErrors.code = 'كود الدولة مطلوب'
    } else if (formData.code.length < 2 || formData.code.length > 3) {
      newErrors.code = 'كود الدولة يجب أن يكون من 2-3 أحرف'
    } else if (!/^[A-Z]+$/.test(formData.code)) {
      newErrors.code = 'كود الدولة يجب أن يحتوي على أحرف إنجليزية كبيرة فقط'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof FormData, value: string) => {
    // تحويل كود الدولة إلى أحرف كبيرة
    if (name === 'code') {
      value = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // تشغيل صوت النجاح (اختياري)
  const playSuccessSound = () => {
    if (typeof window !== 'undefined' && window.Audio) {
      try {
        const audio = new Audio('/sounds/success.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {}) // تجاهل الأخطاء إذا لم يسمح المتصفح بالتشغيل
      } catch (error) {
        // تجاهل أخطاء الملف الصوتي
      }
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
        const response: UpdateCountryResponse = await updateCountry({
          id,
          data: {
            name: formData.name,
            code: formData.code,
          }
        }).unwrap()
        
        // رسالة نجاح مفصلة للتحديث
        const successMsg = `تم تحديث الدولة "${formData.name}" بنجاح! 🎉`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم حفظ التغييرات على الدولة ذات الكود "${formData.code}"`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => router.push(`/dashboard/countries/${id}`)
            }
          }
        )
      } else {
        const response: CreateCountryResponse = await createCountry({
          name: formData.name,
          code: formData.code,
        }).unwrap()
        
        // رسالة نجاح مفصلة للإضافة
        const successMsg = `تم إضافة الدولة "${formData.name}" بنجاح! 🎉`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم إنشاء دولة جديدة بالكود "${formData.code}"`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => {
                const newCountryId = response?.data?.id
                if (newCountryId) {
                  router.push(`/dashboard/countries/${newCountryId}`)
                } else {
                  router.push('/dashboard/countries')
                }
              }
            }
          }
        )
      }
      
      // تفعيل حالة النجاح للمؤثرات البصرية
      setIsSuccess(true)
      playSuccessSound()
      
      // عرض رسالة إضافية مع تفاصيل العملية
      setTimeout(() => {
        toast.info(
          isEdit 
            ? `✅ تم حفظ تغييرات الدولة ذات الكود "${formData.code}"`
            : `✅ تم إنشاء دولة جديدة بالكود "${formData.code}"`,
          { 
            duration: 3000,
            description: "يمكنك الآن مشاهدة الدولة في قائمة الدول"
          }
        )
      }, 1000)
      
      // إعادة تعيين حالة النجاح وإخفاء الرسالة والعودة
      setTimeout(() => {
        setIsSuccess(false)
        setSuccessMessage(null)
        router.back()
      }, 3000)

    } catch (error: any) {
      console.error('خطأ في حفظ البيانات:', error)
      
      // رسائل خطأ مفصلة
      const errorMessage = error?.data?.message || 'حدث خطأ أثناء حفظ البيانات'
      const operation = isEdit ? 'تحديث' : 'إضافة'
      
      toast.error(
        `❌ فشل في ${operation} الدولة`,
        {
          description: errorMessage,
          duration: 5000,
          action: {
            label: "إعادة المحاولة",
            onClick: () => handleSubmit(e)
          }
        }
      )
    }
  }

  // تحديد اللون حسب كود الدولة
  const getCountryColor = (code: string) => {
    if (!code) return 'from-gray-500 to-gray-600'
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600',
    ]
    const index = code.charCodeAt(0) % colors.length
    return colors[index]
  }

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
            {isEdit ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تعديل بيانات الدولة' : 'إضافة دولة جديدة إلى النظام'}
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
                  <Globe className="h-5 w-5" />
                  معلومات الدولة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Country Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الدولة *</Label>
                  <Input
                    id="name"
                    placeholder="مثال: العراق"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Country Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">كود الدولة *</Label>
                  <Input
                    id="code"
                    placeholder="مثال: IQ"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className={errors.code ? 'border-destructive' : ''}
                    maxLength={3}
                    style={{ textTransform: 'uppercase' }}
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    كود الدولة يجب أن يكون من 2-3 أحرف إنجليزية كبيرة (مثل: IQ, USA, UK)
                  </p>
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code}</p>
                  )}
                </div>
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
                    <AvatarFallback className={`bg-gradient-to-br ${getCountryColor(formData.code)} text-white font-bold transition-transform duration-300 ${
                      isSuccess ? 'scale-110' : ''
                    }`}>
                      {formData.code ? formData.code.substring(0, 2) : '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors duration-300 ${
                      isSuccess ? 'text-green-800' : ''
                    }`}>
                      {formData.name || 'اسم الدولة'}
                    </h3>
                    <p className={`text-sm font-mono transition-colors duration-300 ${
                      isSuccess ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {formData.code || 'CODE'}
                    </p>
                  </div>
                  {isSuccess && (
                    <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
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
                        {isEdit ? 'حفظ التغييرات' : 'إضافة الدولة'}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateOrUpdateCountry