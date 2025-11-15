import type { NextConfig } from "next";

// إعداد التكوين الخاص بـ Next.js
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // تجاهل أخطاء ESLint أثناء عملية البناء
  },
};

export default nextConfig;
