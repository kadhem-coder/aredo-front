"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  GraduationCap,
  Save,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
  Globe,
  Building,
  Upload,
  FileText,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { 
  useCreateUniversityMutation, 
  useUpdateUniversityMutation,
  useGetUniversityQuery,
} from '@/services/universities'
import { useGetCountriesQuery } from '@/services/country'

interface FormData {
  name: string
  country: string
  university_type: "public" | "private" | "international" | "community"
  pdf: File | null
}

interface UniversityResponse {
  id: string | number
  name: string
  country: string
  university_type: "public" | "private" | "international" | "community"
  pdf?: string | null
  created_at?: string
  updated_at?: string
}

interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

interface CreateUniversityResponse extends ApiResponse<UniversityResponse> {}
interface UpdateUniversityResponse extends ApiResponse<UniversityResponse> {}

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

const CreateOrUpdateUniversity = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createUniversity, { isLoading: isCreating }] = useCreateUniversityMutation()
  const [updateUniversity, { isLoading: isUpdating }] = useUpdateUniversityMutation()
  
  // جلب قائمة الدول أولاً
  const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery({
    page: 1,
    page_size: 100,
  })

  // جلب بيانات الجامعة فقط إذا كان في وضع التعديل
  const { data: universityData, isFetching: isFetchingUniversity } = useGetUniversityQuery(id!, {
    skip: !isEdit,
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    country: '',
    university_type: 'public',
    pdf: null,
  })

  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // التعامل مع تحميل البيانات وتعبيئة النموذج
  useEffect(() => {
    if (isEdit) {
      // في وضع التعديل: انتظر حتى تحميل كل من بيانات الجامعة والدول
      if (universityData?.data && countriesData?.data?.results && !isFetchingUniversity && !isLoadingCountries) {
        const university = universityData.data
        const countries = countriesData.data.results
        
        // تحويل country إلى string للتأكد من التطابق مع القائمة المنسدلة
        const countryId = String(university.country)
        
        // التحقق من وجود الدولة في القائمة
        const countryExists = countries.some((c: any) => String(c.id) === countryId)
        
        if (countryExists) {
          setFormData({
            name: university.name || '',
            country: countryId,
            university_type: university.university_type || 'public',
            pdf: null,
          })
          setExistingPdfUrl(university.pdf || null)
        } else {
          console.warn('الدولة غير موجودة في القائمة:', university.country)
          // تعيين البيانات الأساسية حتى لو لم تكن الدولة موجودة
          setFormData({
            name: university.name || '',
            country: '', // اترك حقل الدولة فارغاً
            university_type: university.university_type || 'public',
            pdf: null,
          })
          setExistingPdfUrl(university.pdf || null)
          toast.warning('الدولة الحالية غير متاحة في القائمة، يرجى اختيار دولة جديدة')
        }
        
        setIsDataLoaded(true)
      }
    } else {
      // في وضع الإضافة: اجعل النموذج جاهزاً بمجرد تحميل الدول
      setIsDataLoaded(true)
    }
  }, [universityData, countriesData, isFetchingUniversity, isLoadingCountries, isEdit])

  // دالة للحصول على اسم الدولة من ID
  const getCountryName = (countryId: string) => {
    if (!countryId || !countriesData?.data?.results) return ''
    
    const countries = countriesData.data.results
    const country = countries.find((c: any) => String(c.id) === String(countryId))
    return country ? country.name : ''
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = 'اسم الجامعة مطلوب'
    if (!formData.country) newErrors.country = 'الدولة مطلوبة'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // التحقق من نوع الملف
      if (file.type !== 'application/pdf') {
        toast.error('يرجى اختيار ملف PDF فقط')
        return
      }
      
      // التحقق من حجم الملف (10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('حجم الملف يجب أن يكون أقل من 10 ميجابايت')
        return
      }

      setFormData(prev => ({ ...prev, pdf: file }))
      toast.success('تم اختيار الملف بنجاح')
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, pdf: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveExistingPdf = () => {
    setExistingPdfUrl(null)
    toast.info('سيتم حذف الملف الحالي عند الحفظ')
  }

  const playSuccessSound = () => {
    if (typeof window !== 'undefined' && window.Audio) {
      try {
        const audio = new Audio('/sounds/success.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {})
      } catch (error) {}
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج')
      return
    }

    try {
      if (isEdit && id) {
        const response: UpdateUniversityResponse = await updateUniversity({
          id,
          data: {
            name: formData.name,
            country: formData.country,
            university_type: formData.university_type,
            pdf: formData.pdf,
          }
        }).unwrap()
        
        const successMsg = `تم تحديث الجامعة "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(successMsg, {
          description: formData.pdf ? 'تم حفظ التغييرات مع الملف الجديد' : 'تم حفظ التغييرات',
          duration: 4000,
        })
      } else {
        const response: CreateUniversityResponse = await createUniversity({
          name: formData.name,
          country: formData.country,
          university_type: formData.university_type,
          pdf: formData.pdf,
        }).unwrap()
        
        const successMsg = `تم إضافة الجامعة "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(successMsg, {
          description: formData.pdf ? 'تم إنشاء الجامعة مع الملف' : 'تم إنشاء الجامعة بنجاح',
          duration: 4000,
        })
      }
      
      setIsSuccess(true)
      playSuccessSound()
      
      setTimeout(() => {
        setIsSuccess(false)
        setSuccessMessage(null)
        router.back()
      }, 3000)

    } catch (error: any) {
      console.error('خطأ في حفظ البيانات:', error)
      
      const errorMessage = error?.data?.message || 'حدث خطأ أثناء حفظ البيانات'
      const operation = isEdit ? 'تحديث' : 'إضافة'
      
      toast.error(`فشل في ${operation} الجامعة`, {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  const getUniversityTypeLabel = (type: string) => {
    switch (type) {
      case 'public': return 'ابتعاث'
      case 'private': return 'نفقة خاصة'
      case 'international ': return 'ابتعاث طبية'
      case 'community ': return 'نفقة خاصة طبية'
      default: return 'غير محدد'
    }
  }

  const getUniversityTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'private': return 'bg-green-100 text-green-800 border-green-200'
      case 'international': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'community': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUniversityColor = (type: string) => {
    switch (type) {
      case 'public': return 'from-blue-500 to-indigo-600'
      case 'private': return 'from-green-500 to-emerald-600'
      case 'international': return 'from-purple-500 to-violet-600'
      case 'community': return 'from-purple-500 to-violet-600'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isLoading = isCreating || isUpdating

  // عرض حالة التحميل
  if ((isEdit && (isFetchingUniversity || isLoadingCountries || !isDataLoaded))) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium">جاري تحميل البيانات...</span>
          <span className="text-sm text-muted-foreground">
            {isFetchingUniversity ? 'جاري تحميل بيانات الجامعة' : 'جاري تحميل قائمة الدول'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {successMessage && (
        <SuccessBanner 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

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
            {isEdit ? 'تعديل الجامعة' : 'إضافة جامعة جديدة'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تعديل بيانات الجامعة' : 'إضافة جامعة جديدة إلى النظام'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  معلومات الجامعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الجامعة *</Label>
                  <Input
                    id="name"
                    placeholder="مثال: جامعة بغداد"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">الدولة *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange('country', value)}
                    disabled={isLoading || isLoadingCountries}
                  >
                    <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                      <SelectValue placeholder={
                        isLoadingCountries ? "جاري تحميل الدول..." : "اختر الدولة"
                      }>
                        {formData.country && getCountryName(formData.country)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCountries ? (
                        <div className="p-2 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">جاري تحميل الدول...</span>
                          </div>
                        </div>
                      ) : countriesData?.data?.results && countriesData.data.results.length > 0 ? (
                        countriesData.data.results.map((country: any) => (
                          <SelectItem key={country.id} value={String(country.id)}>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span>{country.name}</span>
                              <span className="text-muted-foreground text-xs">({country.code})</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center">
                          <span className="text-sm text-muted-foreground">لا توجد دول متاحة</span>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university_type">نوع الجامعة *</Label>
                  <Select
                    value={formData.university_type}
                    onValueChange={(value) => handleChange('university_type', value as any)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الجامعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-500" />
                          <span>ابتعاث</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-green-500" />
                          <span>نفقة خاصة</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="international ">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-500" />
                          <span>ابتعاث طبية</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="community ">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-500" />
                          <span>نفقة خاصة طبية</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* PDF Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  دليل الجامعة (PDF)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing PDF */}
                {existingPdfUrl && !formData.pdf && (
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">الملف الحالي</p>
                          <a 
                            href={existingPdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            عرض الملف
                          </a>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveExistingPdf}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* New PDF Upload */}
                {formData.pdf ? (
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">{formData.pdf.name}</p>
                          <p className="text-sm text-green-600">{formatFileSize(formData.pdf.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="pdf-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">انقر لرفع ملف</span> أو اسحب وأفلت
                        </p>
                        <p className="text-xs text-gray-500">PDF فقط (حتى 10MB)</p>
                      </div>
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معاينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex flex-col gap-3 p-4 border rounded-lg transition-all duration-300 ${
                  isSuccess ? 'border-green-500 bg-green-50 scale-105' : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`bg-gradient-to-br ${getUniversityColor(formData.university_type)} text-white font-bold transition-transform duration-300 ${
                        isSuccess ? 'scale-110' : ''
                      }`}>
                        <GraduationCap className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate transition-colors duration-300 ${
                        isSuccess ? 'text-green-800' : ''
                      }`}>
                        {formData.name || 'اسم الجامعة'}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${getUniversityTypeColor(formData.university_type)}`}
                      >
                        {getUniversityTypeLabel(formData.university_type)}
                      </Badge>
                    </div>
                    {isSuccess && (
                      <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
                    )}
                  </div>
                  
                  {formData.country && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">الدولة:</span>
                      <span className={`font-medium ${isSuccess ? 'text-green-700' : 'text-foreground'}`}>
                        {getCountryName(formData.country) || formData.country}
                      </span>
                    </div>
                  )}

                  {(formData.pdf || existingPdfUrl) && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">دليل PDF:</span>
                      <span className="font-medium text-green-600">متوفر</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
                        {isEdit ? 'حفظ التغييرات' : 'إضافة الجامعة'}
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

export default CreateOrUpdateUniversity