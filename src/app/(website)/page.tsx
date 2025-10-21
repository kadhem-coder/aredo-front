"use client";

import React from "react";
import { Loader2, Globe } from "lucide-react";
import { useGetNewsQuery } from "@/services/news";
import { useGetActiveNewsTypesQuery } from "@/services/newstype";
import NewsSlider from "@/components/website/NewsSlider";
import CategorySection from "@/components/website/CategorySection";

// تعريف أنواع البيانات
interface NewsItem {
  id: string;
  title: string;
  content: string;
  news_type: string;
  news_type_name: string;
  created_at: string;
  images: {
    id: number;
    image_url: string;
    title: string;
  }[];
}

interface NewsType {
  id: string;
  name: string;
  color: string;
  news_count: number;
}

interface NewsApiResponse {
  success: boolean;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  data: NewsItem[];
  filters_applied?: {
    news_type_id?: string;
  };
}

const ProfessionalNewsPage = () => {
  // جلب آخر 5 أخبار من جميع التصنيفات للسلايدر
  const { data: latestNewsResponse, isLoading: latestNewsLoading } =
    useGetNewsQuery({
      page: 1,
      page_size: 5,
      ordering: "-created_at",
    }) as { data: NewsApiResponse | undefined; isLoading: boolean; error: any };

  const latestNews = latestNewsResponse?.data || [];

  // جلب التصنيفات
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetActiveNewsTypesQuery({
      page_size: 20,
      ordering: "name",
    });

  const categories = categoriesResponse?.results || [];

  return (
    <>
      {/* السلايدر */}
      <NewsSlider 
        latestNews={latestNews} 
        categories={categories}
        loading={latestNewsLoading}
      />

      {/* أقسام التصنيفات */}
      <div className="space-y-12">
        {categoriesLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">جاري تحميل الأخبار...</p>
            </div>
          </div>
        ) : (
          categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              index={index}
            />
          ))
        )}

        {categories.length === 0 && !categoriesLoading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              لا توجد تصنيفات
            </h3>
            <p className="text-gray-500">
              لا توجد تصنيفات أخبار متاحة حالياً
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfessionalNewsPage;