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
  title: "Image Slicer | iruagaru",
  description: "1枚の写真を、つながった3枚または4枚のカルーセル画像へ分割するツールです。",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Image Slicer | iruagaru",
    description: "1枚の写真を、つながった3枚または4枚のカルーセル画像へ分割します。",
    images: ["https://xpreview.iruagaru.com/split/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://xpreview.iruagaru.com/split/og.png"],
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
