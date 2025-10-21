"use client"

import React from 'react';
import Link from 'next/link';
import { Clock, Eye, Share2, ChevronRight, Heart, MessageCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  categorySlug: string;
  publishedAt: string;
  views: number;
  image: string;
  featured?: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  likes?: number;
  comments?: number;
}

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, variant = 'default' }) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} يوم`;
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/news/${news.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackCopy(shareUrl);
      }
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('تم نسخ الرابط');
    } else {
      // fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ الرابط');
    }
  };

  if (variant === 'compact') {
    return (
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/category/${news.categorySlug}`}
                className="px-2 py-1 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
                style={{ backgroundColor: news.categoryColor }}
              >
                {news.category}
              </Link>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(news.publishedAt)}
              </span>
            </div>
            <Link href={`/news/${news.id}`}>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                {news.title}
              </h3>
            </Link>
           
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
            }}
          />
          <div className="absolute top-4 right-4">
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: news.categoryColor }}
            >
              {news.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(news.publishedAt)}
            </span>
            {news.author && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 text-sm">{news.author.name}</span>
              </>
            )}
          </div>
          <Link href={`/news/${news.id}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {news.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <Link 
              href={`/news/${news.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              اقرأ المزيد
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop';
          }}
        />
        {/* Badge للتصنيف */}
        <div className="absolute top-3 right-3">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: news.categoryColor }}
          >
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(news.publishedAt)}
          </span>
          {news.author && (
            <>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-gray-500 text-xs">{news.author.name}</span>
            </>
          )}
        </div>
        <Link href={`/news/${news.id}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {news.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <Link 
            href={`/news/${news.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            اقرأ المزيد
            <ChevronRight className="w-3 h-3" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {news.views.toLocaleString()}
              </span>
              {news.likes && (
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <Heart className="w-3 h-3" />
                  {news.likes}
                </button>
              )}
            </div>
            <button 
              onClick={handleShare}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="مشاركة"
            >
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;