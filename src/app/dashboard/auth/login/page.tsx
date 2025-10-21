"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSigninMutation } from "@/services/auth";
import { signIn, useSession } from "next-auth/react";
import { Eye, EyeOff, Phone, Lock, ArrowRight } from "lucide-react";
import { CustomUser, UserInfo } from "@/app/api/auth/[...nextauth]/route";

type LoginForm = {
  phone_number: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<LoginForm>({
    phone_number: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [signin, { isLoading }] = useSigninMutation();

  // فحص حالة تسجيل الدخول وتوجيه المستخدم بناءً على الصلاحيات
  useEffect(() => {
    if (status === "authenticated" && session) {
      const user = session.user as CustomUser;
      
      // التحقق إذا كان المستخدم ليس staff ولا superuser
      if (!user.user.is_staff && !user.user.is_superuser) {
        router.push('/forms');
      } else {
        // إذا كان staff أو superuser، توجيه إلى dashboard
        router.push('/dashboard');
      }
    }
  }, [session, status, router]);

  const handleSubmit = async () => {
    if (!formData.phone_number || !formData.password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setError("");

    try {
      const response = await signin({
        phone_number: formData.phone_number,
        password: formData.password
      }).unwrap();

      const apiData = response as any;

      if (!apiData || !apiData.access || !apiData.user) {
        setError("خطأ في استجابة الخادم");
        return;
      }

      const userForAuth: CustomUser = {
        refresh: "", 
        access: apiData.access,
        user: {
          id: apiData.user.id,
          username: apiData.user.username,
          phone_number: apiData.user.phone_number,
          is_superuser: apiData.user.is_superuser,
          is_staff: apiData.user.is_staff
        }
      };

      const authResult = await signIn("credentials", {
        data: JSON.stringify(userForAuth),
        redirect: false,
        callbackUrl: `${window.location.origin}/dashboard`,
      });

      if (authResult?.ok) {
        // بعد تسجيل الدخول الناجح، سيتم التوجيه في useEffect بناءً على الصلاحيات
        console.log('تم تسجيل الدخول بنجاح، جاري التوجيه بناءً على الصلاحيات...');
      } else {
        setError("فشل في تسجيل الدخول");
      }

    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      if (error?.status === 401) {
        setError("رقم الهاتف أو كلمة المرور غير صحيحة");
      } else if (error?.status === 400) {
        setError("البيانات المدخلة غير صحيحة");
      } else if (error?.status === 500) {
        setError("خطأ في الخادم، يرجى المحاولة لاحقاً");
      } else if (error?.data?.message) {
        setError(error.data.message);
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول");
      }
    }
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  // عرض شاشة تحميل أثناء فحص حالة الجلسة
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحقق من حالة تسجيل الدخول...</p>
          </div>
        </div>
      </div>
    );
  }

  // عدم عرض صفحة تسجيل الدخول إذا كان المستخدم مسجل دخوله
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري توجيهك إلى الصفحة المناسبة...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h1>
            <p className="text-gray-600">أدخل رقم هاتفك وكلمة المرور للدخول</p>
          </div>

          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="07XXXXXXXXX"
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="أدخل كلمة المرور"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                disabled={isLoading}
              >
                نسيت كلمة المرور؟
              </button>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="mr-2 block text-sm text-gray-700">
                  تذكرني
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </button>

          </div>

          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">أو</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
            <button 
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
              disabled={isLoading}
            >
              إنشاء حساب جديد
            </button>
          </div>

        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-300 opacity-75">
            © 2025 جميع الحقوق محفوظة
          </p>
        </div>

      </div>
    </div>
  );
}