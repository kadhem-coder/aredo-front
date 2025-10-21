"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"

interface FormsPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const FormsPagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: FormsPaginationProps) => {
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

  const pageSizeOptions = [10, 12, 20, 30, 50]
  const startItem = ((currentPage - 1) * pageSize) + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">عرض</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">لكل صفحة</span>
          </div>

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent/50"}
                />
              </PaginationItem>
              
              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(item as number)}
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
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent/50"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Results Info */}
          <div className="text-sm text-muted-foreground">
            عرض {startItem} - {endItem} من {totalCount}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormsPagination