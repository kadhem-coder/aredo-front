// ==================== 1. صفحة تفاصيل الاستمارة ([id]/page.tsx) ====================
// المسار: app/dashboard/forms/[id]/page.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
  FileText,
  Edit,
  Loader2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Copy,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react"
import {
  useGetFormQuery,
  useDeleteFormMutation,
  formsHelpers,
} from "@/services/forms"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/utils/formatDate"

const FormDetailsPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: formData,
    isLoading,
    error,
    refetch,
  } = useGetFormQuery(String(id), {
    skip: !id,
  })

  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation()

  const form = formData?.data

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`تم نسخ ${label}`)
  }

  const handleEdit = () => {
    router.push(`/dashboard/forms/createOrUpdate?id=${id}`)
  }

  const handleBack = () => {
    router.back()
  }

  const handleDelete = async () => {
    if (!form) return

    try {
      await deleteForm(form.id).unwrap()
      toast.success("تم حذف الاستمارة بنجاح")
      router.push("/dashboard/forms")
    } catch (error: any) {
      console.error("خطأ في حذف الاستمارة:", error)
      toast.error(error?.data?.message || "حدث خطأ أثناء حذف الاستمارة")
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusColor = () => {
    if (!form) return 'from-gray-500 to-slate-600'
    if (form.approved) return 'from-green-500 to-emerald-600'
    if (form.submitted) return 'from-blue-500 to-indigo-600'
    if (form.accepted) return 'from-purple-500 to-violet-600'
    return 'from-gray-500 to-slate-600'
  }

  const getStatusBadge = () => {
    if (!form) return { label: 'غير محدد', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    if (form.approved) return { label: 'موافق عليها', color: 'bg-green-100 text-green-800 border-green-200' }
    if (form.submitted) return { label: 'مقدمة', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (form.accepted) return { label: 'مقبولة', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    return { label: 'مسودة', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الاستمارة...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">خطأ في تحميل البيانات</h3>
              <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل تفاصيل الاستمارة</p>
              <Button onClick={() => refetch()}>إعادة المحاولة</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!form) return null

  const statusBadge = getStatusBadge()

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
            <h1 className="text-2xl font-bold">تفاصيل الاستمارة</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md" dir="rtl">
              <AlertDialogHeader className="text-right">
                <AlertDialogTitle className="flex items-center gap-2 text-right">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  تأكيد حذف الاستمارة
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="text-right space-y-4">
                    <div className="text-base font-medium">
                      هل أنت متأكد من حذف الاستمارة التالية؟
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="font-bold text-lg mb-2">{form.full_name}</div>
                      <div className="text-sm mb-2">{form.email}</div>
                      <Badge variant="outline" className={statusBadge.color}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium p-3 rounded-lg border bg-red-50 border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="text-right text-red-700">
                          <strong>تحذير مهم:</strong> هذا الإجراء لا يمكن التراجع عنه.
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
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

      {/* Form Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className={`bg-gradient-to-br ${getStatusColor()} text-white font-bold text-2xl`}>
                <FileText className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{form.full_name}</h2>
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="outline" className={statusBadge.color}>
                  {statusBadge.label}
                </Badge>
                <Badge variant="outline">{form.kind_display}</Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">إكمال: {form.completion_percentage}%</span>
                </div>
                
                {form.is_editable ? (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm text-green-700">قابل للتعديل</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-sm text-red-700">غير قابل للتعديل</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">نسبة الإكمال</span>
              <span className="font-bold">{form.completion_percentage}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${form.completion_percentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<User className="h-4 w-4 text-muted-foreground" />}
              label="الاسم الكامل"
              value={form.full_name}
              copyable
              onCopy={() => handleCopyToClipboard(form.full_name, "الاسم")}
            />
            <div className="border-t border-border my-4" />
            <ListItem
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              label="البريد الإلكتروني"
              value={form.email}
              copyable
              onCopy={() => handleCopyToClipboard(form.email, "البريد الإلكتروني")}
            />
            <div className="border-t border-border my-4" />
            <ListItem
              icon={<Phone className="h-4 w-4 text-muted-foreground" />}
              label="رقم الهاتف"
              value={form.phone}
              copyable
              onCopy={() => handleCopyToClipboard(form.phone, "رقم الهاتف")}
            />
            
            {form.department && (
              <>
                <div className="border-t border-border my-4" />
                <ListItem
                  icon={<Building className="h-4 w-4 text-muted-foreground" />}
                  label="القسم"
                  value={form.department}
                />
              </>
            )}

            {form.degree && (
              <>
                <div className="border-t border-border my-4" />
                <ListItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="الدرجة العلمية"
                  value={formsHelpers.getDegreeLabel(form.degree)}
                />
              </>
            )}

            {form.university_name && (
              <>
                <div className="border-t border-border my-4" />
                <ListItem
                  icon={<Building className="h-4 w-4 text-muted-foreground" />}
                  label="الجامعة"
                  value={form.university_name}
                />
              </>
            )}

            {form.notes && (
              <>
                <div className="border-t border-border my-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ملاحظات</p>
                  <p className="text-base text-foreground bg-muted/30 p-3 rounded-lg">
                    {form.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
{/* PDF Display Section */}
{form.pdf && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>الملف المرفق</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.open(form?.pdf ? form?.pdf : "" , '_blank');
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          تحميل PDF
        </Button>
      </CardTitle>
    </CardHeader>
 
  </Card>
)}
      {/* Status Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            حالة الاستمارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatusCard label="مقدمة" value={form.submitted} />
            <StatusCard label="موافق عليها" value={form.approved} />
            <StatusCard label="مقبولة" value={form.accepted} />
            <StatusCard label="مستلمة" value={form.received} />
            <StatusCard label="مدفوعة" value={form.payoff} />
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            التواريخ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ListItem
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              label="تاريخ التقديم"
              value={formatDate(form.date_applied)}
            />
            <div className="border-t border-border my-4" />
            <ListItem
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              label="تاريخ الإنشاء"
              value={formatDate(form.created_at)}
            />
            <div className="border-t border-border my-4" />
            <ListItem
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              label="آخر تحديث"
              value={formatDate(form.updated_at)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Status Card Component
const StatusCard = ({ label, value }: { label: string; value?: boolean }) => {
  return (
    <div className={`p-4 rounded-lg border ${value ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        {value ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        )}
        <span className={`text-sm font-medium ${value ? 'text-green-700' : 'text-gray-600'}`}>
          {label}
        </span>
      </div>
      <p className={`text-xs ${value ? 'text-green-600' : 'text-gray-500'}`}>
        {value ? 'نعم' : 'لا'}
      </p>
    </div>
  )
}

// List Item Component
const ListItem = ({
  icon,
  label,
  value,
  copyable = false,
  onCopy,
}: {
  icon: React.ReactNode
  label: string
  value: string
  copyable?: boolean
  onCopy?: () => void
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
              <Button variant="ghost" size="sm" onClick={onCopy} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDetailsPage