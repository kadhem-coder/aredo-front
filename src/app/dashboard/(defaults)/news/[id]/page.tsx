"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Newspaper,
  Edit,
  Loader2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Copy,
  Tag,
  Calendar,
  FileText,
  Image as ImageIcon,
  User,
  Eye,
  X,
  ZoomIn,
  Download,
  Settings,
} from "lucide-react";
import {
  useGetNewsByIdQuery,
  useDeleteNewsMutation,
  useDeleteNewsImageMutation,
  useUpdateNewsImageMutation,
} from "@/services/news";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatDateTime } from "@/utils/formatDate";

const NewsDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<any>(null);
  const [isDeleteImageDialogOpen, setIsDeleteImageDialogOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<any>(null);
  const [isEditImageDialogOpen, setIsEditImageDialogOpen] = useState(false);

  const {
    data: newsData,
    isLoading,
    error,
    refetch,
  } = useGetNewsByIdQuery(id, {
    skip: !id,
  });

  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();
  const [deleteNewsImage, { isLoading: isDeletingImage }] = useDeleteNewsImageMutation();
  const [updateNewsImage, { isLoading: isUpdatingImage }] = useUpdateNewsImageMutation();
  
  // استخراج البيانات بشكل صحيح
  const news = newsData?.data;
  const handleCopyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label}`);
    } else {
      // fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`تم نسخ ${label}`);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/news/createOrUpdate?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!news?.id) return;

    try {
      await deleteNews(news.id).unwrap();
      toast.success("تم حذف الخبر بنجاح");
      router.push("/dashboard/news");
    } catch (error: any) {
      console.error("خطأ في حذف الخبر:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف الخبر");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // فتح modal عرض الصورة
  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  // إغلاق modal عرض الصورة
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  // فتح dialog حذف الصورة
  const handleDeleteImage = (image: any) => {
    setImageToDelete(image);
    setIsDeleteImageDialogOpen(true);
  };

  // فتح dialog تحرير الصورة
  const handleEditImage = (image: any) => {
    setImageToEdit(image);
    setIsEditImageDialogOpen(true);
  };

  // حذف الصورة
  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await deleteNewsImage(imageToDelete.id).unwrap();
      toast.success("تم حذف الصورة بنجاح");
      refetch(); // إعادة تحميل البيانات
    } catch (error: any) {
      console.error("خطأ في حذف الصورة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف الصورة");
    } finally {
      setIsDeleteImageDialogOpen(false);
      setImageToDelete(null);
    }
  };

  // تحديث بيانات الصورة
  const handleUpdateImage = async (formData: FormData) => {
    if (!imageToEdit) return;

    try {
      const updateData: any = {};
      
      const title = formData.get('title') as string;
      const caption = formData.get('caption') as string;
      const imageType = formData.get('image_type') as string;
      const order = formData.get('order') as string;
      const isActive = formData.get('is_active') as string;

      if (title !== imageToEdit.title) updateData.title = title;
      if (caption !== imageToEdit.caption) updateData.caption = caption;
      if (imageType !== imageToEdit.image_type) updateData.image_type = imageType;
      if (parseInt(order) !== imageToEdit.order) updateData.order = parseInt(order);
      if ((isActive === 'on') !== imageToEdit.is_active) updateData.is_active = isActive === 'on';

      if (Object.keys(updateData).length > 0) {
        await updateNewsImage({ id: imageToEdit.id, data: updateData }).unwrap();
        toast.success("تم تحديث بيانات الصورة بنجاح");
        refetch();
      }
    } catch (error: any) {
      console.error("خطأ في تحديث الصورة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء تحديث الصورة");
    } finally {
      setIsEditImageDialogOpen(false);
      setImageToEdit(null);
    }
  };

  // تحميل الصورة
  const handleDownloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName || 'image.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("تم تحميل الصورة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الصورة");
    }
  };

  // تحديد لون النص حسب لون الخلفية
  const getTextColor = (backgroundColor: string) => {
    try {
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return brightness > 155 ? '#000000' : '#FFFFFF';
    } catch {
      return '#FFFFFF';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الخبر...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading news:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                خطأ في تحميل البيانات
              </h3>
              <p className="text-muted-foreground mb-4">
                حدث خطأ أثناء تحميل تفاصيل الخبر
              </p>
              <p className="text-sm text-red-500 mb-4">
                {(error as any)?.data?.message || (error as any)?.message || 'خطأ غير محدد'}
              </p>
              <Button onClick={() => refetch()}>إعادة المحاولة</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!news || !news.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                لم يتم العثور على الخبر
              </h3>
              <p className="text-muted-foreground mb-4">
                الخبر المطلوب غير موجود أو تم حذفه
              </p>
              <Button onClick={() => router.push('/dashboard/news')}>
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تفاصيل الخبر</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* زر التعديل */}
          <Button onClick={handleEdit} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button> 

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="max-w-md !bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-700 !shadow-xl"
              dir="rtl"
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                zIndex: 9999,
              }}
            >
              <AlertDialogHeader className="text-right">
                <AlertDialogTitle
                  className="flex items-center gap-2 text-right !text-gray-900 dark:!text-white font-bold text-lg"
                  style={{ color: "#111827" }}
                >
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  تأكيد حذف الخبر
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div
                    className="text-right space-y-4 !text-gray-800 dark:!text-gray-200"
                    style={{ color: "#1f2937" }}
                  >
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف الخبر التالي؟
                    </div>
                    <div
                      className="p-4 rounded-lg border text-right !bg-gray-50 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-600"
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: news.news_type?.color || '#3B82F6',
                            color: getTextColor(news.news_type?.color || '#3B82F6')
                          }}
                        >
                          <Newspaper className="w-3 h-3" />
                        </div>
                        <div
                          className="font-bold text-lg !text-gray-900 dark:!text-white"
                          style={{ color: "#111827" }}
                        >
                          {news.title}
                        </div>
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        التصنيف: {news.news_type?.name}
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        عدد الصور: {news.images?.length || 0}
                      </div>
                    </div>
                    <div
                      className="text-sm font-medium p-3 rounded-lg border !bg-red-50 dark:!bg-red-900/20 !border-red-200 dark:!border-red-800"
                      style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div
                          className="text-right !text-red-700 dark:!text-red-300"
                          style={{ color: "#b91c1c" }}
                        >
                          <strong>تحذير مهم:</strong> هذا الإجراء لا يمكن
                          التراجع عنه. سيتم حذف جميع البيانات المرتبطة بهذا
                          الخبر نهائياً.
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2 mt-6">
                <AlertDialogCancel
                  disabled={isDeleting}
                  className="mt-0 !text-gray-700 !bg-white !border-gray-300 hover:!bg-gray-50"
                  style={{
                    backgroundColor: "white",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                  }}
                >
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="!bg-red-600 !text-white hover:!bg-red-700 mt-0"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                  }}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف نهائي
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* News Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback
                className="font-bold text-2xl"
                style={{ 
                  backgroundColor: news.news_type?.color || '#3B82F6',
                  color: getTextColor(news.news_type?.color || '#3B82F6')
                }}
              >
                <Newspaper className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{news.title}</h2>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  <Eye className="h-3 w-3 mr-1" />
                  منشور
                </Badge>
              </div>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  
                  <span className="font-medium text-sm">{news.news_type_name}</span>
                </div>
                {news.images && news.images.length > 0 && (
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{news.images.length} صورة</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {news.content.length > 200 ? 
                  `${news.content.substring(0, 200)}...` : 
                  news.content
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            محتوى الخبر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">
              {news.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Images */}
      {news.images && news.images.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              صور الخبر ({news.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.images.map((image, index) => (
                <div key={image.id} className="space-y-2">
                  <div className="relative group aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={image.title || `صورة ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => handleImageClick(image)}
                    />
                    
                    {/* أزرار التحكم */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(image);
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage(image.image_url, image.title || `صورة_${index + 1}.jpg`);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditImage(image);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {image.title && (
                    <p className="text-sm font-medium">{image.title}</p>
                  )}
                  {image.caption && (
                    <p className="text-xs text-muted-foreground">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            معلومات الخبر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
           
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
              label="عدد الصور"
              value={`${news.images?.length || 0} صورة`}
            />
            {news.created_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ الإنشاء"
                  value={formatDateTime(news.created_at)}
                />
              </>
            )}
            {news.updated_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ آخر تحديث"
                  value={formatDateTime(news.updated_at)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedImage?.title || 'عرض الصورة'}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedImage && handleDownloadImage(selectedImage.image_url, selectedImage.title || 'صورة.jpg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  تحميل
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={closeImageModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title || 'صورة'}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              
              {selectedImage.title && (
                <div>
                  <h4 className="font-semibold mb-1">عنوان الصورة:</h4>
                  <p className="text-sm text-muted-foreground">{selectedImage.title}</p>
                </div>
              )}
              
              {selectedImage.caption && (
                <div>
                  <h4 className="font-semibold mb-1">وصف الصورة:</h4>
                  <p className="text-sm text-muted-foreground">{selectedImage.caption}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>نوع الصورة: {selectedImage.image_type || 'غير محدد'}</span>
                <span>الترتيب: {selectedImage.order || 0}</span>
                <span>الحالة: {selectedImage.is_active ? 'نشط' : 'غير نشط'}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Image Dialog */}
      <AlertDialog open={isDeleteImageDialogOpen} onOpenChange={setIsDeleteImageDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              تأكيد حذف الصورة
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-right space-y-4">
                <p>هل أنت متأكد من حذف هذه الصورة؟</p>
                {imageToDelete && (
                  <div className="p-4 border rounded-lg">
                    <img 
                      src={imageToDelete.image_url} 
                      alt={imageToDelete.title || 'صورة'}
                      className="w-full max-h-32 object-cover rounded mb-2"
                    />
                    {imageToDelete.title && (
                      <p className="font-medium">{imageToDelete.title}</p>
                    )}
                    {imageToDelete.caption && (
                      <p className="text-sm text-muted-foreground">{imageToDelete.caption}</p>
                    )}
                  </div>
                )}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      <strong>تحذير:</strong> هذا الإجراء لا يمكن التراجع عنه.
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteImage}
              disabled={isDeletingImage}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeletingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف الصورة
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Image Dialog */}
      <Dialog open={isEditImageDialogOpen} onOpenChange={setIsEditImageDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تحرير بيانات الصورة</DialogTitle>
          </DialogHeader>
          
          {imageToEdit && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateImage(formData);
            }} className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={imageToEdit.image_url} 
                  alt={imageToEdit.title || 'صورة'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">عنوان الصورة</label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={imageToEdit.title || ''}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="أدخل عنوان الصورة..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">وصف الصورة</label>
                  <textarea
                    name="caption"
                    defaultValue={imageToEdit.caption || ''}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="أدخل وصف الصورة..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">نوع الصورة</label>
                  <select
                    name="image_type"
                    defaultValue={imageToEdit.image_type || 'gallery'}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="gallery">معرض</option>
                    <option value="inline">مضمنة</option>
                    <option value="thumbnail">مصغرة</option>
                    <option value="banner">بانر</option>
                    <option value="infographic">إنفوجرافيك</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">ترتيب العرض</label>
                    <input
                      name="order"
                      type="number"
                      defaultValue={imageToEdit.order || 0}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      name="is_active"
                      type="checkbox"
                      id="is_active_edit"
                      defaultChecked={imageToEdit.is_active}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="is_active_edit" className="text-sm font-medium">نشط</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditImageDialogOpen(false)}
                  disabled={isUpdatingImage}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isUpdatingImage}>
                  {isUpdatingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    'حفظ التغييرات'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// List Item Component
const ListItem = ({
  icon,
  label,
  value,
  copyable = false,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 flex-1">
        {icon}
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-foreground">{value}</p>
            {copyable && onCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsPage;