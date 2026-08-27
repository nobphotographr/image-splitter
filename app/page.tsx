"use client";

/* eslint-disable @next/next/no-img-element -- previews are client-generated data URLs */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  translations,
  type ImageErrorKey,
  type Language,
} from "./translations";

type SplitMode = "vertical" | "carousel";
type AspectPreset = "3:4" | "4:5";
type SplitCount = 2 | 3 | 4;
type CropMode = "full" | "fixed";
type RotationMode = "none" | "left" | "right";

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
  const [language, setLanguage] = useState<Language>("ja");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageType, setImageType] = useState<string>("image/png");
  const [splitMode, setSplitMode] = useState<SplitMode>("carousel");
  const [splitCount, setSplitCount] = useState<SplitCount>(4);
  const [cropMode, setCropMode] = useState<CropMode>("full");
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>("3:4");
  const [rotationMode, setRotationMode] = useState<RotationMode>("none");
  const [focusY, setFocusY] = useState(50);
  const [sourceRatio, setSourceRatio] = useState(1);
  const [sourceIsPortrait, setSourceIsPortrait] = useState(false);
  const [allowNarrowPortrait, setAllowNarrowPortrait] = useState(false);
  const [imageError, setImageError] = useState<ImageErrorKey | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const text = translations[language];

  useEffect(() => {
    let preferredLanguage: Language = navigator.language
      .toLowerCase()
      .startsWith("ja")
      ? "ja"
      : "en";

    try {
      const savedLanguage = localStorage.getItem(
        "iruagaru-image-splitter-language"
      );
      if (savedLanguage === "ja" || savedLanguage === "en") {
        preferredLanguage = savedLanguage;
      }
    } catch {
      // The switch still works when storage is unavailable.
    }

    setLanguage(preferredLanguage);
    document.documentElement.lang = preferredLanguage;
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    try {
      localStorage.setItem("iruagaru-image-splitter-language", nextLanguage);
    } catch {
      // Keep the current-session selection when storage is unavailable.
    }
  };

  const handleImageUpload = (file: File) => {
    setImageError(null);
    setAllowNarrowPortrait(false);

    if (!file.type.startsWith("image/")) {
      setImageError("invalid-file");
      return;
    }

    setImageType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.onerror = () => {
      setSelectedImage(null);
      setImageError("read-failed");
    };
    reader.readAsDataURL(file);
  };

  const splitImage = useCallback(
    (img: HTMLImageElement, mimeType: string, mode: SplitMode) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let source: CanvasImageSource = img;
      let width = img.width;
      let height = img.height;

      if (rotationMode !== "none") {
        const rotatedCanvas = document.createElement("canvas");
        rotatedCanvas.width = img.height;
        rotatedCanvas.height = img.width;

        const rotatedCtx = rotatedCanvas.getContext("2d");
        if (!rotatedCtx) return;

        rotatedCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
        rotatedCtx.rotate(
          rotationMode === "left" ? -Math.PI / 2 : Math.PI / 2
        );
        rotatedCtx.drawImage(img, -img.width / 2, -img.height / 2);

        source = rotatedCanvas;
        width = rotatedCanvas.width;
        height = rotatedCanvas.height;
      }

      setSourceRatio(width / height);
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
            source,
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
      } else if (cropMode === "full") {
        const sliceWidth = Math.floor(width / splitCount);

        for (let i = 0; i < splitCount; i++) {
          canvas.width =
            i === splitCount - 1
              ? width - sliceWidth * (splitCount - 1)
              : sliceWidth;
          canvas.height = height;

          ctx.drawImage(
            source,
            i * sliceWidth,
            0,
            canvas.width,
            height,
            0,
            0,
            canvas.width,
            height
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
            source,
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

      setSplitImages(
        mode === "carousel" && rotationMode === "right"
          ? splits.reverse()
          : splits
      );
    },
    [aspectPreset, cropMode, focusY, rotationMode, splitCount]
  );

  useEffect(() => {
    if (!selectedImage) return;

    const img = new Image();
    img.onload = () => {
      const isPortrait = img.naturalHeight > img.naturalWidth;
      setSourceIsPortrait(isPortrait);

      const needsPortraitChoice =
        isPortrait &&
        splitMode === "carousel" &&
        cropMode === "full" &&
        rotationMode === "none" &&
        !allowNarrowPortrait;

      if (needsPortraitChoice) {
        setSourceRatio(img.width / img.height);
        setSplitImages([]);
        return;
      }

      try {
        splitImage(img, imageType, splitMode);
        setImageError(null);
      } catch {
        setSplitImages([]);
        setImageError("process-failed");
      }
    };
    img.onerror = () => {
      setSplitImages([]);
      setImageError("decode-failed");
    };
    img.src = selectedImage;
  }, [
    allowNarrowPortrait,
    cropMode,
    imageType,
    rotationMode,
    selectedImage,
    splitImage,
    splitMode,
  ]);

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

  const getFileExtension = (mimeType: string) => {
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      return "jpg";
    } else if (mimeType === "image/png") {
      return "png";
    } else if (mimeType === "image/webp") {
      return "webp";
    }
    return "png";
  };

  const createImageFile = (dataUrl: string, index: number) => {
    const blob = dataURLtoBlob(dataUrl);
    const ext = getFileExtension(blob.type);

    return new File(
      [blob],
      `${splitMode === "carousel" ? "carousel" : "split"}-${index + 1}.${ext}`,
      {
        type: blob.type,
      }
    );
  };

  const shareImage = async (dataUrl: string, index: number) => {
    const file = createImageFile(dataUrl, index);
    const canShareFile =
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" ||
        navigator.canShare({ files: [file] }));

    if (canShareFile) {
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          downloadImage(dataUrl, index);
        }
      }
    } else {
      downloadImage(dataUrl, index);
    }
  };

  const saveAllImages = async () => {
    const files = splitImages.map(createImageFile);
    const canShareFiles =
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" ||
        navigator.canShare({ files }));

    if (canShareFiles) {
      try {
        await navigator.share({ files });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }

    for (let i = 0; i < splitImages.length; i++) {
      downloadImage(splitImages[i], i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    const ext = getFileExtension(dataURLtoBlob(dataUrl).type);
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
    setSourceRatio(1);
    setSourceIsPortrait(false);
    setAllowNarrowPortrait(false);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const outputAspect =
    splitMode === "carousel"
      ? cropMode === "full"
        ? sourceRatio / splitCount
        : aspectPreset === "3:4"
          ? 3 / 4
          : 4 / 5
      : sourceRatio * splitCount;

  const joinedPreviewImages =
    splitMode === "carousel" && rotationMode === "right"
      ? [...splitImages].reverse()
      : splitImages;

  const needsPortraitChoice =
    Boolean(selectedImage) &&
    sourceIsPortrait &&
    splitMode === "carousel" &&
    cropMode === "full" &&
    rotationMode === "none" &&
    !allowNarrowPortrait;

  const isVeryNarrowPreview = outputAspect < 0.35;

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-24 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span>iruagaru / photo tool</span>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
            <span
              className="inline-flex border border-[var(--border)] tracking-normal"
              role="group"
              aria-label={text.languageLabel}
            >
              {(["ja", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  lang={option}
                  aria-pressed={language === option}
                  onClick={() => changeLanguage(option)}
                  className={`px-2 py-1 transition-colors ${
                    language === option
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </span>
            <a className="text-[var(--text)] underline decoration-[var(--border)] underline-offset-4" href="../">{text.toolsLink}</a>
            <a className="text-[var(--text)] underline decoration-[var(--border)] underline-offset-4" href="../image-composer/">{text.composeLink}</a>
            <a className="text-[var(--text)] underline decoration-[var(--border)] underline-offset-4" href="../image-annotator/">{text.annotateLink}</a>
          </div>
        </nav>

        <header className="mb-24 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Image slicer / 01</p>
            <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-[var(--text)] sm:text-7xl md:text-8xl">
              Slice one image<br />into a sequence.
            </h1>
          </div>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--text-muted)] md:col-span-3">
            {text.intro}
          </p>
        </header>

        <section className="mb-16 grid gap-8 border-y border-[var(--border)] py-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSplitMode("vertical");
                  setRotationMode("none");
                }}
                className={`border p-4 text-left transition-colors ${
                  splitMode === "vertical"
                    ? "border-[var(--text)] bg-[var(--bg-subtle)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="block text-sm font-medium text-[var(--text)]">
                  {text.verticalMode}
                </span>
                <span className="mt-1 block text-xs text-[var(--text-muted)]">
                  {text.verticalModeHelp}
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
                  {text.carouselMode}
                </span>
                <span className="mt-1 block text-xs text-[var(--text-muted)]">
                  {text.carouselModeHelp}
                </span>
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Pieces</h2>
            <div className="grid grid-cols-3 border border-[var(--border)]">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={splitCount === count}
                  onClick={() => setSplitCount(count as SplitCount)}
                  className={`min-w-0 whitespace-nowrap px-2 py-4 text-center text-sm font-medium transition-colors ${
                    splitCount === count
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {text.pieces(count)}
                </button>
              ))}
            </div>
          </div>

          {splitMode === "carousel" && (
            <div className="grid grid-cols-1 gap-6 md:col-span-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-[var(--text)]">{text.photoUsage}</span>
                <div className="mt-2 grid grid-cols-2 border border-[var(--border)]">
                  <button
                    type="button"
                    aria-pressed={cropMode === "full"}
                    onClick={() => setCropMode("full")}
                    className={`px-3 py-3 text-left text-xs transition-colors ${
                      cropMode === "full"
                        ? "bg-[var(--text)] text-[var(--bg)]"
                        : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    {text.useFull}
                    <small className="mt-1 block opacity-70">{text.noCrop}</small>
                  </button>
                  <button
                    type="button"
                    aria-pressed={cropMode === "fixed"}
                    onClick={() => setCropMode("fixed")}
                    className={`px-3 py-3 text-left text-xs transition-colors ${
                      cropMode === "fixed"
                        ? "bg-[var(--text)] text-[var(--bg)]"
                        : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    {text.matchRatio}
                    <small className="mt-1 block opacity-70">{text.cropVertical}</small>
                  </button>
                </div>
              </div>
              {cropMode === "fixed" && (
                <>
                  <div>
                    <label
                      htmlFor="aspect-preset"
                      className="text-sm font-medium text-[var(--text)]"
                    >
                      {text.aspectLabel}
                    </label>
                    <select
                      id="aspect-preset"
                      value={aspectPreset}
                      onChange={(e) =>
                        setAspectPreset(e.target.value as AspectPreset)
                      }
                      className="mt-2 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
                    >
                      <option value="3:4">{text.aspectThreeFour}</option>
                      <option value="4:5">{text.aspectFourFive}</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="focus-y"
                      className="flex items-center justify-between text-sm font-medium text-[var(--text)]"
                    >
                      <span>{text.verticalPosition}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {focusY}%
                      </span>
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
                </>
              )}
            </div>
          )}
        </section>

        {splitMode === "carousel" && (
          <section className="mb-16 grid gap-6 border-b border-[var(--border)] pb-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-3">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Rotate
              </h2>
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                {text.rotateHelp}
              </p>
            </div>
            <div className="grid grid-cols-3 border border-[var(--border)] md:col-span-6">
              {(
                [
                  ["none", text.rotationNone, "↕"],
                  ["left", text.rotationLeft, "↶"],
                  ["right", text.rotationRight, "↷"],
                ] as const
              ).map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={rotationMode === value}
                  onClick={() => setRotationMode(value)}
                  className={`px-3 py-4 text-center text-xs transition-colors sm:text-sm ${
                    rotationMode === value
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <span aria-hidden="true" className="mb-1 block text-lg leading-none">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-muted)] md:col-span-3">
              {text.rotationDescription(rotationMode)}
            </p>
          </section>
        )}

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
                  {text.chooseFile}
                </label>
                <span>{text.orDrop}</span>
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
              <p className="text-sm text-[var(--text-muted)]">{text.supportedFormats}</p>
              {imageError && (
                <p role="alert" className="text-sm text-[var(--text)]">
                  {text.errors[imageError]}
                </p>
              )}
              {splitMode === "carousel" && (
                <p className="text-xs text-[var(--text-muted)]">
                  {cropMode === "full"
                    ? text.fullSplitHelp(splitCount)
                    : text.fixedSplitHelp(splitCount)}
                </p>
              )}
            </div>
          </div>
        ) : imageError ? (
          <section className="border-y border-[var(--border)] py-16">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Image error
            </p>
            <h2 className="mb-4 text-2xl font-medium text-[var(--text)]">
              {text.imageErrorTitle}
            </h2>
            <p role="alert" className="max-w-prose text-sm leading-relaxed text-[var(--text-muted)]">
              {text.errors[imageError]}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)]"
            >
              {text.chooseAnother}
            </button>
          </section>
        ) : needsPortraitChoice ? (
          <section className="grid gap-8 border-y border-[var(--border)] py-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Portrait image
              </p>
              <h2 className="text-2xl font-medium text-[var(--text)]">
                {text.portraitChoiceTitle}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="mb-6 max-w-prose text-sm leading-relaxed text-[var(--text-muted)]">
                {text.portraitChoiceHelp(splitCount)}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRotationMode("left")}
                  className="border border-[var(--text)] bg-[var(--text)] px-4 py-3 text-left text-sm font-medium text-[var(--bg)]"
                >
                  {text.rotateLeftAction}
                </button>
                <button
                  type="button"
                  onClick={() => setRotationMode("right")}
                  className="border border-[var(--border)] px-4 py-3 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                >
                  {text.rotateRightAction}
                </button>
                <button
                  type="button"
                  onClick={() => setCropMode("fixed")}
                  className="border border-[var(--border)] px-4 py-3 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                >
                  {text.fixedCropAction(aspectPreset)}
                </button>
                <button
                  type="button"
                  onClick={() => setAllowNarrowPortrait(true)}
                  className="border border-[var(--border)] px-4 py-3 text-left text-sm text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                >
                  {text.keepNarrowAction}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="space-y-16">
            <section>
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Sequence / {splitCount}</p>
                  <h2 className="text-2xl font-medium text-[var(--text)]">{text.resultsTitle}</h2>
                </div>
                <button onClick={reset} className="text-sm text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-4">{text.chooseAnother}</button>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {splitMode === "carousel"
                  ? text.carouselOrder
                  : text.verticalOrder}
              </p>
              {splitMode === "carousel" && (
                <div
                  className={`mb-16 flex gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] ${
                    isVeryNarrowPreview ? "justify-center" : ""
                  }`}
                >
                  {joinedPreviewImages.map((img, index) => (
                    <figure
                      key={`joined-${index}`}
                      className={`relative bg-[var(--bg)] ${
                        isVeryNarrowPreview ? "flex-none" : "min-w-0 flex-1"
                      }`}
                      style={
                        isVeryNarrowPreview
                          ? { aspectRatio: outputAspect, height: "min(64vh, 640px)" }
                          : { aspectRatio: outputAspect }
                      }
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <figcaption className="absolute left-2 top-2 bg-black px-2 py-1 font-mono text-[10px] text-white">
                        {String(
                          rotationMode === "right"
                            ? splitCount - index
                            : index + 1
                        ).padStart(2, "0")}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <div className={`grid grid-cols-2 gap-4 ${splitCount === 2 ? "md:grid-cols-2" : splitCount === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
                {splitImages.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div
                      className="relative overflow-hidden border border-[var(--border)]"
                      style={
                        isVeryNarrowPreview
                          ? { height: "min(56vh, 560px)" }
                          : { aspectRatio: outputAspect }
                      }
                    >
                      <img
                        src={img}
                        alt={text.splitImageAlt(index + 1)}
                        className={`h-full w-full ${
                          isVeryNarrowPreview ? "object-contain" : "object-cover"
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => shareImage(img, index)}
                      className="w-full bg-[var(--text)] text-[var(--bg)] py-2 px-4 text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                      {text.saveOne(index + 1)}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end gap-4 border-t border-[var(--border)] pt-8">
              <button
                onClick={saveAllImages}
                className="bg-[var(--text)] text-[var(--bg)] py-2 px-4 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {text.saveAll(splitCount)}
              </button>
            </div>

            <section className="border-t border-[var(--border)] pt-12">
              <h3 className="text-sm font-medium text-[var(--text)] mb-4">
                {text.iphoneSaveTitle}
              </h3>
              <ol className="text-sm text-[var(--text-muted)] space-y-2">
                <li>{text.iphoneStepOne(splitCount)}</li>
                <li>{text.iphoneStepTwo}</li>
                <li>{text.iphoneStepThree(splitCount)}</li>
                <li>{text.iphoneStepFour(splitMode === "carousel")}</li>
              </ol>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                {text.iphoneSaveNote}
              </p>
            </section>
          </div>
        )}

        <footer className="mt-24 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            {text.privacy}
          </p>
        </footer>
      </div>
    </div>
  );
}
