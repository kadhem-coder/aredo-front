"use client"

import {
  GraduationCap,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Globe,
  Building,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

interface UniversitiesListProps {
  universities: University[]
  onViewDetails: (id: string) => void
  onEdit?: (university: University) => void
  onDelete?: (id: string, name: string) => void
}

const UniversitiesList = ({ 
  universities, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: UniversitiesListProps) => {
  const router = useRouter()

  const handleEdit = (university: University) => {
    if (onEdit) {
      onEdit(university)
    } else {
      router.push(`/dashboard/universities/createOrUpdate?id=${university.id}`)
    }
  }

  const handleDelete = (university: University) => {
    if (onDelete) {
      onDelete(university.id, university.name)
    }
  }

  const handleViewDetails = (universityId: string) => {
    onViewDetails(universityId)
  }

  const handleRowClick = (university: University, event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return
    }
    handleViewDetails(university.id)
  }

  // تحديد اللون حسب نوع الجامعة
  const getUniversityColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'from-blue-400 to-indigo-500'
      case 'private':
        return 'from-green-400 to-emerald-500'
      case 'mixed':
        return 'from-purple-400 to-violet-500'
      default:
        return 'from-gray-400 to-slate-500'
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
    <div className="space-y-4">
      {/* Table Header */}
      <Card className="bg-card backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-card-foreground">
              <div className="col-span-5">الجامعة</div>
              <div className="col-span-2">النوع</div>
              <div className="col-span-2">الدولة</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {universities.map((university, index) => (
              <div
                key={university.id}
                className="px-6 py-5 hover:bg-accent/20 transition-all duration-300 bg-card cursor-pointer group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* University Info */}
                  <div 
                    className="col-span-5"
                    onClick={(e) => handleRowClick(university, e)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary-solid/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                        <AvatarFallback className={`bg-gradient-to-br ${getUniversityColor(university.university_type)} text-white font-bold text-sm shadow-inner`}>
                          <GraduationCap className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground truncate text-base group-hover:text-primary-solid transition-colors duration-300">
                          {university.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Building className="h-3 w-3" />
                          <span className="truncate">جامعة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* University Type */}
                  <div className="col-span-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getUniversityTypeColor(university.university_type)}`}
                    >
                      {getUniversityTypeLabel(university.university_type)}
                    </Badge>
                  </div>

                  {/* Country */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-card-foreground truncate">
                        {university.country_name}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="col-span-1 flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-accent/40 rounded-lg transition-all duration-300 ripple-effect"
                          data-dropdown-trigger
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card border-border/50 shadow-2xl backdrop-blur-sm">
                        <DropdownMenuItem 
                          onClick={() => handleViewDetails(university.id)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Eye className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">عرض التفاصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(university)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Edit className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/30" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(university)}
                          className="text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UniversitiesList