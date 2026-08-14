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
  metadataBase: new URL("https://xpreview.iruagaru.com"),
  title: "Image Slicer | iruagaru",
  description: "1枚の写真を、つながった3枚または4枚のカルーセル画像へ分割するツールです。",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Image Slicer | iruagaru",
    description: "1枚の写真を、つながった3枚または4枚のカルーセル画像へ分割します。",
    url: "https://xpreview.iruagaru.com/split/",
    siteName: "iruagaru photo tools",
    images: [
      {
        url: "https://xpreview.iruagaru.com/split/og.png?v=20260814-2",
        secureUrl: "https://xpreview.iruagaru.com/split/og.png?v=20260814-2",
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
    title: "Image Slicer | iruagaru",
    description: "1枚の写真を、つながった3枚または4枚のカルーセル画像へ分割します。",
    images: ["https://xpreview.iruagaru.com/split/og.png?v=20260814-2"],
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
