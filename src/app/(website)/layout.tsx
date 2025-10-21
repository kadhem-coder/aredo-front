"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import HeaderWebsite from "@/components/website/Header";
import FooterWebsite from "@/components/website/Footer";
import BreakingNewsBar from "@/components/website/BreakingNewsBar";
import { useGetActiveNewsTypesQuery } from "@/services/newstype";

interface NewsType {
  id: string;
  name: string;
  color: string;
  news_count: number;
}

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // جلب التصنيفات للتخطيط
  const { data: categoriesResponse } = useGetActiveNewsTypesQuery({
    page_size: 20,
    ordering: "name",
  });

  const categories = categoriesResponse?.results || [];

  // مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* شريط الأخبار العاجلة */}
      {/* <BreakingNewsBar /> */}

      {/* الهيدر */}
      <HeaderWebsite categories={categories} scrollToSection={scrollToSection} />
      
      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* زر العودة للأعلى */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-40"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* الفوتر */}
      <FooterWebsite categories={categories} scrollToSection={scrollToSection} />
    </div>
  );
}