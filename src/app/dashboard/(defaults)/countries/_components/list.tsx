"use client"

import {
  Globe,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

interface CountriesListProps {
  countries: Country[]
  onViewDetails: (id: string) => void
  onEdit?: (country: Country) => void
  onDelete?: (id: string, name: string) => void
}

const CountriesList = ({ 
  countries, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: CountriesListProps) => {
  const router = useRouter()

  const handleEdit = (country: Country) => {
    if (onEdit) {
      onEdit(country)
    } else {
      router.push(`/dashboard/countries/createOrUpdate?id=${country.id}`)
    }
  }

  const handleDelete = (country: Country) => {
    if (onDelete) {
      onDelete(country.id, country.name)
    }
  }

  const handleViewDetails = (countryId: string) => {
      onViewDetails(countryId)
  }

  const handleRowClick = (country: Country, event: React.MouseEvent) => {
    // منع التنفيذ إذا كان النقر على الـ dropdown menu
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return
    }
    handleViewDetails(country.id)
  }

  // تحديد اللون حسب كود الدولة
  const getCountryColor = (code: string) => {
    const colors = [
      'from-sky-400 to-cyan-500',
      'from-emerald-400 to-teal-500',
      'from-orange-400 to-amber-500',
      'from-pink-400 to-rose-500',
      'from-indigo-400 to-blue-500',
      'from-violet-400 to-purple-500',
      'from-lime-400 to-green-500',
      'from-red-400 to-pink-500',
    ]
    const index = code.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <Card className="bg-card backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-card-foreground">
              <div className="col-span-6">الدولة</div>
              <div className="col-span-2">الكود</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {countries.map((country, index) => (
              <div
                key={country.id}
                className="px-6 py-5 hover:bg-accent/20 transition-all duration-300 bg-card cursor-pointer group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Country Info */}
                  <div 
                    className="col-span-6"
                    onClick={(e) => handleRowClick(country, e)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary-solid/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                        <AvatarFallback className={`bg-gradient-to-br ${getCountryColor(country.code)} text-white font-bold text-sm shadow-inner`}>
                          {country.code.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground truncate text-base group-hover:text-primary-solid transition-colors duration-300">
                          {country.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span className="truncate">دولة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Country Code */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-card-foreground bg-muted/40 px-3 py-1.5 rounded-lg text-sm border border-border/30 group-hover:bg-primary-solid/10 transition-colors duration-300">
                        {country.code}
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
                            onClick={() => handleViewDetails(country.id)}
                            className="hover:bg-accent/30 transition-colors rounded-lg"
                          >
                            <Eye className="mr-2 h-4 w-4 text-primary-solid" />
                            <span className="text-card-foreground">عرض التفاصيل</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(country)}
                            className="hover:bg-accent/30 transition-colors rounded-lg"
                          >
                            <Edit className="mr-2 h-4 w-4 text-primary-solid" />
                            <span className="text-card-foreground">تعديل</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/30" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(country)}
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

export default CountriesList