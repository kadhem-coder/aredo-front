// app/dashboard/forms/createOrUpdate/components/Sidebar.tsx

import React from 'react'
import { 
  FileText, Phone, Building, User, CheckCircle, 
  Save, X, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type FormKind } from '@/services/formkinds'

interface SidebarProps {
  formData: any
  selectedFormKind: FormKind | undefined
  isSuccess: boolean
  isLoading: boolean
  isEdit: boolean
  activeFieldsCount: number
  onBack: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  formData,
  selectedFormKind,
  isSuccess,
  isLoading,
  isEdit,
  activeFieldsCount,
  onBack ,

}) => {
  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>معاينة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-col gap-3 p-4 border rounded-lg transition-all duration-300 ${
            isSuccess ? 'border-green-500 bg-green-50 scale-105' : ''
          }`}>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold transition-transform duration-300 ${
                  isSuccess ? 'scale-110' : ''
                }`}>
                  <FileText className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate transition-colors duration-300 ${
                  isSuccess ? 'text-green-800' : ''
                }`}>
                  {formData.full_name || 'اسم المتقدم'}
                </h3>
                {formData.email && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {formData.email}
                  </p>
                )}
              </div>
              {isSuccess && (
                <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
              )}
            </div>
            
            {selectedFormKind && (
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">النوع:</span>
                  <span className="font-medium">{selectedFormKind.name}</span>
                </div>
                
                {formData.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">الهاتف:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                )}

                {formData.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">القسم:</span>
                    <span className="font-medium">{formData.department}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Summary Card */}
      {selectedFormKind && (formData.submitted || formData.approved || formData.accepted || formData.received || formData.payoff || formData.touch) && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.submitted && (
                <Badge className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  مُقدَّم
                </Badge>
              )}
              {formData.approved && (
                <Badge className="w-full justify-start bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  موافق عليه
                </Badge>
              )}
              {formData.accepted && (
                <Badge className="w-full justify-start bg-purple-100 text-purple-800 border-purple-200">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  مقبول
                </Badge>
              )}
              {formData.received && (
                <Badge className="w-full justify-start bg-blue-100 text-blue-800 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  مستلم
                </Badge>
              )}
              {formData.payoff && (
                <Badge className="w-full justify-start bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  مدفوع
                </Badge>
              )}
              {formData.touch && (
                <Badge className="w-full justify-start bg-amber-100 text-amber-800 border-amber-200">
                  <Phone className="h-3 w-3 mr-2" />
                  تم التواصل
                </Badge>
              )}
              {!formData.submitted && !formData.approved && !formData.accepted && (
                <Badge className="w-full justify-start" variant="secondary">
                  مسودة
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FormKind Info Card */}
      {selectedFormKind && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 text-sm">معلومات الاستمارة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <span className="text-blue-700 font-medium">المدير:</span>
                <span className="text-blue-900 mr-1">{selectedFormKind.manager}</span>
              </div>
            </div>
            {selectedFormKind.phonefield && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="text-blue-700 font-medium">للاستفسار:</span>
                  <span className="text-blue-900 mr-1">{selectedFormKind.phonefield}</span>
                </div>
              </div>
            )}
            {selectedFormKind.description && (
              <div className="pt-2 border-t border-blue-200">
                <p className="text-blue-800 text-xs">{selectedFormKind.description}</p>
              </div>
            )}
            <div className="pt-2 border-t border-blue-200 space-y-1">
              {selectedFormKind.requires_university && (
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700">يتطلب اختيار جامعة</span>
                </div>
              )}
              {selectedFormKind.requires_file_upload && (
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700">يتطلب رفع ملف PDF</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <FileText className="h-3 w-3 text-blue-600" />
                <span className="text-blue-700">
                  عدد الحقول النشطة: {activeFieldsCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button 
                type="submit"  // ✅ نعيده submit
              variant={isSuccess ? "default" : "outline"}
              disabled={isLoading}
              className={`w-full transition-all duration-300 ${
                isSuccess 
                  ? 'bg-green-500 hover:bg-green-600 text-white transform scale-105' 
                  : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تم الحفظ بنجاح!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {isEdit ? 'حفظ التغييرات' : 'إضافة الاستمارة'}
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="w-full"
            >
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}