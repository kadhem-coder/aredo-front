"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Globe, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  Tag,
  User,
  Loader2,
  AlertCircle,
  Download,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGetNewsByIdQuery, useGetNewsQuery } from '@/services/news';
import { useGetActiveNewsTypesQuery } from '@/services/newstype';

// تعريف أنواع البيانات
interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  news_type: string;
  news_type_name: string;
  created_at: string;
  updated_at: string;
  images: {
    id: number;
    image: string;
    image_url: string;
    title: string;
    caption: string;
    order: number;
    is_active: boolean;
    uploaded_at: string;
    file_size_human: string;
  }[];
}

interface NewsApiResponse {
  success: boolean;
  data: NewsItem;
}

interface RelatedNewsResponse {
  success: boolean;
  data: NewsItem[];
}

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // جلب تفاصيل الخبر
  const { data: newsResponse, isLoading, error } = useGetNewsByIdQuery(newsId) as {
    data: NewsApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  const news = newsResponse?.data;

  // جلب التصنيفات
  const { data: categoriesResponse } = useGetActiveNewsTypesQuery({
    page_size: 50,
    ordering: 'name'
  });

  const categories = categoriesResponse?.results || [];

  // جلب الأخبار ذات الصلة
  const { data: relatedNewsResponse } = useGetNewsQuery({
    page: 1,
    page_size: 4,
    news_type_id: news?.news_type,
    ordering: '-created_at'
  }) as { data: RelatedNewsResponse | undefined };

  const relatedNews = relatedNewsResponse?.data?.filter(item => item.id !== newsId) || [];

  const category = categories.find(cat => cat.id === news?.news_type);

  // وظائف مساعدة
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: news?.title,
      text: news?.content.substring(0, 100) + '...',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('تم نسخ رابط الخبر');
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName || 'news-image.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // معالجة حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل الخبر...</p>
        </div>
      </div>
    );
  }

  // معالجة حالة الخطأ
  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل الخبر</h2>
          <p className="text-gray-600 mb-6">
            عذراً، لم نتمكن من العثور على الخبر المطلوب أو حدث خطأ أثناء التحميل.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors `}>
    
      {/* المحتوى الرئيسي */}
        {/* رأس المقال */}
        <article className={`rounded-xl shadow-lg overflow-hidden mb-8 `}>
          {/* معلومات التصنيف والتاريخ */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span 
                  className="px-3 py-1 rounded-full text-white text-sm font-bold"
                  style={{ backgroundColor: category?.color || '#3B82F6' }}
                >
                  <Tag className="w-3 h-3 inline ml-1" />
                  {news.news_type_name}
                </span>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(news.created_at)}
                  </span>
                  {/* <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    فريق التحرير
                  </span> */}
                </div>
              </div>

            </div>
            
            {/* عنوان الخبر */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {news.title}
            </h1>

            {/* ملخص سريع */}
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {news.content.substring(0, 200)}...
            </p>
          </div>

          {/* معرض الصور */}
          {news.images && news.images.length > 0 && (
            <div className="p-6 border-b dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* الصورة الرئيسية */}
                <div className="lg:col-span-2">
                  <div className="relative group rounded-lg overflow-hidden">
                    <img
                      src={news.images[selectedImageIndex]?.image_url}
                      alt={news.images[selectedImageIndex]?.title || news.title}
                      className="w-full h-80 object-cover cursor-pointer"
                      onClick={() => setIsImageModalOpen(true)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setIsImageModalOpen(true)}
                        className="bg-white/90 text-gray-900 p-3 rounded-full hover:bg-white transition-colors"
                      >
                        <ZoomIn className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {news.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev - 1 + news.images.length) % news.images.length)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev + 1) % news.images.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {news.images[selectedImageIndex]?.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                      {news.images[selectedImageIndex].caption}
                    </p>
                  )}
                </div>

                {/* الصور المصغرة */}
                {news.images.length > 1 && (
                  <div className="space-y-3">
                    {news.images.slice(0, 4).map((image, index) => (
                      <div
                        key={image.id}
                        className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === selectedImageIndex 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image.image_url}
                          alt={image.title || `صورة ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        {index === 3 && news.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                            +{news.images.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* محتوى الخبر */}
          <div className="p-6">
            <div 
              className="prose prose-lg max-w-none leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              <div className="whitespace-pre-wrap">
                {news.content}
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  آخر تحديث: {formatDate(news.updated_at)}
                </div>
                {/* <div className="flex items-center gap-4">
                  <button onClick={handleShare} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700">
                    <MessageCircle className="w-4 h-4" />
                    تعليق
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </article>

        {/* الأخبار ذات الصلة */}
        {relatedNews.length > 0 && (
          <section className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              أخبار ذات صلة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedNews.slice(0, 4).map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/news/${relatedItem.id}`)}
                >
                  <div className="relative rounded-lg overflow-hidden mb-3">
                    <img
                      src={relatedItem.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop'}
                      alt={relatedItem.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span 
                        className="px-2 py-1 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: category?.color || '#3B82F6' }}
                      >
                        {relatedItem.news_type_name}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedItem.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {relatedItem.content.substring(0, 100)}...
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {formatDate(relatedItem.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* Modal عرض الصور */}
      {isImageModalOpen && news.images && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img
              src={news.images[selectedImageIndex]?.image_url}
              alt={news.images[selectedImageIndex]?.title || news.title}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => downloadImage(news.images[selectedImageIndex]?.image_url, news.images[selectedImageIndex]?.title)}
              className="absolute bottom-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Download className="w-6 h-6" />
            </button>

            {news.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev - 1 + news.images.length) % news.images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev + 1) % news.images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {news.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;