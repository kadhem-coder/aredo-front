"use client"

import {
  FileText,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Form } from "@/services/forms"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface FormCardProps {
  form: Form
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const FormsGrid = ({ 
  form, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: FormCardProps) => {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/forms/createOrUpdate?id=${form.id}`)
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
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]') || 
        (event.target as HTMLElement).closest('button')) {
      return
    }
    handleViewDetails()
  }

  // تحديد اللون حسب حالة الاستمارة
  const getStatusColor = () => {
    if (form.approved) return 'from-green-500 to-emerald-600'
    if (form.submitted) return 'from-blue-500 to-indigo-600'
    if (form.accepted) return 'from-purple-500 to-violet-600'
    return 'from-gray-500 to-slate-600'
  }

  const getStatusBadge = () => {
    if (form.approved) return { label: 'موافق عليها', color: 'bg-green-100 text-green-800 border-green-200' }
    if (form.submitted) return { label: 'مقدمة', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (form.accepted) return { label: 'مقبولة', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    return { label: 'مسودة', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const statusBadge = getStatusBadge()

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 border-border hover:border-primary/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`bg-gradient-to-br ${getStatusColor()} text-white font-bold`}>
                <FileText className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight">
                {form.full_name}
              </h3>
              <Badge 
                variant="outline" 
                className={`text-xs mt-1 ${statusBadge.color}`}
              >
                {statusBadge.label}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                data-dropdown-trigger
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>

                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  تعديل
                </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">البريد:</span>
            <span className="font-medium truncate">{form.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">النوع:</span>
            <span className="font-medium">{form.kind_display}</span>
          </div>

          {form.university_name && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">الجامعة:</span>
              <span className="font-medium truncate">{form.university_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">الإكمال:</span>
            <Badge variant="outline" className="text-xs">
              {form.completion_percentage}%
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span>تاريخ التقديم: {formatDate(form.date_applied)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormsGrid

