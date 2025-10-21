"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tag,
  Edit,
  Loader2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Palette,
  Calendar,
  FileText,
} from "lucide-react";
import {
  useGetNewsTypeQuery,
  useDeleteNewsTypeMutation,
} from "@/services/newstype";
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
import { formatDate, formatDateTime } from "@/utils/formatDate";

const NewsTypeDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

const {
  data: newsTypeData,
  isLoading,
  error,
  refetch,
} = useGetNewsTypeQuery(id, {
  skip: !id,
});

  const [deleteNewsType, { isLoading: isDeleting }] = useDeleteNewsTypeMutation();
  // إزالة useToggleNewsTypeActiveMutation إذا لم يكن متوفراً في API
  // const [toggleActive, { isLoading: isToggling }] = useToggleNewsTypeActiveMutation();
  // استخراج البيانات بشكل صحيح
const newsType = newsTypeData;
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
    router.push(`/dashboard/newstypes/createOrUpdate?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // إزالة أو تعطيل هذه الدالة إذا لم يكن endpoint متوفراً
  /*
  const handleToggleActive = async () => {
    if (!newsType?.id) return;

    try {
      await toggleActive(newsType.id).unwrap();
      toast.success(`تم ${newsType.is_active ? 'إلغاء تفعيل' : 'تفعيل'} التصنيف بنجاح`);
      refetch();
    } catch (error: any) {
      console.error("خطأ في تغيير حالة التصنيف:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء تغيير حالة التصنيف");
    }
  };
  */

  const handleDelete = async () => {
    if (!newsType?.id) return;

    try {
      await deleteNewsType(newsType.id).unwrap();
      toast.success("تم حذف التصنيف بنجاح");
      router.push("/dashboard/newstypes");
    } catch (error: any) {
      console.error("خطأ في حذف التصنيف:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف التصنيف");
    } finally {
      setIsDeleteDialogOpen(false);
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
          <p className="text-muted-foreground">جاري تحميل تفاصيل التصنيف...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading news type:', error);
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
                حدث خطأ أثناء تحميل تفاصيل التصنيف
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

  if (!newsType || !newsType.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                لم يتم العثور على التصنيف
              </h3>
              <p className="text-muted-foreground mb-4">
                التصنيف المطلوب غير موجود أو تم حذفه
              </p>
              <Button onClick={() => router.push('/dashboard/newstypes')}>
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
            <Tag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تفاصيل التصنيف</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* زر تفعيل/إلغاء التفعيل - معطل مؤقتاً */}
          {/*
          <Button 
            onClick={handleToggleActive}
            variant="outline"
            disabled={isToggling}
            className={newsType.is_active ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : 'border-green-500 text-green-600 hover:bg-green-50'}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : newsType.is_active ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {isToggling ? 'جاري التحديث...' : (newsType.is_active ? 'إلغاء التفعيل' : 'تفعيل')}
          </Button>
          */}

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
                  تأكيد حذف التصنيف
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div
                    className="text-right space-y-4 !text-gray-800 dark:!text-gray-200"
                    style={{ color: "#1f2937" }}
                  >
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف التصنيف التالي؟
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
                            backgroundColor: newsType.color || '#3B82F6',
                            color: getTextColor(newsType.color || '#3B82F6')
                          }}
                        >
                          <Tag className="w-3 h-3" />
                        </div>
                        <div
                          className="font-bold text-lg !text-gray-900 dark:!text-white"
                          style={{ color: "#111827" }}
                        >
                          {newsType.name}
                        </div>
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        عدد الأخبار: {newsType.news_count || 0}
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
                          التصنيف نهائياً.
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

      {/* News Type Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback
                className="font-bold text-2xl"
                style={{ 
                  backgroundColor: newsType.color || '#3B82F6',
                  color: getTextColor(newsType.color || '#3B82F6')
                }}
              >
                <Tag className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{newsType.name}</h2>
                <Badge variant={newsType.is_active ? "default" : "secondary"}>
                  {newsType.is_active ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      نشط
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      غير نشط
                    </>
                  )}
                </Badge>
              </div>
              {newsType.description && (
                <p className="text-muted-foreground mb-3">{newsType.description}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: newsType.color || '#3B82F6' }}
                  />
                  <span className="font-mono font-medium text-sm">{newsType.color || '#3B82F6'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyToClipboard(newsType.color || '#3B82F6', "لون التصنيف")
                    }
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{newsType.news_count || 0} خبر</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Type Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            معلومات التصنيف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<Tag className="h-4 w-4 text-muted-foreground" />}
              label="اسم التصنيف"
              value={newsType.name}
              copyable
              onCopy={() => handleCopyToClipboard(newsType.name, "اسم التصنيف")}
            />
            {newsType.slug && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="الرابط المختصر"
                  value={newsType.slug}
                  copyable
                  onCopy={() => handleCopyToClipboard(newsType.slug, "الرابط المختصر")}
                />
              </>
            )}
            {newsType.description && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="الوصف"
                  value={newsType.description}
                />
              </>
            )}
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: newsType.color || '#3B82F6' }}
                />
              }
              label="لون التصنيف"
              value={newsType.color || '#3B82F6'}
              copyable
              onCopy={() => handleCopyToClipboard(newsType.color || '#3B82F6', "لون التصنيف")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={newsType.is_active ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              label="حالة التصنيف"
              value={newsType.is_active ? 'نشط' : 'غير نشط'}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              label="عدد الأخبار"
              value={`${newsType.news_count || 0} خبر`}
            />
            {newsType.created_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ الإنشاء"
                  value={formatDateTime(newsType.created_at)}
                />
              </>
            )}
            {newsType.updated_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ آخر تحديث"
                  value={formatDateTime(newsType.updated_at)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
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

export default NewsTypeDetailsPage;