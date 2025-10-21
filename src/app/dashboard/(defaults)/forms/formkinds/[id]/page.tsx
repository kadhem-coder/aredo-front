"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Edit,
  Loader2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Upload,
  Activity,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  useGetFormKindQuery,
  useDeleteFormKindMutation,
  useToggleFormKindStatusMutation,
  formKindsHelpers,
} from "@/services/formkinds";
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

// Helper function to format dates
const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const FormKindDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: formKindResponse,
    isLoading,
    error,
    refetch,
  } = useGetFormKindQuery(id, {
    skip: !id,
  });

  const [deleteFormKind, { isLoading: isDeleting }] = useDeleteFormKindMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleFormKindStatusMutation();

  const formKind = formKindResponse?.data;

  const handleCopyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label}`);
    } else {
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
    router.push(`/dashboard/forms/formkinds/createOrUpdate?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleStatus = async () => {
    if (!formKind?.id) return;

    try {
      await toggleStatus(formKind.id).unwrap();
      toast.success(`تم ${formKind.is_active ? 'إلغاء تفعيل' : 'تفعيل'} نوع الاستمارة بنجاح`);
      refetch();
    } catch (error: any) {
      console.error("خطأ في تغيير حالة نوع الاستمارة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء تغيير حالة نوع الاستمارة");
    }
  };

  const handleDelete = async () => {
    if (!formKind?.id) return;

    try {
      await deleteFormKind(formKind.id).unwrap();
      toast.success("تم حذف نوع الاستمارة بنجاح");
      router.push("/dashboard/forms/formkinds");
    } catch (error: any) {
      console.error("خطأ في حذف نوع الاستمارة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف نوع الاستمارة");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل نوع الاستمارة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading form kind:', error);
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
                حدث خطأ أثناء تحميل تفاصيل نوع الاستمارة
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

  if (!formKind || !formKind.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                لم يتم العثور على نوع الاستمارة
              </h3>
              <p className="text-muted-foreground mb-4">
                نوع الاستمارة المطلوب غير موجود أو تم حذفه
              </p>
              <Button onClick={() => router.push('/dashboard/forms/formkinds')}>
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get active fields
  const activeFields = formKindsHelpers.getActiveFields(formKind);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تفاصيل نوع الاستمارة</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleToggleStatus}
            variant="outline"
            disabled={isToggling}
            className={formKind.is_active ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : 'border-green-500 text-green-600 hover:bg-green-50'}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : formKind.is_active ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {isToggling ? 'جاري التحديث...' : (formKind.is_active ? 'إلغاء التفعيل' : 'تفعيل')}
          </Button>

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
                  تأكيد حذف نوع الاستمارة
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div
                    className="text-right space-y-4 !text-gray-800 dark:!text-gray-200"
                    style={{ color: "#1f2937" }}
                  >
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف نوع الاستمارة التالي؟
                    </div>
                    <div
                      className="p-4 rounded-lg border text-right !bg-gray-50 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-600"
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <FileText className="w-3 h-3 text-white" />
                        </div>
                        <div
                          className="font-bold text-lg !text-gray-900 dark:!text-white"
                          style={{ color: "#111827" }}
                        >
                          {formKind.name}
                        </div>
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        المدير: {formKind.manager}
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        عدد الطلبات: {formKind.applications_count || '0'}
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
                          النوع نهائياً.
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

      {/* Form Kind Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="font-bold text-2xl bg-blue-500 text-white">
                <FileText className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{formKind.name}</h2>
                <Badge variant={formKind.is_active ? "default" : "secondary"}>
                  {formKind.is_active ? (
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
              {formKind.description && (
                <p className="text-muted-foreground mb-3">{formKind.description}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">المدير: {formKind.manager}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formKind.phonefield}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formKind.applications_count || '0'} طلب</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Kind Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            معلومات نوع الاستمارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              label="اسم نوع الاستمارة"
              value={formKind.name}
              copyable
              onCopy={() => handleCopyToClipboard(formKind.name, "اسم نوع الاستمارة")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<User className="h-4 w-4 text-muted-foreground" />}
              label="المدير المسؤول"
              value={formKind.manager}
              copyable
              onCopy={() => handleCopyToClipboard(formKind.manager, "اسم المدير")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<Phone className="h-4 w-4 text-muted-foreground" />}
              label="رقم الهاتف"
              value={formKind.phonefield}
              copyable
              onCopy={() => handleCopyToClipboard(formKind.phonefield, "رقم الهاتف")}
            />
            {formKind.description && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="الوصف"
                  value={formKind.description}
                />
              </>
            )}
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<Building className="h-4 w-4 text-muted-foreground" />}
              label="أيقونة الاستمارة"
              value={formKind.icon}
              copyable
              onCopy={() => handleCopyToClipboard(formKind.icon, "أيقونة الاستمارة")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={formKind.is_active ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              label="حالة الاستمارة"
              value={formKind.is_active ? 'نشط' : 'غير نشط'}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
              label="يتطلب اختيار جامعة"
              value={formKind.requires_university ? 'نعم' : 'لا'}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<Upload className="h-4 w-4 text-muted-foreground" />}
              label="يتطلب رفع ملف"
              value={formKind.requires_file_upload ? 'نعم' : 'لا'}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              label="عدد الطلبات"
              value={`${formKind.applications_count || '0'} طلب`}
            />
            {formKind.created_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ الإنشاء"
                  value={formatDateTime(formKind.created_at)}
                />
              </>
            )}
            {formKind.updated_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ آخر تحديث"
                  value={formatDateTime(formKind.updated_at)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Fields Card */}
      {activeFields.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              الحقول المطلوبة النشطة ({activeFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activeFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50"
                >
                  <CheckSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{field}</span>
                </div>
              ))}
            </div>
            {formKind.field_requirements && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>ملاحظة:</strong> يحتوي هذا النوع على متطلبات حقول محددة
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Active Fields */}
      {activeFields.length === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              الحقول المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-dashed">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                لم يتم تفعيل أي حقول إضافية لهذا النوع من الاستمارات
              </p>
            </div>
          </CardContent>
        </Card>
      )}
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

export default FormKindDetailsPage;