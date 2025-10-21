"use client";
import { Cairo } from "next/font/google";
import "@/app/styles/globals.css";
import { Provider } from 'react-redux';
import  store  from './store/index'; // تأكد من المسار الصحيح

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} min-h-screen max-h-screen overflow-y-auto`}
      >
        {/* تفعيل Redux Provider */}
        <Provider store={store}>
          {children}
        </Provider>
        
        {/* إذا كنت تحتاج SessionProvider و ProviderAuth، أضفهم هكذا: */}
        {/* 
        <SessionProvider>
          <Provider store={store}>
            <ProviderAuth>{children}</ProviderAuth>
          </Provider>
        </SessionProvider> 
        */}
      </body>
    </html>
  );
}