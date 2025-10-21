// "use client";

// import type React from "react";
// import type { Metadata } from "next";
// import { Cairo } from "next/font/google";
// import { useState } from "react";
// import AppSidebar from "@/components/layouts/app-sidebar";
// import AppHeader from "@/components/layouts/app-header";
// import AppFooter from "@/components/layouts/app-footer";

// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   display: "swap",
//   variable: "--font-cairo",
// });

// export const metadata: Metadata = {
//   title: "لوحة التحكم - منصة أريدو",
//   description: "منصة أريدو للحلول الرقمية المتكاملة - نظام إدارة شامل ومتطور",
// };

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // ✅ حالة فتح/إغلاق السايدبار
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   return (
//     <div className={`${cairo.className} min-h-screen max-h-screen overflow-hidden`}>
//       <div className="flex min-h-screen max-h-screen overflow-hidden gap-1 p-2 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        
//         {/* ✅ نمرر props المطلوبة */}
//         <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

//         <div className="flex flex-col gap-1 flex-1 min-h-screen max-h-screen overflow-hidden">
          
//           {/* ✅ نمرر props المطلوبة */}
//           <AppHeader onToggleSidebar={toggleSidebar} />

//           <main className="flex-1 p-6 max-h-[calc(100vh-127px)] border-2 border-blue-200/20 rounded-lg overflow-y-scroll bg-white/10 backdrop-blur-sm shadow-lg">
//             {children}
//           </main>

//           <AppFooter />
//         </div>
//       </div>
//     </div>
//   );
// }



import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import DashboardWrapper from "../_components/dashboard-wrapper";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "لوحة التحكم - منصة أريدو",
  description: "منصة أريدو للحلول الرقمية المتكاملة - نظام إدارة شامل ومتطور",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${cairo.className} min-h-screen max-h-screen  overflow-hidden`}>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}

