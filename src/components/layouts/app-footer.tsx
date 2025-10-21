"use client";

const AppFooter = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-md border-t border-blue-200/20 px-4 py-3 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between text-center text-sm text-blue-200">
        <p>© {new Date().getFullYear()} منصة <span className="text-white font-semibold">أريدو</span>. جميع الحقوق محفوظة.</p>
        <p className="mt-2 md:mt-0">الإصدار <span className="text-white font-medium">1.0</span></p>
      </div>
    </footer>
  );
};

export default AppFooter;
