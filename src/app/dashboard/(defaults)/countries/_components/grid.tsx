"use client"

import {
  Globe,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Country } from "@/services/country"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface CountryCardProps {
  country: Country
  onViewDetails: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const CountryGrid = ({ 
  country, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: CountryCardProps) => {
  const router = useRouter()


  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/dashboard/countries/createOrUpdate?id=${country.id}`)
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

  // تحديد اللون والأيقونة حسب كود الدولة أو بشكل عشوائي
  const getCountryColor = (code: string) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600',
    ]
    const index = code.charCodeAt(0) % colors.length
    return colors[index]
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
              <AvatarFallback className={`bg-gradient-to-br ${getCountryColor(country.code)} text-white font-bold`}>
                {country.code.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">{country.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{country.code}</p>
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
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{country.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">الكود:</span>
            <span className="font-mono font-medium">{country.code}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

export default CountryGrid