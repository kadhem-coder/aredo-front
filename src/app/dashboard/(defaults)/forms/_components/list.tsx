"use client"

import {
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  CheckCircle,
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
import type { Form } from "@/services/forms"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"

interface FormsListProps {
  forms: Form[]
  onViewDetails: (id: string) => void
  onEdit?: (form: Form) => void
  onDelete?: (id: string, name: string) => void
}

const FormsList = ({ 
  forms, 
  onViewDetails, 
  onEdit, 
  onDelete, 
}: FormsListProps) => {
  const router = useRouter()

  const handleEdit = (form: Form) => {
    if (onEdit) {
      onEdit(form)
    } else {
      router.push(`/dashboard/forms/createOrUpdate?id=${form.id}`)
    }
  }

  const handleDelete = (form: Form) => {
    if (onDelete) {
      onDelete(form.id, form.full_name)
    }
  }

  const handleViewDetails = (formId: string) => {
    onViewDetails(formId)
  }

  const handleRowClick = (form: Form, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return
    }
    handleViewDetails(form.id)
  }

  const getStatusColor = (form: Form) => {
    if (form.approved) return 'from-green-400 to-emerald-500'
    if (form.submitted) return 'from-blue-400 to-indigo-500'
    if (form.accepted) return 'from-purple-400 to-violet-500'
    return 'from-gray-400 to-slate-500'
  }
const getStatusBadge = (form: Form) => {
  // الترتيب حسب الأولوية: accepted -> approved -> submitted -> received -> payoff -> touch
  
  if (form.accepted) return { label: 'مقبولة', color: 'bg-purple-100 text-purple-800 border-purple-200' }
  if (form.approved) return { label: 'موافق عليها', color: 'bg-green-100 text-green-800 border-green-200' }
  if (form.submitted) return { label: 'مقدمة', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  if (form.received) return { label: 'مستلمة', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  if (form.payoff) return { label: 'مدفوعة', color: 'bg-teal-100 text-teal-800 border-teal-200' }
  if (form.touch) return { label: 'تم اللمس', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  
  return { label: 'مسودة', color: 'bg-gray-100 text-gray-800 border-gray-200' }
}
  return (
    <div className="space-y-4">
      <Card className="bg-card backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-card-foreground">
              <div className="col-span-4">المتقدم</div>
              <div className="col-span-2">النوع</div>
              <div className="col-span-2">الحالة</div>
              <div className="col-span-2">نسبة الإكمال</div>
              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {forms.map((form) => {
              const statusBadge = getStatusBadge(form)
              
              return (
                <div
                  key={form.id}
                  className="px-6 py-5 hover:bg-accent/20 transition-all duration-300 bg-card cursor-pointer group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div 
                      className="col-span-4"
                      onClick={(e) => handleRowClick(form, e)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary-solid/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                          <AvatarFallback className={`bg-gradient-to-br ${getStatusColor(form)} text-white font-bold text-sm shadow-inner`}>
                            <FileText className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-card-foreground truncate text-base group-hover:text-primary-solid transition-colors duration-300">
                            {form.full_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{form.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="text-sm text-card-foreground">
                        {form.kind_name}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </Badge>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${form.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{form.completion_percentage}%</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
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
                            onClick={() => handleViewDetails(form.id)}
                            className="hover:bg-accent/30 transition-colors rounded-lg"
                          >
                            <Eye className="mr-2 h-4 w-4 text-primary-solid" />
                            <span className="text-card-foreground">عرض التفاصيل</span>
                          </DropdownMenuItem>
                          
                        
                            <DropdownMenuItem 
                              onClick={() => handleEdit(form)}
                              className="hover:bg-accent/30 transition-colors rounded-lg"
                            >
                              <Edit className="mr-2 h-4 w-4 text-primary-solid" />
                              <span className="text-card-foreground">تعديل</span>
                            </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-border/30" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(form)}
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
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormsList