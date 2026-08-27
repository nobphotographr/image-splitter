export type Language = "ja" | "en";

export type ImageErrorKey =
  | "invalid-file"
  | "read-failed"
  | "process-failed"
  | "decode-failed";

const ja = {
  languageLabel: "表示言語",
  toolsLink: "ツール一覧 ↗",
  composeLink: "組み写真 ↗",
  annotateLink: "注釈 ↗",
  intro:
    "1枚の写真を、つながった2〜4枚のカルーセルへ。処理はすべてこの端末の中で完結します。",
  verticalMode: "縦長を段分割",
  verticalModeHelp: "上から順に2〜4枚へ",
  carouselMode: "横長をカルーセル分割",
  carouselModeHelp: "つながった縦写真を左から順番に",
  pieces: (count: number) => `${count}枚`,
  photoUsage: "写真の使い方",
  useFull: "全体を使う",
  noCrop: "クロップなし",
  matchRatio: "比率を揃える",
  cropVertical: "上下をトリミング",
  aspectLabel: "1枚あたりの比率",
  aspectThreeFour: "3:4（Xで見やすい縦長）",
  aspectFourFive: "4:5（少し横幅広め）",
  verticalPosition: "上下位置",
  rotateHelp: "縦画像を横向きにしてから分割できます",
  rotationNone: "そのまま",
  rotationLeft: "左へ90°",
  rotationRight: "右へ90°",
  rotationDescription: (rotation: "none" | "left" | "right") =>
    rotation === "right"
      ? "右回転でも、元画像の上側から1、2、3…の順に保存します"
      : rotation === "left"
        ? "元画像の上側から1、2、3…の順に保存します"
        : "画像の向きは変更しません",
  chooseFile: "ファイルを選択",
  orDrop: " またはドラッグ&ドロップ",
  supportedFormats: "PNG, JPG など",
  fullSplitHelp: (count: number) =>
    `写真全体を残したまま、等幅の${count}枚に分割します`,
  fixedSplitHelp: (count: number) =>
    `固定比率で、連続した縦${count}枚に切り出します`,
  imageErrorTitle: "画像を読み込めませんでした",
  chooseAnother: "別の写真を選ぶ",
  portraitChoiceTitle: "縦写真の使い方を選んでください",
  portraitChoiceHelp: (count: number) =>
    `このまま横方向へ${count}分割すると、1枚ずつがかなり細長くなります。写真を回転するか、固定比率で切り出すと見やすい形になります。`,
  rotateLeftAction: "左へ90°回転して分割",
  rotateRightAction: "右へ90°回転して分割",
  fixedCropAction: (aspect: string) => `${aspect}に切り出して分割`,
  keepNarrowAction: "細長いまま分割する",
  resultsTitle: "分割結果",
  carouselOrder: "1から番号順に投稿してください",
  verticalOrder: "上から順番に投稿してください",
  splitImageAlt: (index: number) => `分割 ${index}`,
  saveOne: (index: number) => `${index}枚目を保存 / 共有`,
  saveAll: (count: number) => `${count}枚をまとめて保存 / 共有`,
  iphoneSaveTitle: "iPhoneで写真アプリに保存する方法",
  iphoneStepOne: (count: number) =>
    `1. 「${count}枚をまとめて保存 / 共有」をタップ`,
  iphoneStepTwo: "2. シェアシート（共有メニュー）が表示される",
  iphoneStepThree: (count: number) =>
    `3. 「画像を保存」または「${count}枚の画像を保存」をタップ`,
  iphoneStepFour: (carousel: boolean) =>
    `4. ${carousel ? "1から番号順" : "上から順番"}にXへ追加`,
  iphoneSaveNote:
    "保存項目が見つからない場合は、シェアシートを下へスクロールしてください。1枚ずつ保存することもできます。",
  privacy: "データはブラウザ上でのみ処理され、サーバーには保存されません",
  errors: {
    "invalid-file": "画像ファイルを選択してください。",
    "read-failed":
      "画像ファイルを読み込めませんでした。別の画像をお試しください。",
    "process-failed":
      "この画像はブラウザで処理できませんでした。PNGまたはJPGへ変換してからお試しください。",
    "decode-failed":
      "この画像形式をブラウザで読み込めません。PNGまたはJPGへ変換してからお試しください。",
  },
};

