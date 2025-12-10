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
  ChevronDown,
  DollarSign,
  Wallet,
  MessageSquare
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
      'received',
      'payoff',
      'touch',
      'kind',
      'kind__name',
      'university',
      'university__name',
      'date_applied',
      'date_applied__gte',
      'date_applied__lte',
      'date_applied__year',
      'date_applied__month',
      'fees',
      'fees__gte',
      'fees__lte'
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
    { value: "email", label: "البريد الإلكتروني تصاعدي" },
    { value: "-email", label: "البريد الإلكتروني تنازلي" },
    { value: "fees", label: "الرسوم من الأقل للأعلى" },
    { value: "-fees", label: "الرسوم من الأعلى للأقل" },
    { value: "updated_at", label: "آخر تحديث (الأقدم)" },
    { value: "-updated_at", label: "آخر تحديث (الأحدث)" },
  ]

  // خيارات السنوات (آخر 5 سنوات)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // خيارات الأشهر
  const monthOptions = [
    { value: 1, label: "يناير" },
    { value: 2, label: "فبراير" },
    { value: 3, label: "مارس" },
    { value: 4, label: "أبريل" },
    { value: 5, label: "مايو" },
    { value: 6, label: "يونيو" },
    { value: 7, label: "يوليو" },
    { value: 8, label: "أغسطس" },
    { value: 9, label: "سبتمبر" },
    { value: 10, label: "أكتوبر" },
    { value: 11, label: "نوفمبر" },
    { value: 12, label: "ديسمبر" },
  ]

  const universities = universitiesData?.data?.results || []
  const kinds = kindsData?.data?.results || []

  return (
    <Card className="p-6 shadow-lg border border-gray-200 bg-white rounded-2xl">
      {/* رأس الفلاتر */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">فلاتر البحث المتقدمة</h3>
            <p className="text-sm text-gray-500 mt-0.5">تصفية وبحث دقيق في الاستمارات</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md px-3 py-1.5 text-sm font-medium">
              {activeFiltersCount} فلتر نشط
            </Badge>
          )}
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-4 font-medium"
            >
              <X className="h-4 w-4 ml-2" />
              مسح الكل
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 px-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium transition-all"
          >
            {isExpanded ? "إخفاء" : "عرض"} الفلاتر المتقدمة
            <ChevronDown className={cn(
              "h-4 w-4 mr-2 transition-transform duration-300",
              isExpanded ? "rotate-180" : ""
            )} />
          </Button>
        </div>
      </div>

      {/* الفلاتر الأساسية - تظهر دائماً */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* البحث الشامل */}
        <div className="lg:col-span-5">
          <Label htmlFor="search" className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            البحث الشامل
          </Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="search"
              placeholder="الاسم، البريد، الهاتف، القسم، الجامعة، الجواز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-11 h-11 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
            />
          </div>
        </div>

        {/* نوع الاستمارة */}
        <div className="lg:col-span-4">
          <Label htmlFor="kind" className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            نوع الاستمارة
          </Label>
          <Select
            value={localFilters.kind__name || "all"}
            onValueChange={(value) => handleFilterChange("kind__name", value === "all" ? undefined : value)}
            disabled={isLoadingKinds}
          >
            <SelectTrigger id="kind" className="h-11 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-lg">
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

        {/* الترتيب */}
        <div className="lg:col-span-3">
          <Label htmlFor="ordering" className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            الترتيب حسب
          </Label>
          <Select
            value={localFilters.ordering || "-date_applied"}
            onValueChange={(value) => handleFilterChange("ordering", value)}
          >
            <SelectTrigger id="ordering" className="h-11 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-lg">
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
      </div>

      {/* الفلاتر المتقدمة - تظهر عند التوسيع */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* القسم 1: الجامعة والحالات الأساسية */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h4 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 pb-3 border-b border-purple-200">
              <Building2 className="h-5 w-5 text-purple-600" />
              الجامعة والحالات الأساسية
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* الجامعة */}
              <div>
                <Label htmlFor="university" className="mb-2 text-sm font-medium text-gray-700">
                  الجامعة
                </Label>
                <Select
                  value={localFilters.university__name || "all"}
                  onValueChange={(value) => handleFilterChange("university__name", value === "all" ? undefined : value)}
                  disabled={isLoadingUniversities}
                >
                  <SelectTrigger id="university" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
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

              {/* حالة التقديم */}
              <div>
                <Label htmlFor="submitted" className="mb-2 text-sm font-medium text-gray-700">
                  حالة التقديم
                </Label>
                <Select
                  value={localFilters.submitted?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("submitted", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="submitted" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>مُسلَّمة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>غير مُسلَّمة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة الموافقة */}
              <div>
                <Label htmlFor="approved" className="mb-2 text-sm font-medium text-gray-700">
                  حالة الموافقة
                </Label>
                <Select
                  value={localFilters.approved?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("approved", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="approved" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>موافق عليها</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>غير موافق</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة القبول */}
              <div>
                <Label htmlFor="accepted" className="mb-2 text-sm font-medium text-gray-700">
                  حالة القبول
                </Label>
                <Select
                  value={localFilters.accepted?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("accepted", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="accepted" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>مقبولة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>غير مقبولة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة الاستلام */}
              <div>
                <Label htmlFor="received" className="mb-2 text-sm font-medium text-gray-700">
                  حالة الاستلام
                </Label>
                <Select
                  value={localFilters.received?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("received", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="received" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>مُستلَمة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>غير مُستلَمة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة الدفع */}
              <div>
                <Label htmlFor="payoff" className="mb-2 text-sm font-medium text-gray-700">
                  حالة الدفع
                </Label>
                <Select
                  value={localFilters.payoff?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("payoff", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="payoff" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>مدفوعة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>غير مدفوعة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة التواصل */}
              <div>
                <Label htmlFor="touch" className="mb-2 text-sm font-medium text-gray-700">
                  حالة التواصل
                </Label>
                <Select
                  value={localFilters.touch?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("touch", value === "all" ? undefined : value === "true")}
                >
                  <SelectTrigger id="touch" className="h-10 bg-white border-2 border-gray-300 hover:border-purple-400 rounded-lg">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>تم التواصل</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>لم يتم التواصل</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* القسم 2: فلاتر التاريخ */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
            <h4 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 pb-3 border-b border-green-200">
              <Calendar className="h-5 w-5 text-green-600" />
              فلاتر التاريخ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* تاريخ محدد */}
              <div>
                <Label htmlFor="date_exact" className="mb-2 text-sm font-medium text-gray-700">
                  تاريخ محدد
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="date_exact"
                    type="date"
                    value={localFilters.date_applied || ""}
                    onChange={(e) => handleFilterChange("date_applied", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-green-400 rounded-lg"
                  />
                </div>
              </div>

              {/* من تاريخ */}
              <div>
                <Label htmlFor="date_from" className="mb-2 text-sm font-medium text-gray-700">
                  من تاريخ
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="date_from"
                    type="date"
                    value={localFilters.date_applied__gte || ""}
                    onChange={(e) => handleFilterChange("date_applied__gte", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-green-400 rounded-lg"
                  />
                </div>
              </div>

              {/* إلى تاريخ */}
              <div>
                <Label htmlFor="date_to" className="mb-2 text-sm font-medium text-gray-700">
                  إلى تاريخ
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="date_to"
                    type="date"
                    value={localFilters.date_applied__lte || ""}
                    onChange={(e) => handleFilterChange("date_applied__lte", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-green-400 rounded-lg"
                  />
                </div>
              </div>

              {/* الشهر */}
              <div>
                <Label htmlFor="month" className="mb-2 text-sm font-medium text-gray-700">
                  الشهر
                </Label>
                <Select
                  value={localFilters.date_applied__month?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("date_applied__month", value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger id="month" className="h-10 bg-white border-2 border-gray-300 hover:border-green-400 rounded-lg">
                    <SelectValue placeholder="جميع الأشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأشهر</SelectItem>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* السنة */}
              <div>
                <Label htmlFor="year" className="mb-2 text-sm font-medium text-gray-700">
                  السنة
                </Label>
                <Select
                  value={localFilters.date_applied__year?.toString() || "all"}
                  onValueChange={(value) => handleFilterChange("date_applied__year", value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger id="year" className="h-10 bg-white border-2 border-gray-300 hover:border-green-400 rounded-lg">
                    <SelectValue placeholder="جميع السنوات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع السنوات</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* القسم 3: فلاتر الرسوم */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h4 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 pb-3 border-b border-blue-200">
              <Wallet className="h-5 w-5 text-blue-600" />
              فلاتر الرسوم
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* رسوم محددة */}
              <div>
                <Label htmlFor="fees_exact" className="mb-2 text-sm font-medium text-gray-700">
                  رسوم محددة
                </Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fees_exact"
                    type="text"
                    placeholder="مثال: 1000"
                    value={localFilters.fees || ""}
                    onChange={(e) => handleFilterChange("fees", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-lg"
                  />
                </div>
              </div>

              {/* الحد الأدنى للرسوم */}
              <div>
                <Label htmlFor="fees_min" className="mb-2 text-sm font-medium text-gray-700">
                  الحد الأدنى للرسوم
                </Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fees_min"
                    type="text"
                    placeholder="مثال: 500"
                    value={localFilters.fees__gte || ""}
                    onChange={(e) => handleFilterChange("fees__gte", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-lg"
                  />
                </div>
              </div>

              {/* الحد الأقصى للرسوم */}
              <div>
                <Label htmlFor="fees_max" className="mb-2 text-sm font-medium text-gray-700">
                  الحد الأقصى للرسوم
                </Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fees_max"
                    type="text"
                    placeholder="مثال: 5000"
                    value={localFilters.fees__lte || ""}
                    onChange={(e) => handleFilterChange("fees__lte", e.target.value)}
                    className="pr-10 h-10 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default FormsFilter