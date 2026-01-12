"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageType, setImageType] = useState<string>("image/png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setImageType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSelectedImage(e.target?.result as string);
        splitImageIntoFour(img, file.type);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const splitImageIntoFour = (img: HTMLImageElement, mimeType: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = img.width;
    const height = img.height;
    const quarterHeight = height / 4;

    const splits: string[] = [];

    for (let i = 0; i < 4; i++) {
      canvas.width = width;
      canvas.height = quarterHeight;

      ctx.drawImage(
        img,
        0,
        i * quarterHeight,
        width,
        quarterHeight,
        0,
        0,
        width,
        quarterHeight
      );

      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        splits.push(canvas.toDataURL("image/jpeg", 1.0));
      } else {
        splits.push(canvas.toDataURL(mimeType));
      }
    }

    setSplitImages(splits);
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const getFileExtension = () => {
    if (imageType === "image/jpeg" || imageType === "image/jpg") {
      return "jpg";
    } else if (imageType === "image/png") {
      return "png";
    } else if (imageType === "image/webp") {
      return "webp";
    }
    return "png";
  };

  const shareImage = async (dataUrl: string, index: number) => {
    if (navigator.share && navigator.canShare) {
      try {
        const blob = dataURLtoBlob(dataUrl);
        const ext = getFileExtension();
        const file = new File([blob], `split-${index + 1}.${ext}`, {
          type: imageType,
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `分割画像 ${index + 1}`,
          });
        } else {
          downloadImage(dataUrl, index);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          downloadImage(dataUrl, index);
        }
      }
    } else {
      downloadImage(dataUrl, index);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    const ext = getFileExtension();
    link.download = `split-${index + 1}.${ext}`;
    link.href = dataUrl;
    link.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const reset = () => {
    setSelectedImage(null);
    setSplitImages([]);
    setImageType("image/png");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/logo.png"
              alt=""
              className="w-10 h-10"
            />
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
              画像4分割ツール
            </h1>
          </div>
          <p className="text-[var(--text-muted)]">
            X（Twitter）の縦長投稿用に画像を4分割します
          </p>
        </header>

        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border border-dashed p-24 text-center transition-colors ${
              isDragging
                ? "border-[var(--text)] bg-[var(--bg-subtle)]"
                : "border-[var(--border)]"
            }`}
          >
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-[var(--text-muted)]"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[var(--text-muted)]">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-[var(--text)] underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--text)]"
                >
                  ファイルを選択
                </label>
                <span> またはドラッグ&ドロップ</span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
              <p className="text-sm text-[var(--text-muted)]">PNG, JPG など</p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <h2 className="text-xl font-medium text-[var(--text)] mb-8">
                分割結果
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                上から順番に投稿してください
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {splitImages.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div className="relative aspect-square border border-[var(--border)] overflow-hidden">
                      <img
                        src={img}
                        alt={`分割 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => shareImage(img, index)}
                      className="w-full bg-[var(--text)] text-[var(--bg)] py-2 px-4 text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                      {index + 1}枚目を保存
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end gap-4">
              <button
                onClick={reset}
                className="border border-[var(--border)] text-[var(--text)] py-2 px-4 text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors"
              >
                リセット
              </button>
              <button
                onClick={async () => {
                  for (let i = 0; i < splitImages.length; i++) {
                    downloadImage(splitImages[i], i);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                  }
                }}
                className="bg-[var(--text)] text-[var(--bg)] py-2 px-4 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                全て保存
              </button>
            </div>

            <section className="border-t border-[var(--border)] pt-12">
              <h3 className="text-sm font-medium text-[var(--text)] mb-4">
                iPhoneで写真アプリに保存する方法
              </h3>
              <ol className="text-sm text-[var(--text-muted)] space-y-2">
                <li>1. 各画像の「保存」ボタンを1枚ずつタップ</li>
                <li>2. シェアシート（共有メニュー）が表示される</li>
                <li>3. 「画像を保存」または「"写真"に追加」をタップ</li>
                <li>4. 写真アプリに保存されます</li>
              </ol>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                iPhoneでは「全て保存」は使えません。1枚ずつ保存してください。
                PCやAndroidでは「全て保存」で一括ダウンロードできます。
              </p>
            </section>
          </div>
        )}

        <footer className="mt-24 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            データはブラウザ上でのみ処理され、サーバーには保存されません
          </p>
        </footer>
      </div>
    </div>
  );
}
