"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Edit,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  Trash2,
  Copy,
  Calendar,
  Globe,
  Building,
} from "lucide-react";
import {
  useGetUniversityQuery,
  useDeleteUniversityMutation,
} from "@/services/universities";
import { useGetCountryQuery } from "@/services/country";
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

const UniversityDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: universityData,
    isLoading,
    error,
    refetch,
  } = useGetUniversityQuery(String(id), {
    skip: !id,
  });

  const [deleteUniversity, { isLoading: isDeleting }] = useDeleteUniversityMutation();

  const university = universityData?.data;

  // جلب بيانات الدولة
  const {
    data: countryData,
    isLoading: isLoadingCountry,
  } = useGetCountryQuery(university?.country || "", {
    skip: !university?.country,
  });

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/universities/createOrUpdate?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!university) return;

    try {
      await deleteUniversity(university.id).unwrap();
      toast.success("تم حذف الجامعة بنجاح");
      router.push("/dashboard/universities");
    } catch (error: any) {
      console.error("خطأ في حذف الجامعة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف الجامعة");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // تحديد اللون حسب نوع الجامعة
  const getUniversityColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'from-blue-500 to-indigo-600'
      case 'private':
        return 'from-green-500 to-emerald-600'
      case 'mixed':
        return 'from-purple-500 to-violet-600'
      default:
        return 'from-gray-500 to-slate-600'
    }
  };

  const getUniversityTypeLabel = (type: string) => {
    switch (type) {
      case 'public':
        return 'حكومية'
      case 'private':
        return 'أهلية'
      case 'mixed':
        return 'مختلطة'
      default:
        return 'غير محدد'
    }
  };

  const getUniversityTypeColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'private':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'mixed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الجامعة...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
                حدث خطأ أثناء تحميل تفاصيل الجامعة
              </p>
              <Button onClick={() => refetch()}>إعادة المحاولة</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!university) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تفاصيل الجامعة</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
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
                  تأكيد حذف الجامعة
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div
                    className="text-right space-y-4 !text-gray-800 dark:!text-gray-200"
                    style={{ color: "#1f2937" }}
                  >
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف الجامعة التالية؟
                    </div>
                    <div
                      className="p-4 rounded-lg border text-right !bg-gray-50 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-600"
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div
                        className="font-bold text-lg mb-2 !text-gray-900 dark:!text-white"
                        style={{ color: "#111827" }}
                      >
                        {university.name}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getUniversityTypeColor(university.university_type)}`}
                        >
                          {getUniversityTypeLabel(university.university_type)}
                        </Badge>
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400"
                        style={{ color: "#6b7280" }}
                      >
                        الدولة: {countryData?.data?.name || university.country}
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
                          التراجع عنه. سيتم حذف جميع البيانات المرتبطة بهذه
                          الجامعة نهائياً.
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

      {/* University Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback
                className={`bg-gradient-to-br ${getUniversityColor(
                  university.university_type
                )} text-white font-bold text-2xl`}
              >
                <GraduationCap className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{university.name}</h2>
              <div className="flex items-center gap-4 mb-3">
                <Badge 
                  variant="outline" 
                  className={`${getUniversityTypeColor(university.university_type)}`}
                >
                  {getUniversityTypeLabel(university.university_type)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">جامعة {getUniversityTypeLabel(university.university_type)}</span>
                </div>
                
                {countryData?.data && (
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{countryData.data.name}</span>
                    <span className="text-xs text-muted-foreground">({countryData.data.code})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* University Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            معلومات الجامعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<Building className="h-4 w-4 text-muted-foreground" />}
              label="اسم الجامعة"
              value={university.name}
              copyable
              onCopy={() => handleCopyToClipboard(university.name, "اسم الجامعة")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<span className="h-4 w-4 text-muted-foreground font-mono font-bold">نوع</span>}
              label="نوع الجامعة"
              value={getUniversityTypeLabel(university.university_type)}
              badge={true}
              badgeColor={getUniversityTypeColor(university.university_type)}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              label="الدولة"
              value={isLoadingCountry ? "جاري التحميل..." : (countryData?.data?.name || university.country)}
              copyable={!!countryData?.data?.name}
              onCopy={() => countryData?.data?.name && handleCopyToClipboard(countryData.data.name, "اسم الدولة")}
            />
            
            {university.created_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="تاريخ الإنشاء"
                  value={formatDate(university.created_at)}
                />
              </>
            )}
            
            {university.updated_at && (
              <>
                <div className="border-t border-border my-4"></div>
                <ListItem
                  icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  label="آخر تحديث"
                  value={formatDate(university.updated_at)}
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
  badge = false,
  badgeColor = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  badge?: boolean;
  badgeColor?: string;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 flex-1">
        {icon}
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            {badge ? (
              <Badge variant="outline" className={badgeColor}>
                {value}
              </Badge>
            ) : (
              <p className="text-base font-medium text-foreground">{value}</p>
            )}
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

export default UniversityDetailsPage;