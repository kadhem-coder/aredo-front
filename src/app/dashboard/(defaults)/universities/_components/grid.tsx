"use client"

import {
  GraduationCap,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Globe,
  Building,
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
import type { University } from "@/services/universities"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface UniversityCardProps {
  university: University
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const UniversityGrid = ({ 
  university, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: UniversityCardProps) => {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/universities/createOrUpdate?id=${university.id}`)
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

  // تحديد اللون والأيقونة حسب نوع الجامعة
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
  }

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
  }

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
  }

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 border-border hover:border-primary/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`bg-gradient-to-br ${getUniversityColor(university.university_type)} text-white font-bold`}>
                <GraduationCap className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight">{university.name}</h3>
              <Badge 
                variant="outline" 
                className={`text-xs mt-1 ${getUniversityTypeColor(university.university_type)}`}
              >
                {getUniversityTypeLabel(university.university_type)}
              </Badge>
            </div>
          </div>
          
          {/* قائمة الإجراءات */}
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
              {/* عرض التفاصيل */}
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>

              {/* تعديل */}
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>

              {/* حذف */}
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
            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{university.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">الدولة:</span>
            <span className="font-medium"> الدولة: {university.country_name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">النوع:</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getUniversityTypeColor(university.university_type)}`}
            >
              {getUniversityTypeLabel(university.university_type)}
            </Badge>
          </div>
        </div>

        {university.created_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>تاريخ الإنشاء: {formatDate(university.created_at)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UniversityGrid