"use client";

import { useState } from "react";
import AppSidebar from "@/components/layouts/app-sidebar";
import AppHeader from "@/components/layouts/app-header";
import AppFooter from "@/components/layouts/app-footer";
import { useSession } from "next-auth/react";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { data: session, status } = useSession();
  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden gap-3 p-3 gradient-bg">
      {session?.user?.user?.is_staff ? (
        <>
          <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-3 flex-1 min-h-screen max-h-screen overflow-hidden">
        <AppHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 max-h-[calc(100vh-140px)] border border-border/30 z-0 rounded-2xl overflow-y-auto bg-card/60 backdrop-blur-sm shadow-2xl">
          <div className="h-full">{children}</div>
        </main>
        {session?.user?.user?.is_staff ? (
          <>
            <AppFooter />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
