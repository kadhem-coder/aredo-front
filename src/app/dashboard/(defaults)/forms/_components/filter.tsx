"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  X, 
  Filter,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetUniversitiesQuery } from "@/services/universities"
import { useGetFormKindsQuery } from "@/services/formkinds"
import type { GetFormsRequest } from "@/services/forms"
import { cn } from "@/lib/utils"

interface FormsFilterProps {
  filters: GetFormsRequest
  onFiltersChange: (filters: GetFormsRequest) => void
}

const FormsFilter = ({ filters, onFiltersChange }: FormsFilterProps) => {
  const [localFilters, setLocalFilters] = useState<GetFormsRequest>(filters)
  const [searchQuery, setSearchQuery] = useState(filters.search || "")
  const [isExpanded, setIsExpanded] = useState(false)

  // جلب قائمة الجامعات
  const { data: universitiesData, isLoading: isLoadingUniversities } = useGetUniversitiesQuery({
    page_size: 100,
  })

  // جلب قائمة أنواع الاستمارات
  const { data: kindsData, isLoading: isLoadingKinds } = useGetFormKindsQuery({
    page_size: 100,
  })

  // تأخير البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== localFilters.search) {
        handleFilterChange("search", searchQuery)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleFilterChange = (key: keyof GetFormsRequest, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value === "" || value === "all" ? undefined : value,
      page: 1
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: GetFormsRequest = {
      page: 1,
      page_size: filters.page_size || 12,
      ordering: filters.ordering || "-date_applied",
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    setSearchQuery("")
  }

  // حساب عدد الفلاتر النشطة
  const getActiveFiltersCount = () => {
    const checkableFilters = [
      'search',
      'submitted',
      'approved',
      'accepted',
      'kind__name',
      'university__name__icontains',
      'date_applied__gte',
      'date_applied__lte'
    ]

    return checkableFilters.filter(key => {
      const value = localFilters[key as keyof GetFormsRequest]
      return value !== undefined && value !== null && value !== ''
    }).length
  }

  const activeFiltersCount = getActiveFiltersCount()

  const orderingOptions = [
    { value: "-date_applied", label: "الأحدث أولاً" },
    { value: "date_applied", label: "الأقدم أولاً" },
    { value: "full_name", label: "الاسم من أ-ي" },
    { value: "-full_name", label: "الاسم من ي-أ" },
  ]

  const universities = universitiesData?.data?.results || []
  const kinds = kindsData?.data?.results || []

  return (
    <Card className="p-6 shadow-md border-0 bg-white/50 backdrop-blur-sm">
      {/* رأس الفلاتر */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">فلاتر البحث</h3>
            <p className="text-sm text-gray-500">تصفية النتائج حسب معايير محددة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="bg-blue-600 text-white">
              {activeFiltersCount} فلتر نشط
            </Badge>
          )}
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-8 px-3"
            >
              <X className="h-4 w-4 ml-1" />
              مسح الكل
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-3 border-gray-300"
          >
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isExpanded ? "rotate-180" : ""
            )} />
            {isExpanded ? "إخفاء" : "عرض"} الفلاتر
          </Button>
        </div>
      </div>

      {/* الفلاتر الأساسية - تظهر دائماً */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* البحث */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
            البحث الشامل
          </Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="ابحث في الاسم، البريد الإلكتروني، الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-white border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* الترتيب */}
        <div>
          <Label htmlFor="ordering" className="mb-2 block text-sm font-medium text-gray-700">
            الترتيب حسب
          </Label>
          <Select
            value={localFilters.ordering || "-date_applied"}
            onValueChange={(value) => handleFilterChange("ordering", value)}
          >
            <SelectTrigger id="ordering" className="bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {orderingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع الاستمارة */}
        <div>
          <Label htmlFor="kind" className="mb-2 block text-sm font-medium text-gray-700">
            نوع الاستمارة
          </Label>
          <Select
            value={localFilters.kind__name || "all"}
            onValueChange={(value) => handleFilterChange("kind__name", value === "all" ? undefined : value)}
            disabled={isLoadingKinds}
          >
            <SelectTrigger id="kind" className="bg-white border-gray-300">
              <SelectValue placeholder="جميع الأنواع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              {kinds.map((kind: any) => (
                <SelectItem key={kind.id} value={kind.name}>
                  {kind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* الفلاتر المتقدمة - تظهر عند التوسيع */}
      {isExpanded && (
        <div className="space-y-6 pt-6 border-t border-gray-200 animate-in fade-in duration-300">
          {/* الصف الأول: الجامعة والحالات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* الجامعة */}
            <div>
              <Label htmlFor="university" className="mb-2 block text-sm font-medium text-gray-700">
                الجامعة
              </Label>
              <Select
                value={localFilters.university__name__icontains || "all"}
                onValueChange={(value) => handleFilterChange("university__name__icontains", value === "all" ? undefined : value)}
                disabled={isLoadingUniversities}
              >
                <SelectTrigger id="university" className="bg-white border-gray-300">
                  <SelectValue placeholder="جميع الجامعات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الجامعات</SelectItem>
                  {universities.map((university: any) => (
                    <SelectItem key={university.id} value={university.name}>
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* حالة التسليم */}
            <div>
              <Label htmlFor="submitted" className="mb-2 block text-sm font-medium text-gray-700">
                حالة التسليم
              </Label>
              <Select
                value={localFilters.submitted?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("submitted", value === "all" ? undefined : value === "true")}
              >
                <SelectTrigger id="submitted" className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="true">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>مُسلَّمة</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>غير مُسلَّمة</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* حالة الموافقة */}
            <div>
              <Label htmlFor="approved" className="mb-2 block text-sm font-medium text-gray-700">
                حالة الموافقة
              </Label>
              <Select
                value={localFilters.approved?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("approved", value === "all" ? undefined : value === "true")}
              >
                <SelectTrigger id="approved" className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="true">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>موافق عليها</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>غير موافق عليها</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* حالة القبول */}
            <div>
              <Label htmlFor="accepted" className="mb-2 block text-sm font-medium text-gray-700">
                حالة القبول
              </Label>
              <Select
                value={localFilters.accepted?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("accepted", value === "all" ? undefined : value === "true")}
              >
                <SelectTrigger id="accepted" className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="true">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>مقبولة</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>غير مقبولة</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* الصف الثاني: التواريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_from" className="mb-2 block text-sm font-medium text-gray-700">
                من تاريخ التقديم
              </Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date_from"
                  type="date"
                  value={localFilters.date_applied__gte || ""}
                  onChange={(e) => handleFilterChange("date_applied__gte", e.target.value)}
                  className="pr-10 bg-white border-gray-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date_to" className="mb-2 block text-sm font-medium text-gray-700">
                إلى تاريخ التقديم
              </Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date_to"
                  type="date"
                  value={localFilters.date_applied__lte || ""}
                  onChange={(e) => handleFilterChange("date_applied__lte", e.target.value)}
                  className="pr-10 bg-white border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default FormsFilter