import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Когніторіум | Новини ШІ",
  description: "Агрегатор новин штучного інтелекту з провідних світових лабораторій.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" data-theme="light">
      <body className={`${dmSans.variable}`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
