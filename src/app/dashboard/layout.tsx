import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Providers } from "../providers";
import ProviderAuth from "@/components/Provider/Provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "منصة أريدو - الحلول الرقمية المتكاملة",
  description: "منصة أريدو الرائدة في توفير الحلول الرقمية المتكاملة والمبتكرة للشركات والمؤسسات",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${cairo.className} min-h-screen max-h-screen overflow-y-auto`}
    >
      <Providers>
        <ProviderAuth>{children}</ProviderAuth>
      </Providers>
    </div>
  );
}