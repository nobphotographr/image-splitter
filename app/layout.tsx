import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tools.iruagaru.com"),
  title: "Image Splitter – 写真を2〜4枚のカルーセル画像に分割 | iruagaru",
  description: "1枚の写真を、SNSへ投稿しやすい2〜4枚のつながったカルーセル画像に分割。画像はアップロードせず、ブラウザ内だけで処理します。",
  alternates: { canonical: "/image-splitter/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Image Splitter – 写真を2〜4枚のカルーセル画像に分割 | iruagaru",
    description: "1枚の写真を、SNSへ投稿しやすい2〜4枚のつながったカルーセル画像に分割。画像はブラウザ内だけで処理します。",
    url: "https://tools.iruagaru.com/image-splitter/",
    siteName: "iruagaru photo tools",
    images: [
      {
        url: "https://tools.iruagaru.com/image-splitter/og.png?v=20260814-2",
        secureUrl: "https://tools.iruagaru.com/image-splitter/og.png?v=20260814-2",
        width: 1536,
        height: 1024,
        type: "image/png",
        alt: "IRUAGARU PHOTO TOOLS — PREVIEW / SLICE",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Splitter – 写真を2〜4枚のカルーセル画像に分割 | iruagaru",
    description: "1枚の写真を、SNSへ投稿しやすい2〜4枚のつながったカルーセル画像に分割。画像はブラウザ内だけで処理します。",
    images: ["https://tools.iruagaru.com/image-splitter/og.png?v=20260814-2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
