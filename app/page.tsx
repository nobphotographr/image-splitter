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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          画像4分割ツール
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          X（Twitter）の縦長投稿用に画像を4分割します
        </p>

        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-4 border-dashed rounded-2xl p-16 text-center transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="space-y-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
                  className="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
                >
                  ファイルを選択
                </label>
                <span className="text-gray-500 dark:text-gray-400">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF など
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                分割結果（上から順番）
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {splitImages.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`分割 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => downloadImage(img, index)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      {index + 1}枚目をDL
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={downloadAll}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg"
              >
                全てダウンロード
              </button>
              <button
                onClick={reset}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg"
              >
                リセット
              </button>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            データはブラウザ上でのみ処理され、サーバーには保存されません
          </p>
        </footer>
      </div>
    </div>
  );
}
