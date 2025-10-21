"use client"

import {
  Newspaper,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  Tag,
  Image as ImageIcon,
  Calendar,
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
import type { News } from "@/services/news"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface NewsListProps {
  newsList: News[]
  onViewDetails: (id: string) => void
  onEdit?: (news: News) => void
  onDelete?: (id: string, title: string) => void
}

const NewsList = ({ 
  newsList, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: NewsListProps) => {
  const router = useRouter()

  const handleEdit = (news: News) => {
    if (onEdit) {
      onEdit(news)
    } else {
      router.push(`/dashboard/news/createOrUpdate?id=${news.id}`)
    }
  }

  const handleDelete = (news: News) => {
    if (onDelete) {
      onDelete(news.id, news.title)
    }
  }

  const handleViewDetails = (newsId: string) => {
    onViewDetails(newsId)
  }

  const handleRowClick = (news: News, event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return
    }
    handleViewDetails(news.id)
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
    <div className="space-y-4">
      {/* Table Header */}
      <Card className="bg-card backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-card-foreground">
              <div className="col-span-5">الخبر</div>
              <div className="col-span-2">التصنيف</div>
              <div className="col-span-2">الصور</div>
              <div className="col-span-2">التاريخ</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {newsList.map((news) => (
              <div
                key={news.id}
                className="px-6 py-5 hover:bg-accent/20 transition-all duration-300 bg-card cursor-pointer group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* News Info */}
                  <div 
                    className="col-span-5"
                    onClick={(e) => handleRowClick(news, e)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary-solid/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                        <AvatarFallback 
                          className="font-bold text-sm shadow-inner"
                          style={{ 
                            backgroundColor: news.news_type?.color || '#3B82F6',
                            color: getTextColor(news.news_type?.color || '#3B82F6')
                          }}
                        >
                          <Newspaper className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground truncate text-base group-hover:text-primary-solid transition-colors duration-300">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Newspaper className="h-3 w-3" />
                          <span className="truncate">
                            {news.slug || 'خبر'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {truncateText(news.content, 120)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-card-foreground">
                          {news.news_type_name || 'بدون تصنيف'}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">تصنيف</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images Count */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground text-sm">
                          {news.images?.length || 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(news.images?.length || 0) === 1 ? 'صورة' : 'صور'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground text-sm">
                          {news.created_at ? formatDate(news.created_at) : 'غير محدد'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          تاريخ الإنشاء
                        </span>
                      </div>
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
                          onClick={() => handleViewDetails(news.id)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Eye className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">عرض التفاصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(news)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Edit className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/30" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(news)}
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

export default NewsList