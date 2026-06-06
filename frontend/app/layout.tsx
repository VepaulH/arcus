import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "./components/Navbar";
import CookieBanner from "./components/CookieBanner";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcus",
  description: "Your launchpad for building a startup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/8 px-6 py-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span>© {new Date().getFullYear()} Arcus. All rights reserved.</span>
              <div className="flex items-center gap-5">
                <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <Link href="/cookies" className="hover:text-slate-400 transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </footer>
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