const en = {
  languageLabel: "Display language",
  toolsLink: "Tools ↗",
  composeLink: "Compose ↗",
  annotateLink: "Annotate ↗",
  intro:
    "Turn one photo into a seamless 2–4 image carousel. Everything is processed on this device.",
  verticalMode: "Split into rows",
  verticalModeHelp: "Create 2–4 images from top to bottom",
  carouselMode: "Split into a carousel",
  carouselModeHelp: "Create a connected sequence from left to right",
  pieces: (count: number) => `${count} pieces`,
  photoUsage: "How to use the photo",
  useFull: "Use the full image",
  noCrop: "No cropping",
  matchRatio: "Match aspect ratios",
  cropVertical: "Crop the top and bottom",
  aspectLabel: "Aspect ratio per image",
  aspectThreeFour: "3:4 (portrait, ideal for X)",
  aspectFourFive: "4:5 (slightly wider)",
  verticalPosition: "Vertical position",
  rotateHelp: "Rotate a portrait image before splitting it",
  rotationNone: "No rotation",
  rotationLeft: "90° left",
  rotationRight: "90° right",
  rotationDescription: (rotation: "none" | "left" | "right") =>
    rotation === "right"
      ? "Even when rotated right, files are saved as 1, 2, 3… from the original top edge."
      : rotation === "left"
        ? "Files are saved as 1, 2, 3… from the original top edge."
        : "The image orientation will not change.",
  chooseFile: "Choose a file",
  orDrop: " or drag and drop",
  supportedFormats: "PNG, JPG, and more",
  fullSplitHelp: (count: number) =>
    `Keep the full photo and split it into ${count} equal-width images.`,
  fixedSplitHelp: (count: number) =>
    `Crop a continuous sequence of ${count} portrait images at a fixed ratio.`,
  imageErrorTitle: "We couldn't load this image",
  chooseAnother: "Choose another photo",
  portraitChoiceTitle: "Choose how to use this portrait photo",
  portraitChoiceHelp: (count: number) =>
    `Splitting this photo horizontally into ${count} pieces would make each image very narrow. Rotate it or crop it to a fixed ratio for a better result.`,
  rotateLeftAction: "Rotate 90° left and split",
  rotateRightAction: "Rotate 90° right and split",
  fixedCropAction: (aspect: string) => `Crop to ${aspect} and split`,
  keepNarrowAction: "Split it without changing the shape",
  resultsTitle: "Split images",
  carouselOrder: "Post the images in numbered order, starting with 1.",
  verticalOrder: "Post the images from top to bottom.",
  splitImageAlt: (index: number) => `Split image ${index}`,
  saveOne: (index: number) => `Save / share image ${index}`,
  saveAll: (count: number) => `Save / share all ${count} images`,
  iphoneSaveTitle: "How to save images to Photos on iPhone",
  iphoneStepOne: (count: number) =>
    `1. Tap “Save / share all ${count} images.”`,
  iphoneStepTwo: "2. The iOS share sheet will open.",
  iphoneStepThree: (count: number) =>
    `3. Tap “Save Image” or “Save ${count} Images.”`,
  iphoneStepFour: (carousel: boolean) =>
    `4. Add them to X ${carousel ? "in numbered order, starting with 1" : "from top to bottom"}.`,
  iphoneSaveNote:
    "If the save option is not visible, scroll down in the share sheet. You can also save each image separately.",
  privacy: "Your images are processed only in this browser and are never saved on a server.",
  errors: {
    "invalid-file": "Please choose an image file.",
    "read-failed": "We couldn't read this file. Please try another image.",
    "process-failed":
      "Your browser couldn't process this image. Convert it to PNG or JPG and try again.",
    "decode-failed":
      "Your browser couldn't decode this image format. Convert it to PNG or JPG and try again.",
  },
};

export const translations = { ja, en };
