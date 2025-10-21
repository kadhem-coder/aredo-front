"use client"

import React from 'react';
import Link from 'next/link';
import { Tag, TrendingUp, Eye, Clock, Calendar, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  views: number;
  publishedAt: string;
  category: string;
  categoryColor: string;
}

interface NewsType {
  id: string;
  name: string;
  slug: string;
  color: string;
  news_count: number;
  is_active: boolean;
}

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  trendingNews: NewsItem[];
  categories: NewsType[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  trendingNews, 
  categories 
}) => {

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories Widget */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          أقسام الأخبار
        </h3>
        
        <div className="space-y-3">
          {/* جميع الأقسام */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                : 'hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span className={`font-medium ${
                selectedCategory === 'all' ? 'text-blue-900' : 'text-gray-700'
              }`}>
                جميع الأقسام
              </span>
            </div>
            {selectedCategory === 'all' && (
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {/* التصنيفات */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'shadow-md transform scale-105'
                  : 'hover:bg-gray-50 border border-gray-100'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? `${category.color}15` : undefined,
                borderColor: selectedCategory === category.id ? category.color : undefined
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                <span className={`font-medium ${
                  selectedCategory === category.id ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">({category.news_count})</span>
                {selectedCategory === category.id && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Widget */}
      {trendingNews.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            الأكثر قراءة
          </h3>
          <div className="space-y-4">
            {trendingNews
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((news, index) => (
                <Link 
                  key={news.id} 
                  href={`/news/${news.id}`}
                  className="flex items-start gap-3 group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {news.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* تحديثات سريعة */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md p-6 border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          تحديثات سريعة
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-white/70 backdrop-blur rounded-lg border-r-4 border-blue-500">
            <div className="text-sm font-medium text-blue-900">أخبار عاجلة</div>
            <div className="text-xs text-blue-700 mt-1">آخر التطورات والأحداث المهمة</div>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-lg border-r-4 border-green-500">
            <div className="text-sm font-medium text-green-900">تقارير خاصة</div>
            <div className="text-xs text-green-700 mt-1">تحليلات وتقارير متعمقة</div>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-lg border-r-4 border-purple-500">
            <div className="text-sm font-medium text-purple-900">متابعات حصرية</div>
            <div className="text-xs text-purple-700 mt-1">مواضيع خاصة ومتابعات</div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="text-center">
          <Newspaper className="w-8 h-8 mx-auto mb-3 text-blue-100" />
          <h3 className="text-lg font-bold mb-2">اشترك في النشرة الإخبارية</h3>
          <p className="text-blue-100 text-sm mb-4">احصل على آخر الأخبار مباشرة في بريدك الإلكتروني</p>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="w-full px-4 py-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-white focus:ring-opacity-50 border-0"
          />
          <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            اشترك الآن
          </button>
        </div>
      </div>

      {/* معلومات الموقع */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600" />
          معلومات الموقع
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">آخر تحديث:</span>
            <span className="font-medium text-gray-900">منذ دقائق</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المحررون:</span>
            <span className="font-medium text-gray-900">24/7</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">التغطية:</span>
            <span className="font-medium text-gray-900">شاملة</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">التصنيفات:</span>
            <span className="font-medium text-gray-900">{categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;