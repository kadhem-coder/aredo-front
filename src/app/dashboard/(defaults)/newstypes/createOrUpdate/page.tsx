"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  Tag,
  Save,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
  Palette,
  Eye,
  EyeOff,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { 
  useCreateNewsTypeMutation, 
  useUpdateNewsTypeMutation,
  useGetNewsTypeQuery,
  type NewsType,
} from '@/services/newstype' // تصحيح مسار الاستيراد

interface FormData {
  name: string
  description: string
  color: string
  is_active: boolean
}

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

// قائمة الألوان المقترحة
const colorPresets = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
]

const CreateOrUpdateNewsType = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id

  // API Hooks
  const [createNewsType, { isLoading: isCreating }] = useCreateNewsTypeMutation()
  const [updateNewsType, { isLoading: isUpdating }] = useUpdateNewsTypeMutation()
  const { data: newsTypeData, isFetching } = useGetNewsTypeQuery(id!, {
    skip: !isEdit || !id,
  })

  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    is_active: true,
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Set form data when news type data is loaded
  useEffect(() => {
    if (newsTypeData && isEdit) {
      // البيانات تأتي مباشرة بعد التصحيح في API
      setFormData({
        name: newsTypeData.name || '',
        description: newsTypeData.description || '',
        color: newsTypeData.color || '#3B82F6',
        is_active: newsTypeData.is_active ?? true,
      })
    }
  }, [newsTypeData, isEdit])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'اسم التصنيف مطلوب'
    if (!formData.color.trim()) newErrors.color = 'لون التصنيف مطلوب'
    else if (!/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      newErrors.color = 'يجب أن يكون اللون بصيغة صحيحة (مثل: #3B82F6)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Partial<FormData>]) {
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
        const response = await updateNewsType({
          id,
          data: {
            name: formData.name,
            description: formData.description,
            color: formData.color,
            is_active: formData.is_active,
          }
        }).unwrap()
        
        // رسالة نجاح مفصلة للتحديث
        const successMsg = `تم تحديث التصنيف "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم حفظ التغييرات على تصنيف الأخبار`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => router.push(`/dashboard/news-types/${id}`) // تصحيح المسار
            }
          }
        )
      } else {
        const response = await createNewsType({
          name: formData.name,
          description: formData.description,
          color: formData.color,
          is_active: formData.is_active,
        }).unwrap()
        
        // رسالة نجاح مفصلة للإضافة
        const successMsg = `تم إضافة التصنيف "${formData.name}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم إنشاء تصنيف أخبار جديد بنجاح`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => {
                // البيانات موجودة في data
                const newNewsTypeId = response?.data?.id
                if (newNewsTypeId) {
                  router.push(`/dashboard/news-types/${newNewsTypeId}`) // تصحيح المسار
                } else {
                  router.push('/dashboard/news-types') // تصحيح المسار
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
            ? `تم حفظ تغييرات التصنيف "${formData.name}"`
            : `تم إنشاء تصنيف جديد "${formData.name}"`,
          { 
            duration: 3000,
            description: "يمكنك الآن مشاهدة التصنيف في قائمة التصنيفات"
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
        `فشل في ${operation} التصنيف`,
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

  // تحديد لون الأيقونة حسب لون التصنيف
  const getIconColor = (color: string) => {
    try {
      // تحويل hex إلى RGB للتحقق من السطوع
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return brightness > 155 ? '#000000' : '#FFFFFF'
    } catch {
      return '#FFFFFF'
    }
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
            {isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تعديل بيانات تصنيف الأخبار' : 'إضافة تصنيف جديد للأخبار في النظام'}
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
                  <Tag className="h-5 w-5" />
                  معلومات التصنيف
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* News Type Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">اسم التصنيف *</Label>
                  <Input
                    id="name"
                    placeholder="مثال: أخبار رياضية"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف التصنيف (اختياري)"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    وصف مختصر للتصنيف لمساعدة المحررين في فهم الغرض منه
                  </p>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <Label htmlFor="color">لون التصنيف *</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="w-16 h-10 p-1 border rounded-lg cursor-pointer"
                        disabled={isLoading}
                      />
                      <Input
                        placeholder="#3B82F6"
                        value={formData.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className={`font-mono ${errors.color ? 'border-destructive' : ''}`}
                        dir="ltr"
                        disabled={isLoading}
                      />
                    </div>
                    
                    {/* Color Presets */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">ألوان مقترحة:</Label>
                      <div className="flex flex-wrap gap-2">
                        {colorPresets.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleChange('color', color)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                              formData.color === color 
                                ? 'border-foreground shadow-lg scale-110' 
                                : 'border-border hover:border-foreground/50'
                            }`}
                            style={{ backgroundColor: color }}
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {errors.color && (
                    <p className="text-sm text-destructive">{errors.color}</p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">حالة التصنيف</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد ما إذا كان التصنيف نشطاً ومتاحاً للاستخدام
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {formData.is_active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange('is_active', checked)}
                      disabled={isLoading}
                    />
                    <span className={`text-sm font-medium ${
                      formData.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {formData.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
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
                    <AvatarFallback 
                      className={`font-bold transition-transform duration-300 ${
                        isSuccess ? 'scale-110' : ''
                      }`}
                      style={{ 
                        backgroundColor: formData.color,
                        color: getIconColor(formData.color)
                      }}
                    >
                      <Tag className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors duration-300 ${
                      isSuccess ? 'text-green-800' : ''
                    }`}>
                      {formData.name || 'اسم التصنيف'}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      isSuccess ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {formData.description || 'وصف التصنيف'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {formData.color}
                      </span>
                      {formData.is_active ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          نشط
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          غير نشط
                        </span>
                      )}
                    </div>
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
                        {isEdit ? 'حفظ التغييرات' : 'إضافة التصنيف'}
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

export default CreateOrUpdateNewsType