"use client"

import {
  FileText,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  Upload,
  Building,
  Info,
  ExternalLink,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

interface FormKindCardProps {
  formKind: FormKind
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const FormKindsGrid = ({ 
  formKind, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: FormKindCardProps) => {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/forms/formkinds/createOrUpdate?id=${formKind.id}`)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const handleViewDetails = () => {
    onViewDetails()
  }

  const handleCardClick = (event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu أو الأزرار
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]') || 
        (event.target as HTMLElement).closest('button')) {
      return
    }
    handleViewDetails()
  }

  return (
    <TooltipProvider>
      <Card 
        className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/40 cursor-pointer bg-card/50 backdrop-blur-sm overflow-hidden"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-blue-950/10 dark:via-background dark:to-purple-950/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-lg group-hover:ring-primary/40 transition-all duration-300">
                <AvatarFallback 
                  className="font-bold text-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <FileText className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-1">
                  {formKind.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={formKind.is_active ? "default" : "secondary"} 
                    className={`text-xs transition-all duration-300 ${
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
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <Building className="h-3 w-3 mr-1" />
                    {formKind.icon}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formKind.manager}</span>
                </div>
              </div>
            </div>
            
            {/* قائمة الإجراءات */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 rounded-lg"
                      data-dropdown-trigger
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المزيد من الخيارات</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-52 shadow-xl border-border/50">
                {/* عرض التفاصيل */}
                <DropdownMenuItem onClick={handleViewDetails} className="group/item">
                  <Eye className="mr-3 h-4 w-4 text-blue-600 group-hover/item:text-blue-700" />
                  <span>عرض التفاصيل الكاملة</span>
                </DropdownMenuItem>

                {/* تعديل */}
                <DropdownMenuItem onClick={handleEdit} className="group/item">
                  <Edit className="mr-3 h-4 w-4 text-green-600 group-hover/item:text-green-700" />
                  <span>تعديل البيانات</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* حذف */}
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive group/item"
                >
                  <Trash2 className="mr-3 h-4 w-4 group-hover/item:text-red-700" />
                  <span>حذف نوع الاستمارة</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2">        
          <div className="space-y-4">
            {/* معلومات الاتصال */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate" dir="ltr">
                    {formKind.phonefield}
                  </p>
                  <p className="text-xs text-muted-foreground">رقم التواصل</p>
                </div>
              </div>

              {formKind.description && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                      {formKind.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-3" />
            
            {/* المتطلبات والإعدادات */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Building className="h-3 w-3" />
                متطلبات نوع الاستمارة
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formKind.requires_university ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        اختيار جامعة
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>يتطلب من المستخدم اختيار جامعة</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-950/50 text-gray-500 border-gray-200 dark:border-gray-800">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    جامعة اختيارية
                  </Badge>
                )}
                
                {formKind.requires_file_upload ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors">
                        <Upload className="h-3 w-3 mr-1" />
                        رفع ملف
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>يتطلب من المستخدم رفع ملف</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-950/50 text-gray-500 border-gray-200 dark:border-gray-800">
                    <Upload className="h-3 w-3 mr-1" />
                    ملف اختياري
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-3" />

            {/* تاريخ الإنشاء */}
            {formKind.created_at && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>تم إنشاؤه في {formatDate(formKind.created_at)}</span>
                </div>
              </div>
            )}

            {/* زر الإجراءات السريعة */}
            <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
                      className="flex-1 h-8 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      التفاصيل
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>عرض التفاصيل الكاملة</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                      className="flex-1 h-8 text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      تعديل
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تعديل بيانات نوع الاستمارة</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default FormKindsGrid