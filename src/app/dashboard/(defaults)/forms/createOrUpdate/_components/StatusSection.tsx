// app/dashboard/forms/createOrUpdate/components/StatusSection.tsx

import React from "react";
import {
  Shield,
  CheckCircle,
  Phone,
  Clock,
  Package,
  CreditCard,
  FileCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusSectionProps {
  formData: any;
  handleChange: (name: string, value: any) => void;
  isLoading: boolean;
  formKind?: any;
  activeFields?: string[]; // إضافة activeFields
}

// تعريف الحالات مع معلوماتها
const STATUS_FIELDS = [
  {
    id: "touch",
    label: "التواصل",
    activeLabel: "تم التواصل",
    inactiveLabel: "لم يتم التواصل",
    description: "حالة التواصل مع المتقدم",
    icon: Phone,
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
    checkedBg: "bg-amber-500",
    checkedRing: "ring-amber-500",
  },
  {
    id: "payoff",
    label: "الدفع",
    activeLabel: "مدفوع",
    inactiveLabel: "غير مدفوع",
    description: "حالة سداد الرسوم المطلوبة",
    icon: CreditCard,
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
    checkedBg: "bg-emerald-500",
    checkedRing: "ring-emerald-500",
  },
  {
    id: "submitted",
    label: "التقديم",
    activeLabel: "مُقدَّم",
    inactiveLabel: "غير مُقدَّم",
    description: "حالة تقديم الاستمارة",
    icon: FileCheck,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    textColor: "text-blue-700",
    checkedBg: "bg-blue-500",
    checkedRing: "ring-blue-500",
  },
  {
    id: "received",
    label: "الاستلام",
    activeLabel: "مستلم",
    inactiveLabel: "غير مستلم",
    description: "حالة استلام المستندات",
    icon: Package,
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
    textColor: "text-indigo-700",
    checkedBg: "bg-indigo-500",
    checkedRing: "ring-indigo-500",
  },
  {
    id: "accepted",
    label: "القبول",
    activeLabel: "مقبول",
    inactiveLabel: "غير مقبول",
    description: "حالة قبول الطلب نهائياً",
    icon: CheckCircle,
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    textColor: "text-purple-700",
    checkedBg: "bg-purple-500",
    checkedRing: "ring-purple-500",
  },
  {
    id: "approved",
    label: "الموافقة",
    activeLabel: "موافق عليه",
    inactiveLabel: "غير موافق",
    description: "حالة الموافقة على الاستمارة",
    icon: CheckCircle,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    textColor: "text-green-700",
    checkedBg: "bg-green-500",
    checkedRing: "ring-green-500",
  },
];

// الحقول الإدارية
const ADMIN_ONLY_FIELDS = ['touch', 'payoff', 'submitted', 'received', 'accepted', 'approved'];

export const StatusSection: React.FC<StatusSectionProps> = ({
  formData,
  handleChange,
  isLoading,
  formKind,
  activeFields = [],
}) => {
  // فلترة الحقول لإظهار المطلوبة فقط من الحقول الإدارية
  const requiredFields = STATUS_FIELDS.filter((field) => {
    // التحقق من أن الحقل من الحقول الإدارية
    if (!ADMIN_ONLY_FIELDS.includes(field.id)) {
      return false;
    }
    
    // التحقق من أن الحقل مطلوب في نوع الاستمارة
    // يمكن أن يكون موجود في activeFields أو formKind[field.id] === true
    return activeFields.includes(field.id) || (formKind && formKind[field.id] === true);
  });

  // إذا لم توجد حقول مطلوبة، لا نعرض القسم
  if (requiredFields.length === 0) {
    return null;
  }

  const activeCount = requiredFields.filter(
    (f) => formData[f.id] === true
  ).length;

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-amber-900 font-bold">
              حالة الاستمارة (إدارة فقط)
            </CardTitle>
            <p className="text-sm text-amber-700 mt-1">
              حدد حالة كل عنصر من عناصر الاستمارة المطلوبة
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {requiredFields.map(
          ({
            id,
            label,
            activeLabel,
            inactiveLabel,
            description,
            icon: Icon,
            bgColor,
            borderColor,
            textColor,
            checkedBg,
            checkedRing,
          }) => {
            const currentValue = formData[id] === true;

            return (
              <div
                key={id}
                className={`rounded-xl border-2 transition-all duration-200 ${
                  currentValue
                    ? `${borderColor} ${bgColor} shadow-md`
                    : `border-gray-300 bg-gray-50`
                }`}
              >
                <div className={`p-4 ${isLoading ? "opacity-50" : ""}`}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        currentValue
                          ? `${checkedBg} shadow-md`
                          : "bg-white border-2 border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          currentValue ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-base ${
                          currentValue ? textColor : "text-gray-700"
                        }`}
                      >
                        {label}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Radio Buttons */}
                  <div className="grid grid-cols-2 gap-3 mr-13">
                    {/* Active Option */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentValue
                          ? `${borderColor} ${bgColor} shadow-sm`
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } ${isLoading ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={id}
                          checked={currentValue}
                          onChange={() => handleChange(id, true)}
                          disabled={isLoading}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            currentValue
                              ? `${borderColor.replace(
                                  "border-",
                                  "border-"
                                )} ${checkedBg}`
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {currentValue && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <CheckCircle
                          className={`h-4 w-4 ${
                            currentValue ? textColor : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            currentValue ? textColor : "text-gray-600"
                          }`}
                        >
                          {activeLabel}
                        </span>
                      </div>
                    </label>

                    {/* Inactive Option */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        !currentValue
                          ? "border-gray-400 bg-gray-100 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } ${isLoading ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={id}
                          checked={!currentValue}
                          onChange={() => handleChange(id, false)}
                          disabled={isLoading}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            !currentValue
                              ? "border-gray-500 bg-gray-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {!currentValue && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <XCircle
                          className={`h-4 w-4 ${
                            !currentValue ? "text-gray-700" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            !currentValue ? "text-gray-700" : "text-gray-600"
                          }`}
                        >
                          {inactiveLabel}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Active Indicator Line */}
                {currentValue && (
                  <div className={`h-1 ${checkedBg} rounded-b-lg`} />
                )}
              </div>
            );
          }
        )}

        {/* Summary Footer */}
        <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-amber-900 font-medium">
                الحالات المفعلة:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-900">
                {activeCount}
              </span>
              <span className="text-sm text-amber-700">
                من {requiredFields.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{
                width: requiredFields.length > 0 
                  ? `${(activeCount / requiredFields.length) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};