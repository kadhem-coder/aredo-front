"use client";

import React from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { useGetNewsQuery } from "@/services/news";
import NewsCard from "@/components/website/NewsCard";

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

interface CategorySectionProps {
  category: NewsType;
  index: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, index }) => {
  const {
    data: newsResponse,
    isLoading,
    error,
  } = useGetNewsQuery({
    page: 1,
    page_size: 5,
    news_type_id: category.id,
    ordering: "-created_at",
  }) as { data: NewsApiResponse | undefined; isLoading: boolean; error: any };

  const news = newsResponse?.data || [];

 
  if (isLoading) {
    return (
      <section id={`category-${category.id}`} className="mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h2>
            <span className="text-sm text-gray-500">جاري التحميل...</span>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error(`Error loading news for ${category.name}:`, error);
    return (
      <section id={`category-${category.id}`} className="mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-500" />
            <h2 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h2>
            <span className="text-sm text-red-500">خطأ في التحميل</span>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">فشل في تحميل أخبار هذا القسم</p>
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    console.log(
      `No news found for category ${category.name} - hiding section`
    );
    return null;
  }

  const convertedNews = news.map((newsItem: NewsItem, idx: number) => {
    return {
      id: newsItem.id,
      title: newsItem.title,
      excerpt:
        newsItem.content.length > 150
          ? `${newsItem.content.substring(0, 150)}...`
          : newsItem.content,
      category: newsItem.news_type_name || category.name,
      categoryColor: category.color,
      categorySlug: category.id,
      publishedAt: newsItem.created_at,
      views: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      image:
        newsItem.images && newsItem.images.length > 0
          ? newsItem.images[0].image_url
          : `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&q=80`,
      author: { name: "فريق التحرير" },
    };
  });

  return (
    <section id={`category-${category.id}`} className="mb-16">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div
          className="bg-gradient-to-r  text-white pt-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{category.name}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {convertedNews[0] && (
              <div className="lg:col-span-3">
                <div className="relative group">
                  <NewsCard news={convertedNews[0]} variant="featured" />
                </div>
              </div>
            )}
            <div className="lg:col-span-2 space-y-4">
              {convertedNews.slice(1, 5).map((newsItem, idx) => (
                <div key={newsItem.id} className="relative">
                  <div className="absolute -right-3 top-3 z-10">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: category.color }}
                    >
                      {idx + 2}
                    </div>
                  </div>
                  <NewsCard news={newsItem} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;