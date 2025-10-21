"use client";

import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import Loader from "@/app/loading";

const ProviderAuth = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status, data } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    // تجنب إعادة التوجيه المتكررة
    if (isRedirecting) return;

    // إذا لم يكن مسجل الدخول، توجيه إلى صفحة تسجيل الدخول
    if (status === "unauthenticated") {
      setIsRedirecting(true);
      router.replace("/dashboard/auth/login");
      return;
    }

    if (status === "authenticated" && data?.user) {
      const user = data.user.user as any;
      const isStaff = user.is_staff || user.is_superuser;
      
      // console.log("User info:", {
      //   isStaff,
      //   is_staff: user.is_staff,
      //   is_superuser: user.is_superuser,
      //   pathname,
      //   username: user.username,
      //   data:data
      // });

      // if (isStaff) {
      //   redirect('/dashboard')
      //   // // للـ staff/superuser
      //   // const shouldRedirectToDashboard = (
      //   //   pathname === "/dashboard/auth/login" ||
      //   //   pathname === "/dashboard/auth/register" ||
      //   //   pathname.startsWith("/forms") ||
      //   //   pathname === "/dashboard" // إضافة هذا للتأكد
      //   // );

      //   // if (shouldRedirectToDashboard && pathname !== "/dashboard") {
      //   //   console.log("Redirecting staff to dashboard from:", pathname);
      //   //   setIsRedirecting(true);
      //   //   router.push("/dashboard");
      //   //   setTimeout(() => setIsRedirecting(false), 1000);
      //   //   return;
      //   // }

      // } else {
      //   // للمستخدمين العاديين
      //                   redirect('/forms')

      //   // const allowedPaths = [
      //   //   "/forms",
      //   //   "/dashboard/auth/logout"
      //   // ];
        
      //   // const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));
        
      //   // if (!isAllowedPath) {
      //   //   console.log("Redirecting regular user to user-forms from:", pathname);
      //   //   setIsRedirecting(true);
      //   //   router.push("/forms");
      //   //   setTimeout(() => setIsRedirecting(false), 1000);
      //   //   return;
      //   // }
      // }
    }

    // إذا وصلنا هنا، فلا حاجة لإعادة التوجيه
    setIsRedirecting(false);
  }, [status, data, pathname, router, isRedirecting]);

  // عرض شاشة التحميل أثناء فحص الجلسة أو إعادة التوجيه
  // if (status === "loading" || isRedirecting) {
  //   return <Loader />;
  // }

  return <>{children}</>;
};

export default ProviderAuth;