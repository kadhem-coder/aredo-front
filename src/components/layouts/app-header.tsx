"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  User, 
  LogOut, 
  Menu,
  Settings,
  ChevronDown,
  X
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const AppHeader = ({ onToggleSidebar }: HeaderProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSignOut = async () => {
  try {
    // مسح localStorage
    localStorage.clear();
    
    // مسح sessionStorage
    sessionStorage.clear();
    
    // مسح أي cookies إضافية
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // تسجيل الخروج من NextAuth
    await signOut({ 
      redirect: false
    });

    // التحويل للصفحة الرئيسية
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://aredo.org/';
    window.location.href = websiteUrl;
    
  } catch (error) {
    console.error('Error during sign out:', error);
    window.location.href = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://aredo.org/';
  }
};
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 relative z-50 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* الجانب الأيسر - زر القائمة والشعار */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* عنوان الصفحة للموبايل */}
          {/* <div className="md:hidden">
            <h1 className="text-gray-800 font-semibold text-lg">لوحة التحكم</h1>
          </div> */}
        </div>

        {/* الجانب الأيمن - الإشعارات وقائمة المستخدم */}
        <div className="flex items-center gap-2">
          
        

          {/* قائمة المستخدم */}
          <div className="relative " ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 min-w-0"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-right min-w-0 max-w-32">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {session?.user?.user?.username || 'المستخدم'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.user?.phone_number || ''}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 hidden sm:block transition-transform duration-200 flex-shrink-0" />
            </button>

            {/* قائمة المستخدم المنسدلة */}
            {showUserMenu && (
              <div className="absolute left-0 top-full mt-2 w-64  rounded-2xl shadow-2xl border border-gray-200 z-[9999] bg-white">
                {/* معلومات المستخدم */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-gray-800 font-semibold truncate">
                        {session?.user?.user?.username || 'المستخدم'}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {session?.user?.user?.phone_number || ''}
                      </p>
                      {/* {session?.user?.user?.is_staff && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                          موظف
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>

                {/* خيارات القائمة */}
          
                {/* زر تسجيل الخروج */}
                <div className=" py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 text-right hover:bg-red-50 transition-colors text-red-600 rounded-lg mx-2"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;