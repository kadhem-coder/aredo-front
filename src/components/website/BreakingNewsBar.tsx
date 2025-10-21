import React, { useEffect, useState } from 'react'

 const BreakingNewsBar = ({breakingNews}: {breakingNews:any}) => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    // تغيير الخبر كل 4 ثوان
    useEffect(() => {
      if (breakingNews.length > 0) {
        const interval = setInterval(() => {
          setCurrentNewsIndex((prev) => (prev + 1) % breakingNews.length);
        }, 4000);

        return () => clearInterval(interval);
      }
    }, [breakingNews.length]);

    if (breakingNews.length === 0) {
      return (
        <div className="bg-red-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-4">
                عاجل
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-pulse">
                  <span className="text-sm">
                    جاري تحميل آخر الأخبار العاجلة...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-600 text-white py-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-4 flex-shrink-0">
              عاجل
            </span>
            <div className="flex-1 overflow-hidden relative">
              <div className="whitespace-nowrap">
                {breakingNews.map((newsItem:any, index:any) => (
                  <span
                    key={newsItem.id}
                    className={`inline-block transition-all duration-500 text-sm cursor-pointer hover:text-yellow-200 ${
                      index === currentNewsIndex
                        ? "opacity-100 transform translate-x-0"
                        : "opacity-0 absolute transform translate-x-full"
                    }`}
                    onClick={() =>
                      window.open(`/news/${newsItem.id}`, "_blank")
                    }
                  >
                    {/* رقم الخبر */}
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs ml-2">
                      {index + 1}
                    </span>
                    {newsItem.title}

                    {/* تاريخ الخبر */}
                    <span className="text-white/80 text-xs ml-3">
                      •{" "}
                      {new Date(newsItem.created_at).toLocaleDateString(
                        "ar-SA"
                      )}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* مؤشر التقدم */}
            <div className="flex-shrink-0 ml-4 flex items-center gap-1">
              <span className="text-xs text-white/80">
                {currentNewsIndex + 1}/{breakingNews.length}
              </span>
              <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-4000 ease-linear"
                  style={{
                    width: `${
                      ((currentNewsIndex + 1) / breakingNews.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* خط متحرك في الأسفل */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
          <div
            className="h-full bg-white transition-all duration-4000 ease-linear"
            style={{
              width: `${((currentNewsIndex + 1) / breakingNews.length) * 100}%`,
            }}
          />
        </div>
      </div>
    );
  };

export default BreakingNewsBar