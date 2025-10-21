"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Globe,
  Edit,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  Trash2,
  Copy,
  Calendar,
} from "lucide-react";
import {
  useGetCountryQuery,
  useDeleteCountryMutation,
} from "@/services/country";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const CountryDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: countryData,
    isLoading,
    error,
    refetch,
  } = useGetCountryQuery(String(id), {
    skip: !id,
  });

  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();

  const country = countryData?.data;

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/countries/createOrUpdate?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!country) return;

    try {
      await deleteCountry(country.id).unwrap();
      toast.success("تم حذف الدولة بنجاح");
      router.push("/dashboard/countries");
    } catch (error: any) {
      console.error("خطأ في حذف الدولة:", error);
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف الدولة");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // تحديد اللون حسب كود الدولة
  const getCountryColor = (code: string) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-600",
      "from-indigo-500 to-blue-600",
      "from-yellow-500 to-orange-600",
    ];
    const index = code.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الدولة...</p>
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
                حدث خطأ أثناء تحميل تفاصيل الدولة
              </p>
              <Button onClick={() => refetch()}>إعادة المحاولة</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!country) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تفاصيل الدولة</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* زر التعديل - محمي بصلاحية التحديث */}
          <Button onClick={handleEdit}variant={ "outline"}>
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
                  تأكيد حذف الدولة
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div
                    className="text-right space-y-4 !text-gray-800 dark:!text-gray-200"
                    style={{ color: "#1f2937" }}
                  >
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف الدولة التالية؟
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
                        {country.name}
                      </div>
                      <div
                        className="text-sm !text-gray-600 dark:!text-gray-400 font-mono"
                        style={{ color: "#6b7280" }}
                      >
                        الكود: {country.code}
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
                          الدولة نهائياً.
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

      {/* Country Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback
                className={`bg-gradient-to-br ${getCountryColor(
                  country.code
                )} text-white font-bold text-2xl`}
              >
                {country.code.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{country.name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-medium">{country.code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyToClipboard(country.code, "كود الدولة")
                    }
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Country Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            معلومات الدولة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              label="اسم الدولة"
              value={country.name}
              copyable
              onCopy={() => handleCopyToClipboard(country.name, "اسم الدولة")}
            />
            <div className="border-t border-border my-4"></div>
            <ListItem
              icon={
                <span className="h-4 w-4 text-muted-foreground font-mono font-bold">
                  CD
                </span>
              }
              label="كود الدولة"
              value={country.code}
              copyable
              onCopy={() => handleCopyToClipboard(country.code, "كود الدولة")}
            />
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

// حماية الصفحة - يجب أن يملك صلاحية عرض الدول
export default CountryDetailsPage;
