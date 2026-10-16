import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Topbar } from "@/components/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naya - Syntesa Knowledge Base System",
  description: "Syntesa Knowledge Base System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-dvh relative flex flex-col items-center justify-center w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden text-gray-900 dark:text-neutral-100">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(139,92,246,0.35),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_90%,rgba(59,130,246,0.2),transparent)]" />

            <Topbar />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
