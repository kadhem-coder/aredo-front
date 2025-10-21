"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FileText,
  GraduationCap,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Globe,
  Newspaper,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AppSidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  console.log(session?.user?.user?.is_superuser)
  const menuItems = [
    {
      id: "dashboard",
      title: "الرئيسية",
      icon: Home,
      href: "/dashboard",
    },
    {
      id: "countries",
      title: "الدول",
      icon: Globe,
      href: "/dashboard/countries",
      children: [
        { title: "قائمة الدول", href: "/dashboard/countries" },
        {
          title: "إضافة دولة جديدة",
          href: "/dashboard/countries/createOrUpdate",
        },
      ],
    },
    {
      id: "forms",
      title: "الاستمارات",
      icon: FileText,
      href: "/forms",
      children: [
        { title: "الاستمارات", href: "/dashboard/forms" },
        ...(session?.user?.user?.is_superuser 
          ? [{ title: "انواع الاستمارات", href: "/dashboard/forms/formkinds" }]
          : []
        )
      ],
    },
    {
      id: "universities",
      title: "الجامعات",
      icon: GraduationCap,
      href: "/universities",
      children: [
        { title: "قائمة الجامعات", href: "/dashboard/universities" },
        { title: "إضافة جامعة", href: "/dashboard/universities/createOrUpdate" },
      ],
    },
    {
      id: "news",
      title: "الأخبار",
      icon: Newspaper, // أو FileText أو أي أيقونة مناسبة للأخبار
      href: "/news",
      children: [
        { title: "قائمة الأخبار", href: "/dashboard/news" },
        { title: "إضافة خبر", href: "/dashboard/news/createOrUpdate" },
        { title: "تصنيفات الأخبار", href: "/dashboard/newstypes" },
        { title: "إضافة تصنيف", href: "/dashboard/newstypes/createOrUpdate" },
      ],
    },
    // {
    //   id: "settings",
    //   title: "الإعدادات",
    //   icon: Settings,
    //   href: "/settings",
    //   children: [
    //     { title: "الإعدادات العامة", href: "/settings/general" },
    //     { title: "إعدادات الحساب", href: "/settings/account" },
    //     { title: "الأمان والخصوصية", href: "/settings/security" },
    //   ],
    // },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    // إغلاق السايدبار في الموبايل بعد التنقل
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* خلفية مظلمة للموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* السايد بار */}
      <div
        className={`
        fixed md:relative
        top-0 right-0
        h-screen w-72
        bg-card/90 backdrop-blur-md
        border-l border-border/30
        transform transition-transform duration-300 ease-in-out
        z-50 rounded-2xl shadow-2xl
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        ${!isOpen && "md:w-16"}
      `}
      >
        {/* هيدر السايد بار */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div
            className={`flex items-center space-x-3 space-x-reverse transition-all duration-300 ${
              !isOpen && "md:justify-center"
            }`}
          >
            <div className="gradient-primary p-2 rounded-xl shadow-lg pulse-glow">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            {(isOpen || window.innerWidth < 768) && (
              <div>
                <h2 className="text-gradient font-bold text-lg">أريدو</h2>
                <p className="text-muted-foreground text-xs">
                  منصة الحلول الرقمية
                </p>
              </div>
            )}
          </div>

          {/* زر الإغلاق للموبايل */}
          <button
            onClick={onToggle}
            className="md:hidden p-2 rounded-xl hover:bg-accent/50 transition-all duration-300 ripple-effect"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* قائمة التنقل */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedSection === item.id;
            const isActive = isActiveRoute(item.href);

            return (
              <div key={item.id} className="space-y-1">
                {/* العنصر الرئيسي */}
                <button
                  onClick={() =>
                    hasChildren
                      ? toggleSection(item.id)
                      : handleNavigation(item.href)
                  }
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-3 rounded-xl
                    text-foreground hover:bg-accent/40
                    transition-all duration-300
                    group ripple-effect
                    ${!isOpen && "md:justify-center md:px-2"}
                    ${isExpanded ? "bg-accent/30" : ""}
                    ${isActive ? "bg-primary/10 text-primary" : ""}
                  `}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 group-hover:text-primary-solid transition-colors ${
                        isActive ? "text-primary" : ""
                      }`}
                    />
                    {(isOpen || window.innerWidth < 768) && (
                      <span
                        className={`font-medium group-hover:text-primary-solid transition-colors ${
                          isActive ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {item.title}
                      </span>
                    )}
                  </div>

                  {hasChildren && (isOpen || window.innerWidth < 768) && (
                    <div className="transition-transform duration-300">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-primary-solid" />
                      ) : (
                        <ChevronRight className="h-4 w-4 group-hover:text-primary-solid" />
                      )}
                    </div>
                  )}
                </button>

                {/* العناصر الفرعية */}
                {hasChildren &&
                  isExpanded &&
                  (isOpen || window.innerWidth < 768) && (
                    <div className="mr-8 space-y-1">
                      {item.children?.map((child, index) => {
                        const isChildActive = isActiveRoute(child.href);
                        return (
                          <button
                            key={index}
                            onClick={() => handleNavigation(child.href)}
                            className={`
                            w-full text-right px-3 py-2 rounded-xl
                            text-muted-foreground hover:text-primary-solid hover:bg-accent/30
                            transition-all duration-300 text-sm ripple-effect
                            ${
                              isChildActive
                                ? "bg-primary/10 text-primary font-medium"
                                : ""
                            }
                          `}
                          >
                            {child.title}
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* تلميح للعناصر المطوية */}
                {!isOpen && hasChildren && (
                  <div className="hidden md:block absolute right-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-card border border-border/50 rounded-xl p-3 shadow-2xl min-w-48 backdrop-blur-sm">
                      <div className="font-semibold mb-2 text-foreground">
                        {item.title}
                      </div>
                      {item.children?.map((child, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(child.href)}
                          className="block w-full text-right px-2 py-1 hover:bg-accent/30 rounded-lg text-sm text-muted-foreground hover:text-primary-solid transition-colors"
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* فوتر السايد بار */}
        <div className="absolute bottom-4 left-4 right-4">
          {(isOpen || window.innerWidth < 768) && (
            <div className="glass-effect rounded-xl p-3 text-center border border-border/30">
              <p className="text-muted-foreground text-xs">منصة أريدو</p>
              <p className="text-primary-solid text-xs font-medium">
                الإصدار 1.0
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
