// app/dashboard/forms/createOrUpdate/components/FormSections.tsx

import React from "react";
import {
  User,
  GraduationCap,
  DollarSign,
  FileText,
  CheckCircle,
  Shield,
  Upload,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DynamicFormField } from "./DynamicFormField";
import { type FormKind } from "@/services/formkinds";
import { type CreateFormRequest } from "@/services/forms";
import { StatusSection } from "./StatusSection";

interface FormSectionsProps {
  selectedFormKind: FormKind | undefined;
  formKindId: string;
  formData: any;
  errors: any;
  categorizedFields: {
    personal: string[];
    academic: string[];
    financial: string[];
    additional: string[];
    boolean: string[];
    status: string[];
  };
  isLoading: boolean;
  isEdit: boolean;
  isLoadingKinds: boolean;
  formKindsData: any;
  universitiesData: any;
  isLoadingUniversities: boolean;
  handleChange: (name: any, value: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormSections: React.FC<FormSectionsProps> = ({
  selectedFormKind,
  formKindId,
  formData,
  errors,
  categorizedFields,
  isLoading,
  isEdit,
  isLoadingKinds,
  formKindsData,
  universitiesData,
  isLoadingUniversities,
  handleChange,
  handleFileChange,
}) => {
  // ✅ البحث عن اسم النوع المحدد
  const selectedKindName = React.useMemo(() => {
    if (!formData.kind || !formKindsData?.data?.results) return null;
    const kind = formKindsData.data.results.find((k: any) => k.id === formData.kind);
    return kind ? `${kind.name} - ${kind.manager}` : null;
  }, [formData.kind, formKindsData]);

  return (
    <>
      {/* Form Kind Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            نوع الاستمارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="kind">نوع الاستمارة *</Label>
            
            {/* ✅ عرض مختلف في وضع التعديل */}
            {isEdit ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md border">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedKindName || 'جاري التحميل...'}
                  </span>
                  <Badge variant="secondary" className="mr-auto">
                    محدد
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ لا يمكن تغيير نوع الاستمارة بعد الإنشاء
                </p>
              </div>
            ) : (
              // ✅ Select عادي في وضع الإنشاء
              <>
                <Select
                  value={formData.kind}
                  onValueChange={(value) => handleChange("kind", value)}
                  disabled={isLoading || isLoadingKinds}
                >
                  <SelectTrigger
                    className={errors.kind ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="اختر نوع الاستمارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingKinds ? (
                      <div className="p-2 text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      </div>
                    ) : formKindsData?.data?.results?.length > 0 ? (
                      formKindsData.data.results.map((kind: any) => (
                        <SelectItem key={kind.id} value={kind.id}>
                          {kind.name} - {kind.manager}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        لا توجد أنواع متاحة
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.kind && (
                  <p className="text-sm text-destructive">{errors.kind}</p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Sections */}
      {selectedFormKind ? (
        <>
          {/* Personal Information */}
          {categorizedFields.personal.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedFields.personal.map((field) => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleChange(field, value)}
                      error={errors[field]}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Information */}
          {categorizedFields.academic.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  المعلومات الأكاديمية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedFields.academic.map((field) => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleChange(field, value)}
                      error={errors[field]}
                      isLoading={isLoading}
                      universitiesData={universitiesData}
                      isLoadingUniversities={isLoadingUniversities}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Information */}
          {categorizedFields.financial.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedFields.financial.map((field) => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleChange(field, value)}
                      error={errors[field]}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {categorizedFields.additional.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  معلومات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedFields.additional.map((field) => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleChange(field, value)}
                      error={errors[field]}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boolean Options */}
          {categorizedFields.boolean.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  خيارات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedFields.boolean.map((field) => (
                    <DynamicFormField
                      key={field}
                      fieldName={field}
                      value={formData[field]}
                      onChange={(value) => handleChange(field, value)}
                      error={errors[field]}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Fields (Admin Only) */}
          {categorizedFields.status.length > 0 && (
            <StatusSection
              formData={formData}
              handleChange={handleChange}
              isLoading={isLoading}
                  formKind={selectedFormKind}  // إضافة هذا السطر
    activeFields={categorizedFields.status}  // إضافة هذا السطر

            />
          )}

          {/* PDF Upload */}
          {selectedFormKind.pdf && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  المرفقات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="pdf">
                    رفع ملف PDF {selectedFormKind.requires_file_upload && "*"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="cursor-pointer"
                    />
                    {formData.pdf && (
                      <Badge variant="outline" className="whitespace-nowrap">
                        {formData.pdf.name || 'ملف PDF محمل'}
                      </Badge>
                    )}
                  </div>
                  {selectedFormKind.requires_file_upload && (
                    <p className="text-xs text-muted-foreground">
                      * رفع ملف PDF مطلوب لهذا النوع من الاستمارات
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        // No FormKind Selected
        formData.kind === "" && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                اختر نوع الاستمارة أولاً
              </h3>
              <p className="text-muted-foreground text-sm">
                الحقول المتاحة ستظهر بناءً على نوع الاستمارة المختار
              </p>
            </CardContent>
          </Card>
        )
      )}
    </>
  );
};