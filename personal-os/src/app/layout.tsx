import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { DatabaseInitializer } from "@/components/layout/DatabaseInitializer";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal OS",
  description: "Your personal operating system for intentional living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${publicSans.variable} font-[family-name:var(--font-display)] antialiased bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark`}>
        <ThemeProvider>
          <DatabaseInitializer />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-16 md:pb-0">
              <TopBar />
              {children}
            </main>
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
