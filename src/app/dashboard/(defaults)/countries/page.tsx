"use client"

import { useState } from "react"
import { Plus, XCircle, Grid3X3, List, Globe, MapPin } from "lucide-react"
import {
  useGetCountriesQuery,
  useDeleteCountryMutation,
  type GetCountriesRequest,
  type Country,
} from "@/services/country"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import CountryGrid from "./_components/grid"
import CountriesList from "./_components/list"

type ViewType = "grid" | "list"

const CountriesPage = () => {
  // State for view type
  const [viewType, setViewType] = useState<ViewType>("list")

  // State for filters
  const [filters, setFilters] = useState<GetCountriesRequest>({
    page: 1,
    page_size: 12,
  })

  // API calls
  const { data: countriesData, isLoading, error, refetch } = useGetCountriesQuery(filters)
  const [deleteCountry] = useDeleteCountryMutation()
  // Handle delete country
  const handleDeleteCountry = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الدولة "${name}"؟`)) return
    try {
      await deleteCountry(id).unwrap()
      toast.success("تم حذف الدولة بنجاح")
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || "فشل في حذف الدولة")
    }
  }

  const router = useRouter()

  const handleViewDetails = (countryId: string) => {
    router.push(` /dashboard/countries/${countryId}`)
  }

  const handleEdit = (country: Country) => {
    router.push(`/dashboard/countries/createOrUpdate?id=${country.id}`)
  }

  // Extract data from response
  const countries = countriesData?.data?.results || []
  const totalPages = countriesData?.count ? Math.ceil(countriesData.count / (filters.page_size || 12)) : 0
  const currentPage = filters.page || 1
  const totalCount = countriesData?.count || 0
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center max-w-md bg-card backdrop-blur-sm border border-border/50 shadow-2xl">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">خطأ في تحميل البيانات</h3>
          <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل قائمة الدول</p>
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
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">إدارة الدول</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary-solid" />
              إدارة وتنظيم الدول في النظام
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
            onClick={() => router.push(`/dashboard/countries/createOrUpdate`)}
            className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-xl ripple-effect"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة دولة جديدة
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      {totalCount > 0 && (
        <Card className="bg-accent/30 border-primary-solid/20 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-primary-solid font-medium">
                عرض {((currentPage - 1) * (filters.page_size || 12)) + 1} إلى {Math.min(currentPage * (filters.page_size || 12), totalCount)} من أصل {totalCount} دولة
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

      {/* Countries Display */}
      {!isLoading && countries.length > 0 && (
        <>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {countries.map((country: Country) => (
                <CountryGrid
                  key={country.id}
                  country={country}
                  onViewDetails={() => handleViewDetails(country.id)}
                  onEdit={() => handleEdit(country)}
                  onDelete={() => handleDeleteCountry(country.id, country.name)}
                />
              ))}
            </div>
          ) : (
            <CountriesList
              countries={countries}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteCountry}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && countries.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="p-8 text-center max-w-md bg-card backdrop-blur-sm border-border/50 shadow-2xl">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">لا توجد دول</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على أي دول في النظام</p>
            <Button 
              onClick={() => router.push(`/dashboard/countries/createOrUpdate`)}
              className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg ripple-effect"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة دولة جديدة
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CountriesPage
