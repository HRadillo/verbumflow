// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "VerbumFlow — French Conjugation Practice",
  description:
    "Master French verb conjugations with interactive flashcards. Practice présent, imparfait, futur, passé composé and more.",
  manifest: "/manifest.json",
  themeColor: "#0B1020",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/icon/icon-blue-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/brand/icon/icon-blue-16.png" />
        <link rel="shortcut icon" href="/brand/icon/icon-blue-32.png" />
      </head>
      <body className={cn("font-body antialiased h-full")}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
