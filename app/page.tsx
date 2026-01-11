"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSelectedImage(e.target?.result as string);
        splitImageIntoFour(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const splitImageIntoFour = (img: HTMLImageElement) => {
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

      splits.push(canvas.toDataURL("image/png"));
    }

    setSplitImages(splits);
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.download = `split-${index + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    splitImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img, index), index * 100);
    });
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          画像4分割ツール
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          X（Twitter）の縦長投稿用に画像を4分割します
        </p>

        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-20 text-center transition-all ${
              isDragging
                ? "border-gray-400 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-gray-900 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-300 font-medium underline decoration-gray-300 underline-offset-2"
                >
                  ファイルを選択
                </label>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  またはドラッグ&ドロップ
                </span>
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
              <p className="text-sm text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF など
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                分割結果（上から順番）
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {splitImages.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        src={img}
                        alt={`分割 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => downloadImage(img, index)}
                      className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      {index + 1}枚目をDL
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadAll}
                className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-3 px-6 rounded font-medium transition-colors"
              >
                全てダウンロード
              </button>
              <button
                onClick={reset}
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 py-3 px-6 rounded font-medium transition-colors border border-gray-300 dark:border-gray-600"
              >
                リセット
              </button>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>
            データはブラウザ上でのみ処理され、サーバーには保存されません
          </p>
        </footer>
      </div>
    </div>
  );
}
