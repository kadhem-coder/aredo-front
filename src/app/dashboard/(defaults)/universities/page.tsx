"use client"

import { useState } from "react"
import { Plus, XCircle, Grid3X3, List, GraduationCap, MapPin } from "lucide-react"
import {
  useGetUniversitiesQuery,
  useDeleteUniversityMutation,
  type GetUniversitiesRequest,
  type University,
} from "@/services/universities"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import UniversityGrid from "./_components/grid"
import UniversitiesList from "./_components/list"

type ViewType = "grid" | "list"

const UniversitiesPage = () => {
  // State for view type
  const [viewType, setViewType] = useState<ViewType>("list")

  // State for filters
  const [filters, setFilters] = useState<GetUniversitiesRequest>({
    page: 1,
    page_size: 12,
  })

  // API calls
  const { data: universitiesData, isLoading, error, refetch } = useGetUniversitiesQuery(filters)
  const [deleteUniversity] = useDeleteUniversityMutation()
  
  // Handle delete university
  const handleDeleteUniversity = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الجامعة "${name}"؟`)) return
    try {
      await deleteUniversity(id).unwrap()
      toast.success("تم حذف الجامعة بنجاح")
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || "فشل في حذف الجامعة")
    }
  }

  const router = useRouter()

  const handleViewDetails = (universityId: string) => {
    router.push(`/dashboard/universities/${universityId}`)
  }

  const handleEdit = (university: University) => {
    router.push(`/dashboard/universities/createOrUpdate?id=${university.id}`)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Extract data from response based on actual API structure
  const universities = universitiesData?.data?.results || []
  const totalPages = universitiesData?.data?.total_pages || 0
  const currentPage = universitiesData?.data?.current_page || 1
  const totalCount = universitiesData?.data?.count || 0
  const pageSize = universitiesData?.data?.page_size || 12
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center max-w-md bg-card backdrop-blur-sm border border-border/50 shadow-2xl">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">خطأ في تحميل البيانات</h3>
          <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل قائمة الجامعات</p>
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
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">إدارة الجامعات</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary-solid" />
              إدارة وتنظيم الجامعات في النظام
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
            onClick={() => router.push(`/dashboard/universities/createOrUpdate`)}
            className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-xl ripple-effect"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة جامعة جديدة
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      {totalCount > 0 && (
        <Card className="bg-accent/30 border-primary-solid/20 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-primary-solid font-medium">
                عرض {((currentPage - 1) * (filters.page_size || 12)) + 1} إلى {Math.min(currentPage * (filters.page_size || 12), totalCount)} من أصل {totalCount} جامعة
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

      {/* Universities Display */}
      {!isLoading && universities.length > 0 && (
        <>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {universities.map((university: University) => (
                <UniversityGrid
                  key={university.id}
                  university={university}
                  onViewDetails={() => handleViewDetails(university.id)}
                  onEdit={() => handleEdit(university)}
                  onDelete={() => handleDeleteUniversity(university.id, university.name)}
                />
              ))}
            </div>
          ) : (
            <UniversitiesList
              universities={universities}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteUniversity}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && universities.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="p-8 text-center max-w-md bg-card backdrop-blur-sm border-border/50 shadow-2xl">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد جامعات</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على أي جامعات في النظام</p>
            <Button 
              onClick={() => router.push(`/dashboard/universities/createOrUpdate`)}
              className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg ripple-effect"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة جامعة جديدة
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default UniversitiesPage