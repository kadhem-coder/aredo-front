"use client"

import { useState } from "react"
import { Plus, XCircle, Grid3X3, List, FileText } from "lucide-react"
import {
  useGetFormsQuery,
  useDeleteFormMutation,
  type GetFormsRequest,
  type Form,
} from "@/services/forms"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import FormsGrid from "./_components/grid"
import FormsList from "./_components/list"
import FormsFilter from "./_components/filter"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ViewType = "grid" | "list"

const FormsPage = () => {
  const router = useRouter()
  
  // State for view type
  const [viewType, setViewType] = useState<ViewType>("list")

  // State for filters
  const [filters, setFilters] = useState<GetFormsRequest>({
    page: 1,
    page_size: 12,
    ordering: "-date_applied", // Default ordering by newest
  })

  // API calls
  const { data: formsData, isLoading, error, refetch } = useGetFormsQuery(filters)
  const [deleteForm] = useDeleteFormMutation()
  
  // Handle delete form
  const handleDeleteForm = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الاستمارة "${name}"؟`)) return
    
    try {
      await deleteForm(id).unwrap()
      toast.success("تم حذف الاستمارة بنجاح")
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || "فشل في حذف الاستمارة")
    }
  }

  const handleViewDetails = (formId: string) => {
    router.push(`/dashboard/forms/${formId}`)
  }

  const handleEdit = (form: Form) => {
    router.push(`/dashboard/forms/createOrUpdate?id=${form.id}`)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle filters change
  const handleFiltersChange = (newFilters: GetFormsRequest) => {
    setFilters(newFilters)
  }

  // Extract data from response
  const forms = formsData?.data?.results || []
  const totalPages = formsData?.data?.total_pages || 0
  const currentPage = formsData?.data?.current_page || 1
  const totalCount = formsData?.data?.count || 0
  
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push('ellipsis')
        items.push(currentPage - 1)
        items.push(currentPage)
        items.push(currentPage + 1)
        items.push('ellipsis')
        items.push(totalPages)
      }
    }
    
    return items
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center max-w-md bg-card backdrop-blur-sm border border-border/50 shadow-2xl">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">خطأ في تحميل البيانات</h3>
          <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل قائمة الاستمارات</p>
          <Button onClick={() => refetch()} className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg">
            إعادة المحاولة
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg pulse-glow">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">إدارة الاستمارات</h1>
            <p className="text-muted-foreground">
              إدارة وتنظيم الاستمارات في النظام
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
            onClick={() => router.push(`/dashboard/forms/createOrUpdate`)}
            className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-xl ripple-effect"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة استمارة جديدة
          </Button>
        </div>
      </div>

      {/* Filters Component */}
      <FormsFilter 
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Results Summary */}
      {totalCount > 0 && !isLoading && (
        <Card className="bg-accent/30 border-primary-solid/20 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-primary-solid font-medium">
                عرض {((currentPage - 1) * (filters.page_size || 12)) + 1} إلى {Math.min(currentPage * (filters.page_size || 12), totalCount)} من أصل {totalCount} استمارة
              </div>
              <div className="text-muted-foreground">
                الصفحة {currentPage} من {totalPages}
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
                <div className="h-4 bg-muted/60 rounded-lg w-3/4"></div>
                <div className="h-3 bg-muted/40 rounded-lg w-1/2"></div>
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

      {/* Forms Display */}
      {!isLoading && forms.length > 0 && (
        <>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {forms.map((form: Form) => (
                <FormsGrid
                  key={form.id}
                  form={form}
                  onViewDetails={() => handleViewDetails(form.id)}
                  onEdit={() => handleEdit(form)}
                  onDelete={() => handleDeleteForm(form.id, form.full_name)}
                />
              ))}
            </div>
          ) : (
            <FormsList
              forms={forms}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteForm}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent/50"}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems().map((item, index) => (
                      <PaginationItem key={index}>
                        {item === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(item as number)}
                            isActive={currentPage === item}
                            className={currentPage === item ? "gradient-primary text-white" : "hover:bg-accent/50 cursor-pointer"}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent/50"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && forms.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="p-8 text-center max-w-md bg-card backdrop-blur-sm border-border/50 shadow-2xl">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد استمارات</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.submitted !== undefined || filters.approved !== undefined || 
               filters.accepted !== undefined || filters.kind__name || filters.university__name__icontains ||
               filters.date_applied__gte || filters.date_applied__lte
                ? "لم يتم العثور على استمارات مطابقة للفلاتر المحددة"
                : "لم يتم العثور على أي استمارات في النظام"}
            </p>
            {(filters.search || filters.submitted !== undefined || filters.approved !== undefined || 
              filters.accepted !== undefined || filters.kind__name || filters.university__name__icontains ||
              filters.date_applied__gte || filters.date_applied__lte) && (
              <Button 
                onClick={() => handleFiltersChange({ page: 1, page_size: 12, ordering: "-date_applied" })}
                variant="outline"
                className="mb-4"
              >
                مسح الفلاتر
              </Button>
            )}
            <Button 
              onClick={() => router.push(`/dashboard/forms/createOrUpdate`)}
              className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg ripple-effect"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة استمارة جديدة
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FormsPage