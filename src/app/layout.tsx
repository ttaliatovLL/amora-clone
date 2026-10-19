import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted from Fontshare (ITF Free Font License: free commercial use, do not redistribute the files on their own).
const zodiak = localFont({
  variable: "--font-zodiak",
  display: "swap",
  src: [
    { path: "./fonts/zodiak-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/zodiak-300i.woff2", weight: "300", style: "italic" },
    { path: "./fonts/zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/zodiak-400i.woff2", weight: "400", style: "italic" },
  ],
});

const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  src: [
    { path: "./fonts/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/general-sans-600.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Amora",
  description: "Handcrafted AI companions. Private, discreet, yours.",
  appleWebApp: { capable: true, title: "Amora", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a090d",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${zodiak.variable} ${generalSans.variable} h-full antialiased`}>
      <head>
        {/* Sets data-age-ok before paint so returning visitors never see the gate flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(document.cookie.includes("amora_age=1"))document.documentElement.dataset.ageOk=""}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
