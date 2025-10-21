"use client"

import React from 'react';
import { Search, Tag } from 'lucide-react';

interface NewsType {
  id: string;
  name: string;
  slug: string;
  color: string;
  news_count: number;
  is_active: boolean;
}

interface CategoriesFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: NewsType[];
}

const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الأخبار..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
            {/* زر جميع الأقسام */}
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 min-w-fit ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              جميع الأقسام
            </button>

            {/* التصنيفات من API */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 min-w-fit ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined,
                  borderColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategory === category.id ? 'white' : category.color }}
                />
                {category.name}
                <span className="text-xs opacity-75">({category.news_count})</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* عرض معلومات إضافية */}
        {selectedCategory !== 'all' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {(() => {
              const currentCategory = categories.find(cat => cat.id === selectedCategory);
              if (currentCategory) {
                return (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: currentCategory.color }}
                      />
                      <span className="font-medium text-gray-900">
                        تصفح أخبار قسم: {currentCategory.name}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({currentCategory.news_count} خبر)
                    </span>
                    {searchQuery && (
                      <span className="text-gray-500">
                        • البحث: "{searchQuery}"
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {/* عرض نتائج البحث */}
        {searchQuery && selectedCategory === 'all' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4" />
              <span>نتائج البحث عن: <span className="font-medium text-gray-900 bg-yellow-100 px-2 py-1 rounded">"{searchQuery}"</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesFilter;