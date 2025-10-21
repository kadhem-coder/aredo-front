"use client"

import {
  Tag,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Palette,
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
import type { NewsType } from "@/services/newstype"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface NewsTypeCardProps {
  newsType: NewsType
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const NewsTypesGrid = ({ 
  newsType, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: NewsTypeCardProps) => {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/newstypes/createOrUpdate?id=${newsType.id}`)
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

  // تحديد لون النص حسب لون الخلفية
  const getTextColor = (backgroundColor: string) => {
    try {
      const hex = backgroundColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return brightness > 155 ? '#000000' : '#FFFFFF'
    } catch {
      return '#FFFFFF'
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
              <AvatarFallback 
                className="font-bold"
                style={{ 
                  backgroundColor: newsType.color,
                  color: getTextColor(newsType.color)
                }}
              >
                <Tag className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">{newsType.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={newsType.is_active ? "default" : "secondary"} className="text-xs">
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
        <div className="space-y-3">
          {/* الوصف */}
          {newsType.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {newsType.description}
            </p>
          )}
          
          {/* معلومات التصنيف */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div 
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: newsType.color }}
              />
              <span className="font-mono text-xs">{newsType.color}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">{newsType.news_count} خبر</span>
            </div>

            {newsType.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">تم إنشاؤه في {formatDate(newsType.created_at)}</span>
              </div>
            )}
          </div>

          {/* الرابط المختصر */}
          {newsType.slug && (
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>الرابط:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                  {newsType.slug}
                </code>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsTypesGrid