"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "@/services/usersApi";
import { Eye, EyeOff, Phone, Lock, User, ArrowRight } from "lucide-react";

type RegisterForm = {
  name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    phone_number: "",
    password: "",
    confirm_password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async () => {
    // التحقق من الحقول المطلوبة
    if (!formData.name || !formData.phone_number || !formData.password || !formData.confirm_password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    // التحقق من تطابق كلمة المرور
    if (formData.password !== formData.confirm_password) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    // التحقق من صيغة رقم الهاتف
    setError("");

    try {
      const response = await registerUser({
        name: formData.name,
        phone_number: formData.phone_number,
        password: formData.password,
      }).unwrap();

      // نجاح التسجيل - التوجيه إلى صفحة تسجيل الدخول
      router.push("/dashboard/auth/login");
      
    } catch (error: any) {
      console.error("خطأ في التسجيل:", error);
      
      if (error?.status === 400) {
        setError(error?.data?.message || "البيانات المدخلة غير صحيحة");
      } else if (error?.status === 409) {
        setError("رقم الهاتف أو اسم المستخدم موجود مسبقاً");
      } else if (error?.status === 500) {
        setError("خطأ في الخادم، يرجى المحاولة لاحقاً");
      } else if (error?.data?.message) {
        setError(error.data.message);
      } else {
        setError("حدث خطأ أثناء إنشاء الحساب");
      }
    }
  };

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إنشاء حساب جديد</h1>
            <p className="text-gray-600">أدخل بياناتك لإنشاء حساب جديد</p>
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
            
            {/* اسم المستخدم */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الاسم *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="أدخل الاسم"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* رقم الهاتف */}
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

            {/* كلمة المرور */}
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
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
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

            {/* تأكيد كلمة المرور */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="أعد إدخال كلمة المرور"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* زر التسجيل */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  إنشاء حساب
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
            <span className="text-sm text-gray-600">لديك حساب بالفعل؟ </span>
            <button 
              type="button"
              onClick={() => router.push("/dashboard/auth/login")}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
              disabled={isLoading}
            >
              تسجيل الدخول
            </button>
          </div>

        </div>

       

      </div>
    </div>
  );
}