import { Globe, University } from "lucide-react";
import React from "react";

const FooterWebsite = ({categories , scrollToSection}:{categories:any , scrollToSection:any}) => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">منصة اريدو</h3>
                <p className="text-gray-400">بوابتك الشاملة للتعليم والأخبار</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              منصة متكاملة تقدم آخر الأخبار والتطورات في المجال التعليمي، مع
              دليل شامل للجامعات والكليات والتخصصات لتسهيل رحلة الطلاب
              التعليمية.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              الأقسام التعليمية
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => window.open("/universities", "_blank")}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <University className="w-4 h-4" />
                  الجامعات
                </button>
              </li>
           
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              أقسام الأخبار
            </h4>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((category:any) => (
                <li key={category.id}>
                  <button
                    onClick={() => scrollToSection(category.id)}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© منصة اريدو. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterWebsite;
