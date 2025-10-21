import React from "react";
import { Smartphone } from "lucide-react";

const AredoLoader = () => {
  return (
    <div className="fixed inset-0 z-[60] grid place-content-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="flex flex-col items-center justify-center">
        
        {/* شعار بسيط */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* اسم المنصة */}
        <div className="text-center space-y-3">
          <h1 className="text-white text-2xl font-bold">أريدو</h1>
          <p className="text-slate-300 text-sm">جاري التحميل...</p>
          
          {/* مؤشر تحميل بسيط */}
          <div className="flex space-x-1 justify-center mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AredoLoader;