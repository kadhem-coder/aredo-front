"use client"

import {
  Newspaper,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  Tag,
  Image as ImageIcon,
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
import type { News } from "@/services/news"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface NewsCardProps {
  news: News
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const NewsGrid = ({ 
  news, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: NewsCardProps) => {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/news/createOrUpdate?id=${news.id}`)
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

  // تقصير النص
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
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
                  backgroundColor: news.news_type?.color || '#3B82F6',
                  color: getTextColor(news.news_type?.color || '#3B82F6')
                }}
              >
                <Newspaper className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight">
                {news.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-xs">
                  <>
                    <Tag className="h-3 w-3 mr-1" />
                    {news.news_type?.name || 'بدون تصنيف'}
                  </>
                </Badge>
                {news.images && news.images.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <>
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {news.images.length}
                    </>
                  </Badge>
                )}
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
          {/* المحتوى */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {truncateText(news.content, 150)}
          </p>
          
          {/* معلومات الخبر */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-xs">{news.news_type_name || 'بدون تصنيف'}</span>
            </div>
            
            {news.images && news.images.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium">{news.images.length} صورة</span>
              </div>
            )}

            {news.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">تم إنشاؤه في {formatDate(news.created_at)}</span>
              </div>
            )}
          </div>

          {/* الرابط المختصر */}
          {news.slug && (
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>الرابط:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                  {truncateText(news.slug, 20)}
                </code>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsGrid