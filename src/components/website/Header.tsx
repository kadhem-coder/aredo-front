"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Newspaper,
  Menu,
  X,
  FileText,
  University,
  Globe,
  Clock,
  ChevronDown,
  Settings,
  TableOfContents,
} from "lucide-react";
import { useGetActiveNewsTypesQuery } from "@/services/newstype";

interface Category {
  id: string;
  name: string;
  color: string;
  news_count: number;
}

interface HeaderWebsiteProps {
  categories: Category[];
  scrollToSection?: (sectionId: string) => void;
}

const HeaderWebsite = ({ categories, scrollToSection }: HeaderWebsiteProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  // تحديد الصفحة النشطة بناءً على المسار الحالي
  useEffect(() => {
    setActiveSection(pathname);
  }, [pathname]);

  const handleFormsAccess = () => {
    router.push("/forms");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setActiveSection(path);
  };

  const handleCategoryClick = (categoryId: string) => {
    // التوجيه إلى صفحة القسم
    router.push(`/news/category/${categoryId}`);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  // دوال التحقق من النشاط
  const isActive = (path: string) => activeSection === path;
  const isCategoryActive = (categoryId: string) => {
    // التحقق إذا كنا في صفحة القسم
    return pathname === `/news/category/${categoryId}`;
  };

  // تقسيم التصنيفات إلى الرئيسية والمزيد
  const mainCategories = categories.slice(0, 3);
  const moreCategories = categories.slice(3);

  // كلاسات CSS للنشاط
  const activeClass = "text-blue-600 bg-blue-50 border-blue-200";
  const inactiveClass = "text-gray-700 hover:text-blue-600 hover:bg-blue-50";
  
  const activeBorderClass = "w-full h-0.5 bg-blue-600";
  const inactiveBorderClass = "w-0 h-0.5 bg-blue-600 group-hover:w-full";

  return (
    <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* الشعار */}
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={() => handleNavigation("/")}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                منصة اريدو
              </h1>
            </div>
          </div>

          {/* شريط التنقل */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* الأقسام الرئيسية */}
            <button
              onClick={() => handleNavigation("/")}
              className={`transition-all font-medium flex items-center gap-2 px-4 py-2 rounded-lg group relative border ${
                isActive("/") ? activeClass : inactiveClass
              } ${isActive("/") ? "border-blue-200" : "border-transparent"}`}
            >
              <Globe className="w-4 h-4" />
              الرئيسية
              <span className={`absolute -bottom-1 left-0 transition-all duration-300 ${
                isActive("/") ? activeBorderClass : inactiveBorderClass
              }`}></span>
            </button>

            <button
              onClick={() => handleNavigation("/universities")}
              className={`transition-all font-medium flex items-center gap-2 px-4 py-2 rounded-lg group relative border ${
                isActive("/universities") ? activeClass : inactiveClass
              } ${isActive("/universities") ? "border-blue-200" : "border-transparent"}`}
            >
              <University className="w-4 h-4" />
              الجامعات
              <span className={`absolute -bottom-1 left-0 transition-all duration-300 ${
                isActive("/universities") ? activeBorderClass : inactiveBorderClass
              }`}></span>
            </button>

            <button
              onClick={() => handleNavigation("/forms")}
              className={`transition-all font-medium flex items-center gap-2 px-4 py-2 rounded-lg group relative border ${
                isActive("/forms") ? activeClass : inactiveClass
              } ${isActive("/forms") ? "border-blue-200" : "border-transparent"}`}
            >
              <TableOfContents className="w-4 h-4" />
              الاستمارات
              <span className={`absolute -bottom-1 left-0 transition-all duration-300 ${
                isActive("/forms") ? activeBorderClass : inactiveBorderClass
              }`}></span>
            </button>

            {/* تصنيفات الأخبار الرئيسية */}
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`transition-all font-medium flex items-center gap-2 px-4 py-2 rounded-lg group relative border ${
                  isCategoryActive(category.id) ? activeClass : inactiveClass
                } ${isCategoryActive(category.id) ? "border-blue-200" : "border-transparent"}`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                <span className={`absolute -bottom-1 left-0 transition-all duration-300 ${
                  isCategoryActive(category.id) ? activeBorderClass : inactiveBorderClass
                }`}></span>
              </button>
            ))}

            {/* قائمة المزيد */}
            {moreCategories.length > 0 && (
              <div 
                className="relative group"
                onMouseEnter={() => setIsMoreMenuOpen(true)}
                onMouseLeave={() => setIsMoreMenuOpen(false)}
              >
                <button className={`transition-all font-medium px-4 py-2 rounded-lg flex items-center gap-2 group relative border ${
                  moreCategories.some(cat => isCategoryActive(cat.id)) ? activeClass : inactiveClass
                } ${moreCategories.some(cat => isCategoryActive(cat.id)) ? "border-blue-200" : "border-transparent"}`}>
                  المزيد
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  <span className={`absolute -bottom-1 left-0 transition-all duration-300 ${
                    moreCategories.some(cat => isCategoryActive(cat.id)) ? activeBorderClass : inactiveBorderClass
                  }`}></span>
                </button>
                <div className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 z-50 ${
                  isMoreMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}>
                  <div className="py-2 max-h-80 overflow-y-auto">
                    {moreCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0 ${
                          isCategoryActive(category.id) 
                            ? "text-blue-600 bg-blue-50 font-medium" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="flex-1">{category.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isCategoryActive(category.id)
                            ? "text-blue-600 bg-blue-100"
                            : "text-gray-500 bg-gray-100"
                        }`}>
                          {category.news_count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* الأزرار الجانبية */}
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => handleNavigation("/dashboard")}
              className={`bg-gradient-to-r text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg transform hover:scale-105 ${
                isActive("/dashboard")
                  ? "from-purple-700 to-blue-700 shadow-xl scale-105"
                  : "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
              }`}
            >
              <Settings className="w-4 h-4" />
              لوحة التحكم
            </button> */}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <button
                onClick={() => handleNavigation("/")}
                className={`w-full text-right px-4 py-3 flex items-center gap-3 rounded-lg border-b border-gray-100 transition-colors ${
                  isActive("/") 
                    ? "text-blue-600 bg-blue-50 font-medium border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                الرئيسية
                {isActive("/") && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>
                )}
              </button>

              <button
                onClick={() => handleNavigation("/universities")}
                className={`w-full text-right px-4 py-3 flex items-center gap-3 rounded-lg border-b border-gray-100 transition-colors ${
                  isActive("/universities") 
                    ? "text-blue-600 bg-blue-50 font-medium border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <University className="w-4 h-4" />
                الجامعات
                {isActive("/universities") && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>
                )}
              </button>

              <button
                onClick={() => handleNavigation("/forms")}
                className={`w-full text-right px-4 py-3 flex items-center gap-3 rounded-lg border-b border-gray-100 transition-colors ${
                  isActive("/forms") 
                    ? "text-blue-600 bg-blue-50 font-medium border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TableOfContents className="w-4 h-4" />
                الاستمارات
                {isActive("/forms") && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>
                )}
              </button>

              {/* تصنيفات الأخبار في القائمة المحمولة */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="px-4 py-2 text-xs text-gray-500 font-semibold">
                  أقسام الأخبار
                </div>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-right px-4 py-3 flex items-center gap-3 rounded-lg border-b border-gray-100 last:border-b-0 transition-colors ${
                      isCategoryActive(category.id)
                        ? "text-blue-600 bg-blue-50 font-medium border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCategoryActive(category.id)
                        ? "text-blue-600 bg-blue-100"
                        : "text-gray-500 bg-gray-100"
                    }`}>
                      {category.news_count}
                    </span>
                    {isCategoryActive(category.id) && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderWebsite;