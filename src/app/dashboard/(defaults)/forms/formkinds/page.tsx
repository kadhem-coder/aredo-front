"use client"

import { useState } from "react"
import { Plus, XCircle, Grid3X3, List, FileText, Filter, Search, RefreshCw } from "lucide-react"
import {
  useGetFormKindsQuery,
  useDeleteFormKindMutation,
  type GetFormKindsRequest,
  type FormKind,
} from "@/services/formkinds"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import FormKindsGrid from "./_components/grid"
import FormKindsList from "./_components/list"

type ViewType = "grid" | "list"

const FormKindsPage = () => {
  const router = useRouter()

  // State for view type
  const [viewType, setViewType] = useState<ViewType>("list")
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Build filters object
  const filters: GetFormKindsRequest = {
    page: currentPage,
    page_size: pageSize,
  }

  // API calls
  const { data: formKindsData, isLoading, error, refetch, isFetching } = useGetFormKindsQuery(filters)
  const [deleteFormKind] = useDeleteFormKindMutation()

  // Handle delete form kind
  const handleDeleteFormKind = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف نوع الاستمارة "${name}"؟`)) return
    
    try {
      await deleteFormKind(id).unwrap()
      toast.success("تم حذف نوع الاستمارة بنجاح")
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || "فشل في حذف نوع الاستمارة")
    }
  }

  const handleViewDetails = (formKindId: string) => {
    router.push(`/dashboard/forms/formkinds/${formKindId}`)
  }

  const handleEdit = (formKind: FormKind) => {
    router.push(`/dashboard/forms/formkinds/createOrUpdate?id=${formKind.id}`)
  }

  const handleCreate = () => {
    router.push(`/dashboard/forms/formkinds/createOrUpdate`)
  }

  const handleRefresh = () => {
    refetch()
    toast.success("تم تحديث البيانات")
  }

  // Extract data with null checks
  const paginationData = formKindsData?.data
  const formKindsList = paginationData?.results || []
  const totalCount = paginationData?.count || 0
  const totalPages = paginationData?.total_pages || 0
  const currentPageFromAPI = paginationData?.current_page || 1

  // Filter and search logic
  let filteredFormKinds = formKindsList
  
  // Apply search filter
  if (searchTerm.trim()) {
    filteredFormKinds = filteredFormKinds.filter(formKind =>
      formKind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formKind.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formKind.phonefield.includes(searchTerm)
    )
  }

  // Apply status filter
  if (statusFilter !== "all") {
    filteredFormKinds = filteredFormKinds.filter(formKind => {
      if (statusFilter === "active") return formKind.is_active
      if (statusFilter === "inactive") return !formKind.is_active
      return true
    })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCurrentPage(1)
    toast.success("تم إعادة تعيين المرشحات")
  }
  
  if (error) {
    console.error('API Error:', error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center max-w-md bg-card backdrop-blur-sm border border-border/50 shadow-2xl">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">خطأ في تحميل البيانات</h3>
          <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل قائمة أنواع الاستمارات</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()} className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
            <Button variant="outline" onClick={() => router.refresh()}>
              تحديث الصفحة
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg pulse-glow">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">إدارة أنواع الاستمارات</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <Filter className="w-4 h-4 text-primary-solid" />
                إدارة وتنظيم أنواع الاستمارات في النظام
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-border/50 rounded-xl p-1 bg-muted/30 backdrop-blur-sm">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("grid")}
                className={`rounded-lg transition-all duration-300 ${
                  viewType === "grid" 
                    ? "gradient-primary text-white shadow-md" 
                    : "hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("list")}
                className={`rounded-lg transition-all duration-300 ${
                  viewType === "list" 
                    ? "gradient-primary text-white shadow-md" 
                    : "hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isFetching}
              className="hidden sm:flex"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              onClick={handleCreate}
              className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-xl ripple-effect"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة نوع استمارة جديد
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في أنواع الاستمارات (الاسم، المدير، الهاتف)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="حالة الاستمارة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || statusFilter !== "all") && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      {(filteredFormKinds.length > 0 || totalCount > 0) && (
        <Card className="bg-accent/30 border-primary-solid/20 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-primary-solid font-medium">
                {searchTerm || statusFilter !== "all" ? (
                  <>عرض {filteredFormKinds.length} من أصل {totalCount} نوع استمارة</>
                ) : (
                  <>عرض {((currentPage - 1) * pageSize) + 1} إلى {Math.min(currentPage * pageSize, totalCount)} من أصل {totalCount} نوع استمارة</>
                )}
              </div>
              <div className="text-muted-foreground">
                الصفحة {currentPageFromAPI} من {totalPages}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-card border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted/60 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted/60 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-muted/40 rounded-lg w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-muted/40 rounded-lg w-full"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted/40 rounded-lg w-16"></div>
                  <div className="h-6 bg-muted/40 rounded-lg w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Kinds Display */}
      {!isLoading && filteredFormKinds.length > 0 && (
        <>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFormKinds.map((formKind: FormKind) => (
                <FormKindsGrid
                  key={formKind.id}
                  formKind={formKind}
                  onViewDetails={() => handleViewDetails(formKind.id)}
                  onEdit={() => handleEdit(formKind)}
                  onDelete={() => handleDeleteFormKind(formKind.id, formKind.name)}
                />
              ))}
            </div>
          ) : (
            <FormKindsList
              formKinds={filteredFormKinds}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteFormKind}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && filteredFormKinds.length === 0 && totalCount === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="p-8 text-center max-w-md bg-card backdrop-blur-sm border-border/50 shadow-2xl">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد أنواع استمارات</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على أي أنواع استمارات في النظام</p>
            <Button 
              onClick={handleCreate}
              className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg ripple-effect"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة نوع استمارة جديد
            </Button>
          </Card>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredFormKinds.length === 0 && totalCount > 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="p-8 text-center max-w-md bg-card backdrop-blur-sm border-border/50 shadow-2xl">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد نتائج</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على أنواع استمارات تطابق معايير البحث المحددة
            </p>
            <div className="space-y-2">
              <Button variant="outline" onClick={handleResetFilters}>
                <XCircle className="h-4 w-4 ml-2" />
                مسح المرشحات
              </Button>
              <div className="text-xs text-muted-foreground">
                أو جرب البحث بكلمات مختلفة
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredFormKinds.length > 0 && totalPages > 1 && !searchTerm && statusFilter === "all" && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                عرض {((currentPageFromAPI - 1) * pageSize) + 1} إلى {Math.min(currentPageFromAPI * pageSize, totalCount)} من أصل {totalCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  السابق
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 p-0 ${
                          currentPage === pageNum 
                            ? "gradient-primary text-white" 
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FormKindsPage