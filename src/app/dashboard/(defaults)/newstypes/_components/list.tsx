"use client"

import {
  Tag,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Palette,
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
import type { NewsType } from "@/services/newstype"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface NewsTypesListProps {
  newsTypes: NewsType[]
  onViewDetails: (id: string) => void
  onEdit?: (newsType: NewsType) => void
  onDelete?: (id: string, name: string) => void
}

const NewsTypesList = ({ 
  newsTypes, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: NewsTypesListProps) => {
  const router = useRouter()

  const handleEdit = (newsType: NewsType) => {
    if (onEdit) {
      onEdit(newsType)
    } else {
      router.push(`/dashboard/newstypes/createOrUpdate?id=${newsType.id}`)
    }
  }

  const handleDelete = (newsType: NewsType) => {
    if (onDelete) {
      onDelete(newsType.id, newsType.name)
    }
  }

  const handleViewDetails = (newsTypeId: string) => {
    onViewDetails(newsTypeId)
  }

  const handleRowClick = (newsType: NewsType, event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return
    }
    handleViewDetails(newsType.id)
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
    <div className="space-y-4">
      {/* Table Header */}
      <Card className="bg-card backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-card-foreground">
              <div className="col-span-4">التصنيف</div>
              <div className="col-span-2">اللون</div>
              <div className="col-span-2">الحالة</div>
              <div className="col-span-2">الأخبار</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {newsTypes.map((newsType) => (
              <div
                key={newsType.id}
                className="px-6 py-5 hover:bg-accent/20 transition-all duration-300 bg-card cursor-pointer group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* News Type Info */}
                  <div 
                    className="col-span-4"
                    onClick={(e) => handleRowClick(newsType, e)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary-solid/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                        <AvatarFallback 
                          className="font-bold text-sm shadow-inner"
                          style={{ 
                            backgroundColor: newsType.color,
                            color: getTextColor(newsType.color)
                          }}
                        >
                          <Tag className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground truncate text-base group-hover:text-primary-solid transition-colors duration-300">
                          {newsType.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          <span className="truncate">
                            {newsType.slug || 'تصنيف أخبار'}
                          </span>
                        </div>
                        {newsType.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {newsType.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-lg border border-border shadow-sm"
                        style={{ backgroundColor: newsType.color }}
                      />
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-card-foreground">
                          {newsType.color}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Palette className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">لون</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge 
                      variant={newsType.is_active ? "default" : "secondary"}
                      className="transition-all duration-300"
                    >
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

                  {/* News Count */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground text-sm">
                          {newsType.news_count}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {newsType.news_count === 1 ? 'خبر' : 'أخبار'}
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
                          onClick={() => handleViewDetails(newsType.id)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Eye className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">عرض التفاصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(newsType)}
                          className="hover:bg-accent/30 transition-colors rounded-lg"
                        >
                          <Edit className="mr-2 h-4 w-4 text-primary-solid" />
                          <span className="text-card-foreground">تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/30" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(newsType)}
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

export default NewsTypesList