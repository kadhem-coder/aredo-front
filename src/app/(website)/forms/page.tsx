"use client";

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  ArrowRight, 
  GraduationCap,
  AlertCircle,
  Languages,
  DollarSign,
  BookOpen,
  Truck,
  Plane,
  Building,
  UserCheck,
  Globe,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useGetActiveFormKindsQuery } from '@/services/formkinds';

// خريطة الأيقونات
const iconMap: Record<string, React.ElementType> = {
  'GraduationCap': GraduationCap,
  'AlertCircle': AlertCircle,
  'Languages': Languages,
  'DollarSign': DollarSign,
  'BookOpen': BookOpen,
  'Truck': Truck,
  'Plane': Plane,
  'Building': Building,
  'UserCheck': UserCheck,
  'Globe': Globe,
  'CheckCircle': CheckCircle,
  'FileText': FileText,
};

// خريطة الألوان بناءً على الأيقونة أو الاسم
const colorMap: Record<string, { color: string; bgColor: string }> = {
  'GraduationCap': { color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  'AlertCircle': { color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100 border-red-200' },
  'Languages': { color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100 border-green-200' },
  'DollarSign': { color: 'text-yellow-600', bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  'BookOpen': { color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  'Truck': { color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  'Plane': { color: 'text-sky-600', bgColor: 'bg-sky-50 hover:bg-sky-100 border-sky-200' },
  'Building': { color: 'text-violet-600', bgColor: 'bg-violet-50 hover:bg-violet-100 border-violet-200' },
  'UserCheck': { color: 'text-teal-600', bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-200' },
  'Globe': { color: 'text-emerald-600', bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  'CheckCircle': { color: 'text-cyan-600', bgColor: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200' },
  'FileText': { color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
};

const FormsDisplayPage: React.FC = () => {
  const router = useRouter();
  
  // جلب أنواع الاستمارات النشطة من API
  const { data, isLoading, isError, error } = useGetActiveFormKindsQuery({ page_size: 100 });

  const handleFormClick = (formId: string) => {
    router.push(`/dashboard/user-forms/${formId}`);
  };

  // حساب الإحصائيات من البيانات المسترجعة
  const statistics = useMemo(() => {
    if (!data?.data?.results) return { academic: 0, translation: 0, services: 0, travel: 0, total: 0 };
    
    const forms = data.data.results;
    return {
      academic: forms.filter(f => f.requires_university).length,
      translation: forms.filter(f => f.name.includes('ترجمة') || f.name.includes('Translation')).length,
      services: forms.filter(f => !f.requires_university && !f.name.includes('ترجمة')).length,
      travel: forms.filter(f => f.name.includes('طيران') || f.name.includes('Flight')).length,
      total: forms.length
    };
  }, [data]);

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الاستمارات...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-bold mb-2">حدث خطأ في تحميل الاستمارات</p>
          <p className="text-gray-600 mb-4">{error?.toString() || 'خطأ غير معروف'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const formKinds = data?.data?.results || [];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            الخدمات المتوفرة لدينا
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نقدم مجموعة متنوعة من الخدمات الأكاديمية والإدارية لتلبية احتياجاتكم المختلفة
          </p>
        </div>

        {/* Forms Grid */}
        {formKinds.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد استمارات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {formKinds.map((form) => {
              // تحديد الأيقونة
              const IconComponent = iconMap[form.icon] || FileText;
              
              // تحديد الألوان
              const colors = colorMap[form.icon] || { 
                color: 'text-gray-600', 
                bgColor: 'bg-gray-50 hover:bg-gray-100 border-gray-200' 
              };
              
              // تحديد الفئة
              let category = 'services';
              let categoryLabel = 'خدمات';
              let categoryColor = 'bg-purple-100 text-purple-800';
              
              if (form.requires_university) {
                category = 'academic';
                categoryLabel = 'أكاديمي';
                categoryColor = 'bg-blue-100 text-blue-800';
              } else if (form.name.includes('ترجمة') || form.name.includes('Translation')) {
                category = 'translation';
                categoryLabel = 'ترجمة';
                categoryColor = 'bg-green-100 text-green-800';
              } else if (form.name.includes('طيران') || form.name.includes('Flight')) {
                category = 'travel';
                categoryLabel = 'سفر';
                categoryColor = 'bg-sky-100 text-sky-800';
              }

              return (
                <div
                  key={form.id}
                  onClick={() => handleFormClick(form.id)}
                  className={`${colors.bgColor} border-2 p-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                      <IconComponent className={`w-6 h-6 ${colors.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {form.name}
                  </h3>
                  {/* <p className="text-sm text-gray-500 mb-2">
                    المدير: {form.manager}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    {form.description || 'لا يوجد وصف متاح'}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    📞 {form.phonefield}
                  </p> */}

                </div>
              );
            })}
          </div>
        )}

        {/* Statistics */}
        {/* <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            إحصائيات الخدمات
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{statistics.academic}</div>
              <div className="text-sm text-gray-600">خدمات أكاديمية</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Languages className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{statistics.translation}</div>
              <div className="text-sm text-gray-600">خدمات ترجمة</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{statistics.services}</div>
              <div className="text-sm text-gray-600">خدمات إدارية</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plane className="w-8 h-8 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{statistics.travel}</div>
              <div className="text-sm text-gray-600">خدمات سفر</div>
            </div>
          </div>
        </div> */}

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            هل تحتاج مساعدة؟
          </h3>
          <p className="text-gray-600 mb-4">
            فريق الدعم جاهز لمساعدتك في اختيار الخدمة المناسبة وتقديم الاستشارة اللازمة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              تواصل معنا
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              دليل الخدمات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsDisplayPage;