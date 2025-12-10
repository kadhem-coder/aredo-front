"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetNewsQuery } from "@/services/news";
import NewsCard from "@/components/website/NewsCard";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  news_type_name: string;
  news_type_id: string;
  news_type: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  images: {
    id: number;
    image_url: string;
    title: string;
  }[];
  created_at: string;
  updated_at: string;
  images_count: number;
}

interface NewsListResponse {
  success: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsItem[];
}

const CategoryNewsPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // جلب أخبار القسم
  const {
    data: newsResponse,
    isLoading,
    error,
  } = useGetNewsQuery({
    page: currentPage,
    page_size: pageSize,
    news_type_id: categoryId,
    ordering: "-created_at",
  }) as { data: NewsListResponse | undefined; isLoading: boolean; error: any };

  const news = newsResponse?.results || [];
  const totalCount = newsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // الحصول على بيانات القسم من أول خبر
  const currentCategory = news.length > 0 ? news[0].news_type : null;

  // تحويل البيانات لصيغة NewsCard
  const convertedNews = news.map((newsItem: NewsItem) => ({
    id: newsItem.id,
    title: newsItem.title,
    excerpt:
      newsItem.content.length > 150
        ? `${newsItem.content.substring(0, 150)}...`
        : newsItem.content,
    category: newsItem.news_type?.name || newsItem.news_type_name || "عام",
    categoryColor: newsItem.news_type?.color || "#3B82F6",
    categorySlug: categoryId,
    publishedAt: newsItem.created_at,
    views: Math.floor(Math.random() * 5000) + 100,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 1,
    image:
      newsItem.images && newsItem.images.length > 0
        ? newsItem.images[0].image_url
        : `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&q=80`,
    author: { name: "فريق التحرير" },
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">جاري تحميل الأخبار...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              خطأ في تحميل الأخبار
            </h2>
            <p className="text-gray-600 mb-6">
              عذراً، حدث خطأ أثناء تحميل أخبار هذا القسم
            </p>
            <button
              onClick={() => router.push("/news")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للأخبار
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {currentCategory && (
          <div className="mb-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <button
                onClick={() => router.push("/")}
                className="hover:text-blue-600 transition-colors"
              >
                الرئيسية
              </button>
              <span>/</span>
              <button
                onClick={() => router.push("/news")}
                className="hover:text-blue-600 transition-colors"
              >
                الأخبار
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {currentCategory.name}
              </span>
            </div>

            {/* Category Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                className="p-8 text-white"
                style={{
                  background: `linear-gradient(135deg, ${currentCategory.color} 0%, ${currentCategory.color}dd 100%)`,
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        {currentCategory.name}
                      </h1>
                      <p className="text-white/90 text-lg">
                        {totalCount} خبر متوفر
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.back()}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    رجوع
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              لا توجد أخبار حالياً
            </h3>
            <p className="text-gray-600 mb-6">
              لم يتم نشر أي أخبار في هذا القسم بعد
            </p>
            <button
              onClick={() => router.push("/news")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              تصفح الأقسام الأخرى
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {convertedNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} variant="default" />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                    السابق
                  </button>

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // عرض الصفحات القريبة من الصفحة الحالية
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-xl transition-all ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    التالي
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mt-4 text-gray-600">
                  الصفحة {currentPage} من {totalPages} ({totalCount} خبر)
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryNewsPage;