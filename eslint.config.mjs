import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// تحديد اسم الملف والدليل
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// إعداد `FlatCompat` باستخدام الدليل الأساسي
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// تحميل القواعد الأساسية الخاصة بـ Next.js و TypeScript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // تعطيل قاعدة "no-unused-vars"
      "@typescript-eslint/no-unused-vars": "off", // يمكن استبدال "off" بـ "warn" أو "error"
      
      // تعطيل قاعدة "no-explicit-any"
      "@typescript-eslint/no-explicit-any": "off", // يمكن استبدال "off" بـ "warn" أو "error"

      // تعطيل قواعد أخرى حسب الحاجة
      "react/no-unescaped-entities": "off", // تعطيل تحذير علامات الاقتباس غير المحمية
      "next/no-img-element": "off", // تعطيل تحذير استخدام <img> بدلاً من <Image> في Next.js
    },
  },
];

export default eslintConfig;
