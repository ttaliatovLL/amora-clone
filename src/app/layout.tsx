import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/toaster";
import { CookieBanner } from "@/components/cookie-banner";

// Self-hosted from Fontshare (ITF Free Font License: free commercial use, do not redistribute the files on their own).
const panchang = localFont({
  variable: "--font-panchang",
  display: "swap",
  src: [
    { path: "./fonts/panchang-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/panchang-700.woff2", weight: "700", style: "normal" },
  ],
});
const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "./fonts/switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/switzer-600.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Amora",
  description: "Handcrafted AI companions. Private, discreet, yours.",
  appleWebApp: { capable: true, title: "Amora", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${panchang.variable} ${switzer.variable} h-full antialiased`}>
      <head>
        {/* Sets data-age-ok before paint so returning visitors never see the gate flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(document.cookie.includes("amora_age=1"))document.documentElement.dataset.ageOk=""}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
