"use client"

import {
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Phone,
  Building,
  GraduationCap,
  Upload,
  Info,
  ExternalLink,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { FormKind } from "@/services/formkinds"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface FormKindsListProps {
  formKinds: FormKind[]
  onViewDetails: (id: string) => void
  onEdit?: (formKind: FormKind) => void
  onDelete?: (id: string, name: string) => void
}

const FormKindsList = ({ 
  formKinds, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: FormKindsListProps) => {
  const router = useRouter()

  const handleEdit = (formKind: FormKind) => {
    if (onEdit) {
      onEdit(formKind)
    } else {
      router.push(`/dashboard/forms/formkinds/createOrUpdate?id=${formKind.id}`)
    }
  }

  const handleDelete = (formKind: FormKind) => {
    if (onDelete) {
      onDelete(formKind.id, formKind.name)
    }
  }

  const handleViewDetails = (formKindId: string) => {
    onViewDetails(formKindId)
  }

  const handleRowClick = (formKind: FormKind, event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]') ||
        (event.target as HTMLElement).closest('button')) {
      return
    }
    handleViewDetails(formKind.id)
  }

  // مكون صف فردي
  const FormKindRow = ({ formKind }: { formKind: FormKind }) => (
    <div
      className="px-6 py-6 hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 transition-all duration-300 bg-card cursor-pointer group border-b border-border/30 last:border-b-0"
      onClick={(e) => handleRowClick(formKind, e)}
    >
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* معلومات نوع الاستمارة */}
        <div className="col-span-4 min-w-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300 flex-shrink-0">
              <AvatarFallback 
                className="font-bold text-sm shadow-inner bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              >
                <FileText className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base text-card-foreground truncate group-hover:text-primary transition-colors duration-300 mb-1">
                {formKind.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Building className="h-3 w-3 mr-1" />
                  {formKind.icon}
                </Badge>
              </div>
              {formKind.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {formKind.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* المدير */}
        <div className="col-span-2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-card-foreground truncate">
                {formKind.manager}
              </p>
              <p className="text-xs text-muted-foreground">المدير المسؤول</p>
            </div>
          </div>
        </div>

        {/* الهاتف */}
        <div className="col-span-2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-card-foreground" dir="ltr">
                {formKind.phonefield}
              </p>
              <p className="text-xs text-muted-foreground">رقم التواصل</p>
            </div>
          </div>
        </div>

        {/* الحالة */}
        <div className="col-span-1 flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge 
                    variant={formKind.is_active ? "default" : "secondary"}
                    className={`transition-all duration-300 cursor-help ${
                      formKind.is_active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {formKind.is_active ? (
                      <>
                        <Activity className="h-3 w-3 mr-1" />
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
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {formKind.is_active 
                    ? 'نوع الاستمارة نشط ومتاح للاستخدام' 
                    : 'نوع الاستمارة غير نشط حالياً'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* المتطلبات */}
        <div className="col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {formKind.requires_university && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 cursor-help hover:bg-blue-100 transition-colors"
                    >
                      <GraduationCap className="h-3 w-3 mr-1" />
                      جامعة
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يتطلب من المستخدم اختيار جامعة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {formKind.requires_file_upload && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 cursor-help hover:bg-purple-100 transition-colors"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      ملف
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يتطلب من المستخدم رفع ملف</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {!formKind.requires_university && !formKind.requires_file_upload && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-gray-50 dark:bg-gray-950/50 text-gray-500 border-gray-200 dark:border-gray-800 cursor-help"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      أساسي
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>لا توجد متطلبات خاصة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* الإجراءات */}
        <div className="col-span-1 flex justify-center">
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 hover:bg-accent/60 rounded-lg transition-all duration-300 opacity-60 group-hover:opacity-100 hover:scale-110"
                      data-dropdown-trigger
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المزيد من الخيارات</p>
                </TooltipContent>
              </Tooltip>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 shadow-xl border-border/50 bg-card/95 backdrop-blur-sm"
              >
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(formKind.id);
                  }}
                  className="group/item hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors rounded-lg cursor-pointer"
                >
                  <Eye className="mr-3 h-4 w-4 text-blue-600 group-hover/item:text-blue-700 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">عرض التفاصيل</span>
                    <span className="text-xs text-muted-foreground">مشاهدة جميع المعلومات</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(formKind);
                  }}
                  className="group/item hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors rounded-lg cursor-pointer"
                >
                  <Edit className="mr-3 h-4 w-4 text-green-600 group-hover/item:text-green-700 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">تعديل البيانات</span>
                    <span className="text-xs text-muted-foreground">تحرير معلومات نوع الاستمارة</span>
                  </div>
                </DropdownMenuItem>

                <Separator className="my-1" />
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(formKind);
                  }}
                  className="text-destructive focus:text-destructive group/item hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-lg cursor-pointer"
                >
                  <Trash2 className="mr-3 h-4 w-4 group-hover/item:text-red-700 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">حذف نوع الاستمارة</span>
                    <span className="text-xs text-red-500/70">إزالة نهائية من النظام</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>

    
    </div>
  );

  if (!formKinds.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد أنواع استمارات</h3>
          <p className="text-muted-foreground">لم يتم العثور على أي أنواع استمارات لعرضها</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Table Header */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 px-6 py-4 border-b border-border/50">
              <div className="grid grid-cols-12 gap-6 text-sm font-bold text-card-foreground">
                <div className="col-span-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  نوع الاستمارة
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  المدير المسؤول
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600" />
                  رقم الهاتف
                </div>
                <div className="col-span-1 text-center flex items-center justify-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  الحالة
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-orange-600" />
                  المتطلبات
                </div>
                <div className="col-span-1 text-center">الإجراءات</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/30">
              {formKinds.map((formKind) => (
                <FormKindRow key={formKind.id} formKind={formKind} />
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  )
}

export default FormKindsList