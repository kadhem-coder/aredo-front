"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ArrowUp, TrendingUp, Clock } from "lucide-react";

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

interface NewsSliderProps {
  latestNews: NewsItem[];
  categories: NewsType[];
  loading: boolean;
}

const NewsSlider: React.FC<NewsSliderProps> = ({ 
  latestNews, 
  categories, 
  loading 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // تحديث السلايدر تلقائياً
  useEffect(() => {
    if (latestNews.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % latestNews.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [latestNews.length]);

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (latestNews.length === 0) return null;

  return (
    <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden mb-8 group">
      {/* الصور والمحتوى */}
      <div className="relative h-full">
        {latestNews.map((newsItem, index) => {
          const category = categories.find(
            (cat) => cat.id === newsItem.news_type
          );

          return (
            <div
              key={newsItem.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* صورة الخلفية */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    newsItem.images?.[0]?.image_url ||
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop&q=80"
                  })`,
                }}
              />

              {/* تدرج للنص */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* المحتوى */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-4xl">
                  {/* تصنيف الخبر */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: category?.color || "#3B82F6",
                      }}
                    >
                      {newsItem.news_type_name}
                    </span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(newsItem.created_at).toLocaleDateString(
                        "ar-SA"
                      )}
                    </span>
                  </div>

                  {/* عنوان الخبر */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {newsItem.title}
                  </h2>

                  {/* مقتطف من المحتوى */}
                  <p className="text-lg text-white/90 mb-6 line-clamp-2">
                    {newsItem.content.length > 200
                      ? `${newsItem.content.substring(0, 200)}...`
                      : newsItem.content}
                  </p>

                  {/* زر قراءة المزيد */}
                  <button
                    onClick={() =>
                      window.open(`/news/${newsItem.id}`, "_blank")
                    }
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    اقرأ المزيد
                    <ArrowUp className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* المؤشرات السفلية */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        {latestNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* أزرار التنقل */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + latestNews.length) % latestNews.length
            )
          }
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowUp className="w-5 h-5 rotate-90" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % latestNews.length)
          }
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowUp className="w-5 h-5 -rotate-90" />
        </button>
      </div>

      {/* شارة "أحدث الأخبار" */}
      <div className="absolute top-4 right-4">
        <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold">
          <TrendingUp className="w-4 h-4" />
          أحدث الأخبار
        </div>
      </div>
    </div>
  );
};

export default NewsSlider;