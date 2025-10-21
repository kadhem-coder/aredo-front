"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  Newspaper,
  Save,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
  Tag,
  Type,
  FileText,
  Upload,
  Image as ImageIcon,
  Eye,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { 
  useCreateNewsMutation, 
  useUpdateNewsMutation,
  useGetNewsByIdQuery,
  useCreateNewsImageMutation,
  type News,
} from '@/services/news'
import {
  useGetNewsTypesQuery,
  type NewsType,
  type GetNewsTypesRequest,
} from '@/services/newstype'

interface FormData {
  title: string
  content: string
  news_type_id: string
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

const CreateOrUpdateNews = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const isEdit = !!id

  // API Hooks
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation()
  const [uploadImage] = useCreateNewsImageMutation()
  const { data: newsData, isFetching } = useGetNewsByIdQuery(id!, {
    skip: !isEdit || !id,
  })
  
  // جلب التصنيفات النشطة باستخدام useGetNewsTypesQuery مع التصفية
  const { data: newsTypesData } = useGetNewsTypesQuery({
    is_active: true,
    page_size: 50,
    ordering: 'name'
  })
  const newsTypes = newsTypesData?.results || []

  // Form State
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    news_type_id: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  // Set form data when news data is loaded
  useEffect(() => {
    if (newsData && isEdit) {
      setFormData({
        title: newsData?.data?.title || '',
        content: newsData?.data?.content || '',
        news_type_id: newsData?.data?.news_type?.id || '',
      })
    }
  }, [newsData, isEdit])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) newErrors.title = 'عنوان الخبر مطلوب'
    if (!formData.content.trim()) newErrors.content = 'محتوى الخبر مطلوب'
    if (!formData.news_type_id) newErrors.news_type_id = 'تصنيف الخبر مطلوب'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Partial<FormData>]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
      setSelectedImages(prev => [...prev, ...newImages])
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
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
      let newsId = id
      
      if (isEdit && id) {
        const response = await updateNews({
          id,
          data: {
            title: formData.title,
            content: formData.content,
            news_type_id: formData.news_type_id,
          }
        }).unwrap()
        
        // رسالة نجاح مفصلة للتحديث
        const successMsg = `تم تحديث الخبر "${formData.title}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم حفظ التغييرات على الخبر`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => router.push(`/dashboard/news/${id}`)
            }
          }
        )
      } else {
        const response = await createNews({
          title: formData.title,
          content: formData.content,
          news_type_id: formData.news_type_id,
        }).unwrap()
        
        newsId = response?.data?.id
        
        // رسالة نجاح مفصلة للإضافة
        const successMsg = `تم إضافة الخبر "${formData.title}" بنجاح!`
        setSuccessMessage(successMsg)
        
        toast.success(
          successMsg,
          {
            description: `تم إنشاء خبر جديد بنجاح`,
            duration: 4000,
            action: {
              label: "عرض التفاصيل",
              onClick: () => {
                if (newsId) {
                  router.push(`/dashboard/news/${newsId}`)
                } else {
                  router.push('/dashboard/news')
                }
              }
            }
          }
        )
      }
      
      // رفع الصور إذا كانت موجودة
      if (selectedImages.length > 0 && newsId) {
        try {
          for (const image of selectedImages) {
            await uploadImage({
              news: newsId,
              image: image,
              image_type: 'gallery',
              title: `صورة للخبر: ${formData.title}`,
              is_active: true,
            }).unwrap()
          }
          toast.success(`تم رفع ${selectedImages.length} صورة بنجاح`)
        } catch (imageError) {
          toast.error('تم حفظ الخبر ولكن فشل في رفع بعض الصور')
        }
      }
      
      // تفعيل حالة النجاح للمؤثرات البصرية
      setIsSuccess(true)
      playSuccessSound()
      
      // عرض رسالة إضافية مع تفاصيل العملية
      setTimeout(() => {
        toast.info(
          isEdit 
            ? `تم حفظ تغييرات الخبر "${formData.title}"`
            : `تم إنشاء خبر جديد "${formData.title}"`,
          { 
            duration: 3000,
            description: "يمكنك الآن مشاهدة الخبر في قائمة الأخبار"
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
        `فشل في ${operation} الخبر`,
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

  const selectedNewsType = newsTypes?.find(type => type.id === formData.news_type_id)

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
            {isEdit ? 'تعديل الخبر' : 'إضافة خبر جديد'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تعديل بيانات الخبر' : 'إضافة خبر جديد للأخبار في النظام'}
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
                  <Newspaper className="h-5 w-5" />
                  معلومات الخبر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* News Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الخبر *</Label>
                  <Input
                    id="title"
                    placeholder="مثال: أخبار مهمة اليوم"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* News Type */}
                <div className="space-y-2">
                  <Label htmlFor="news_type_id">تصنيف الخبر *</Label>
                  <Select 
                    value={formData.news_type_id} 
                    onValueChange={(value) => handleChange('news_type_id', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.news_type_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="اختر تصنيف الخبر" />
                    </SelectTrigger>
                    <SelectContent>
                      {newsTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: type.color }}
                            />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.news_type_id && (
                    <p className="text-sm text-destructive">{errors.news_type_id}</p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">محتوى الخبر *</Label>
                  <Textarea
                    id="content"
                    placeholder="اكتب محتوى الخبر هنا..."
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={8}
                    className={errors.content ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    اكتب محتوى مفصل للخبر ليتمكن القراء من فهم التفاصيل
                  </p>
                </div>

                {/* Images Upload */}
                <div className="space-y-2">
                  <Label htmlFor="images">صور الخبر</Label>
                  <div className="space-y-3">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      يمكنك رفع عدة صور للخبر (اختياري)
                    </p>
                    
                    {/* Selected Images Preview */}
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative border rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate">{image.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-white rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
                <div className={`space-y-3 transition-all duration-300 ${
                  isSuccess ? 'scale-105' : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback 
                        className={`font-bold transition-transform duration-300 ${
                          isSuccess ? 'scale-110' : ''
                        }`}
                        style={{ 
                          backgroundColor: selectedNewsType?.color || '#3B82F6',
                          color: selectedNewsType?.color ? (
                            // تحديد لون النص حسب لون الخلفية
                            (() => {
                              try {
                                const hex = selectedNewsType.color.replace('#', '')
                                const r = parseInt(hex.substr(0, 2), 16)
                                const g = parseInt(hex.substr(2, 2), 16)
                                const b = parseInt(hex.substr(4, 2), 16)
                                const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
                                return brightness > 155 ? '#000000' : '#FFFFFF'
                              } catch {
                                return '#FFFFFF'
                              }
                            })()
                          ) : '#FFFFFF'
                        }}
                      >
                        <Newspaper className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate transition-colors duration-300 ${
                        isSuccess ? 'text-green-800' : ''
                      }`}>
                        {formData.title || 'عنوان الخبر'}
                      </h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        isSuccess ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {selectedNewsType?.name || 'تصنيف الخبر'}
                      </p>
                      {selectedImages.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {selectedImages.length} صورة
                          </span>
                        </div>
                      )}
                    </div>
                    {isSuccess && (
                      <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
                    )}
                  </div>
                  
                  {formData.content && (
                    <div className="mt-3 p-3 border rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.content}
                      </p>
                    </div>
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
                        {isEdit ? 'حفظ التغييرات' : 'إضافة الخبر'}
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

export default CreateOrUpdateNews