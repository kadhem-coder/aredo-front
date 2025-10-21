"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Loader2,
  University,
  MapPin,
  Building,
  ArrowRight,
  Search,
  Download,
  FileText,
} from "lucide-react";
import { useGetCountriesQuery } from "@/services/country";
import { useGetUniversitiesQuery } from "@/services/universities";

const UniversitiesPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الدول
  const { data: countriesResponse, isLoading: countriesLoading } = useGetCountriesQuery({
    page_size: 50
  });

  const countries = countriesResponse?.data?.results || [];

  // جلب جامعات الدولة المحددة مع الفلترة
  const { data: universitiesResponse, isLoading: universitiesLoading, refetch } = 
    useGetUniversitiesQuery(
      selectedCountry ? {
        page: 1,
        page_size: 100,
        country_id: selectedCountry,
        search: searchTerm || undefined,
      } : undefined,
      { skip: !selectedCountry }
    );

  const universities = universitiesResponse?.data?.results || [];
  const selectedCountryData = countries.find((c: any) => c.id === selectedCountry);

  // دالة لتحديد الدولة وإعادة جلب البيانات
  const handleSelectCountry = (countryId: string) => {
    setSelectedCountry(countryId);
    setSearchTerm(""); // إعادة تعيين البحث عند تغيير الدولة
  };

  // إعادة جلب البيانات عند تغيير selectedCountry
  useEffect(() => {
    if (selectedCountry) {
      refetch();
    }
  }, [selectedCountry, refetch]);

  // دالة البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      refetch();
    }
  };

  // دالة تحميل الدليل
  const handleDownloadPdf = (pdfUrl: string, universityName: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${universityName}_guide.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUniversityTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniversityTypeText = (type: string) => {
    switch (type) {
      case 'public': return 'حكومية';
      case 'private': return 'خاصة';
      case 'mixed': return 'مختلطة';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <University className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">دليل الجامعات</h1>
            <p className="text-gray-600 mt-2">
              اختر دولة لعرض جامعاتها
            </p>
          </div>
        </div>

        {/* عرض الدول */}
        {!selectedCountry && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              اختر الدولة
            </h2>
            
            {countriesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {countries.map((country: any) => (
                  <button
                    key={country.id}
                    onClick={() => handleSelectCountry(country.id)}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="text-center">
                      <Building className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{country.name}</h3>
                      <span className="text-sm text-gray-500">{country.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* عرض جامعات الدولة المختارة */}
        {selectedCountry && (
          <div className="space-y-6">
            {/* زر العودة للدول */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              العودة لقائمة الدول
            </button>

            {/* شريط البحث */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن جامعة..."
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  بحث
                </button>
              </form>
            </div>

            {/* قائمة الجامعات */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <University className="w-6 h-6 text-blue-600" />
                    جامعات {selectedCountryData?.name}
                  </h2>
                  <span className="text-gray-600 font-medium">
                    {universities.length} جامعة
                  </span>
                </div>
              </div>

              {universitiesLoading ? (
                <div className="flex justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">جاري تحميل الجامعات...</p>
                  </div>
                </div>
              ) : universities.length === 0 ? (
                <div className="text-center py-16">
                  <University className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    لا توجد جامعات
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? "لم نتمكن من العثور على جامعات تطابق بحثك"
                      : "لا توجد جامعات مسجلة في هذه الدولة حالياً"
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {universities.map((university: any) => (
                    <div key={university.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <University className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {university.name}
                              </h3>
                              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getUniversityTypeColor(university.university_type)}`}>
                                {getUniversityTypeText(university.university_type)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-600 mr-14">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{university.country_name || selectedCountryData?.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* زر تحميل الدليل */}
                        {university.pdf && (
                          <button
                            onClick={() => handleDownloadPdf(university.pdf, university.name)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            تحميل الدليل
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UniversitiesPage;