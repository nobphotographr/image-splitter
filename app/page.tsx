"use client";

/* eslint-disable @next/next/no-img-element -- previews are client-generated data URLs */

import { useCallback, useEffect, useRef, useState } from "react";

type SplitMode = "vertical" | "carousel";
type AspectPreset = "3:4" | "4:5";
type SplitCount = 3 | 4;

const getOutputMimeType = (mimeType: string) => {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return "image/jpeg";
  }
  if (mimeType === "image/webp") {
    return "image/webp";
  }
  return "image/png";
};

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageType, setImageType] = useState<string>("image/png");
  const [splitMode, setSplitMode] = useState<SplitMode>("carousel");
  const [splitCount, setSplitCount] = useState<SplitCount>(4);
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>("3:4");
  const [focusY, setFocusY] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setImageType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const splitImage = useCallback(
    (img: HTMLImageElement, mimeType: string, mode: SplitMode) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = img.width;
      const height = img.height;
      const outputMimeType = getOutputMimeType(mimeType);

      const splits: string[] = [];

      if (mode === "vertical") {
        const sliceHeight = Math.floor(height / splitCount);

        for (let i = 0; i < splitCount; i++) {
          canvas.width = width;
          canvas.height =
            i === splitCount - 1
              ? height - sliceHeight * (splitCount - 1)
              : sliceHeight;

          ctx.drawImage(
            img,
            0,
            i * sliceHeight,
            width,
            canvas.height,
            0,
            0,
            width,
            canvas.height
          );

          splits.push(canvas.toDataURL(outputMimeType, 1.0));
        }
      } else {
        const panelAspect = aspectPreset === "3:4" ? 3 / 4 : 4 / 5;
        const panelHeight = 1600;
        const panelWidth = Math.round(panelHeight * panelAspect);
        const totalWidth = panelWidth * splitCount;

        const scale = Math.max(totalWidth / width, panelHeight / height);
        const sourceWidth = totalWidth / scale;
        const sourceHeight = panelHeight / scale;
        const sourceX = Math.max(0, (width - sourceWidth) / 2);
        const maxSourceY = Math.max(0, height - sourceHeight);
        const sourceY = maxSourceY * (focusY / 100);

        for (let i = 0; i < splitCount; i++) {
          canvas.width = panelWidth;
          canvas.height = panelHeight;

          ctx.drawImage(
            img,
            sourceX + (sourceWidth / splitCount) * i,
            sourceY,
            sourceWidth / splitCount,
            sourceHeight,
            0,
            0,
            panelWidth,
            panelHeight
          );

          splits.push(canvas.toDataURL(outputMimeType, 1.0));
        }
      }

      setSplitImages(splits);
    },
    [aspectPreset, focusY, splitCount]
  );

  useEffect(() => {
    if (!selectedImage) return;

    const img = new Image();
    img.onload = () => {
      splitImage(img, imageType, splitMode);
    };
    img.src = selectedImage;
  }, [selectedImage, imageType, splitMode, splitImage]);

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
        const file = new File(
          [blob],
          `${splitMode === "carousel" ? "carousel" : "split"}-${
            index + 1
          }.${ext}`,
          {
            type: imageType,
          }
        );

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
    link.download = `${
      splitMode === "carousel" ? "carousel" : "split"
    }-${index + 1}.${ext}`;
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
    setFocusY(50);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-24 flex items-center justify-between border-b border-[var(--border)] pb-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span>iruagaru / photo tool</span>
          <a className="text-[var(--text)] underline decoration-[var(--border)] underline-offset-4" href="../">Preview images ↗</a>
        </nav>

        <header className="mb-24 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Image slicer / 01</p>
            <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-[var(--text)] sm:text-7xl md:text-8xl">
              Slice one image<br />into a sequence.
            </h1>
          </div>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--text-muted)] md:col-span-3">
            1枚の写真を、つながった3枚または4枚のカルーセルへ。処理はすべてこの端末の中で完結します。
          </p>
        </header>

        <section className="mb-16 grid gap-8 border-y border-[var(--border)] py-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitMode("vertical")}
                className={`border p-4 text-left transition-colors ${
                  splitMode === "vertical"
                    ? "border-[var(--text)] bg-[var(--bg-subtle)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="block text-sm font-medium text-[var(--text)]">
                  縦長を段分割
                </span>
                <span className="mt-1 block text-xs text-[var(--text-muted)]">
                  上から順に3枚または4枚へ
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSplitMode("carousel")}
                className={`border p-4 text-left transition-colors ${
                  splitMode === "carousel"
                    ? "border-[var(--text)] bg-[var(--bg-subtle)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="block text-sm font-medium text-[var(--text)]">
                  横長をカルーセル分割
                </span>
                <span className="mt-1 block text-xs text-[var(--text-muted)]">
                  つながった縦写真を左から順番に
                </span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Pieces</h2>
            <div className="grid grid-cols-2 border border-[var(--border)]">
              {[3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={splitCount === count}
                  onClick={() => setSplitCount(count as SplitCount)}
                  className={`px-4 py-4 text-center text-sm font-medium transition-colors ${
                    splitCount === count
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {count}枚
                </button>
              ))}
            </div>
          </div>

          {splitMode === "carousel" && (
            <div className="grid grid-cols-1 gap-6 md:col-span-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="aspect-preset"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  1枚あたりの比率
                </label>
                <select
                  id="aspect-preset"
                  value={aspectPreset}
                  onChange={(e) => setAspectPreset(e.target.value as AspectPreset)}
                  className="mt-2 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  <option value="3:4">3:4（Xで見やすい縦長）</option>
                  <option value="4:5">4:5（少し横幅広め）</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="focus-y"
                  className="flex items-center justify-between text-sm font-medium text-[var(--text)]"
                >
                  <span>上下位置</span>
                  <span className="text-xs text-[var(--text-muted)]">{focusY}%</span>
                </label>
                <input
                  id="focus-y"
                  type="range"
                  min="0"
                  max="100"
                  value={focusY}
                  onChange={(e) => setFocusY(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--text)]"
                />
              </div>
            </div>
          )}
        </section>

        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border border-dashed px-6 py-24 text-center transition-colors sm:px-16 ${
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
              {splitMode === "carousel" && (
                <p className="text-xs text-[var(--text-muted)]">
                  横長写真を選ぶと、連続した縦{splitCount}枚に自動で切り出します
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Sequence / {splitCount}</p>
                  <h2 className="text-2xl font-medium text-[var(--text)]">分割結果</h2>
                </div>
                <button onClick={reset} className="text-sm text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-4">別の写真を選ぶ</button>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {splitMode === "carousel"
                  ? "左から順番に投稿してください"
                  : "上から順番に投稿してください"}
              </p>
              {splitMode === "carousel" && (
                <div className="mb-16 flex gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)]">
                  {splitImages.map((img, index) => (
                    <figure key={`joined-${index}`} className="relative min-w-0 flex-1 bg-[var(--bg)]">
                      <img
                        src={img}
                        alt=""
                        className={`h-full w-full object-cover ${
                          aspectPreset === "3:4" ? "aspect-[3/4]" : "aspect-[4/5]"
                        }`}
                      />
                      <figcaption className="absolute left-2 top-2 bg-black px-2 py-1 font-mono text-[10px] text-white">{String(index + 1).padStart(2, "0")}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <div className={`grid grid-cols-2 gap-4 ${splitCount === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
                {splitImages.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div
                      className={`relative border border-[var(--border)] overflow-hidden ${
                        splitMode === "carousel"
                          ? aspectPreset === "3:4"
                            ? "aspect-[3/4]"
                            : "aspect-[4/5]"
                          : "aspect-square"
                      }`}
                    >
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

            <div className="flex justify-end gap-4 border-t border-[var(--border)] pt-8">
              <button
                onClick={async () => {
                  for (let i = 0; i < splitImages.length; i++) {
                    downloadImage(splitImages[i], i);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                  }
                }}
                className="bg-[var(--text)] text-[var(--bg)] py-2 px-4 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {splitCount}枚をすべて保存
              </button>
            </div>

            <section className="border-t border-[var(--border)] pt-12">
              <h3 className="text-sm font-medium text-[var(--text)] mb-4">
                iPhoneで写真アプリに保存する方法
              </h3>
              <ol className="text-sm text-[var(--text-muted)] space-y-2">
                <li>1. 各画像の「保存」ボタンを1枚ずつタップ</li>
                <li>2. シェアシート（共有メニュー）が表示される</li>
                <li>3. 「画像を保存」または「&quot;写真&quot;に追加」をタップ</li>
                <li>
                  4. {splitMode === "carousel" ? "左から順番" : "上から順番"}にXへ追加
                </li>
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
