export type Language = "ja" | "en" | "ko" | "zh-Hans" | "zh-Hant";

export const languageOptions: ReadonlyArray<{
  value: Language;
  label: string;
}> = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "zh-Hans", label: "简体中文" },
  { value: "zh-Hant", label: "繁體中文" },
];

export const isLanguage = (value: string | null): value is Language =>
  languageOptions.some((option) => option.value === value);

export const resolveBrowserLanguage = (
  browserLanguages: readonly string[]
): Language => {
  for (const browserLanguage of browserLanguages) {
    const normalized = browserLanguage.toLowerCase();
    if (normalized.startsWith("ja")) return "ja";
    if (normalized.startsWith("ko")) return "ko";
    if (normalized.startsWith("zh")) {
      return /(?:hant|tw|hk|mo)/.test(normalized) ? "zh-Hant" : "zh-Hans";
    }
    if (normalized.startsWith("en")) return "en";
  }

  return "en";
};

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

const ko = {
  ...en,
  languageLabel: "표시 언어",
  toolsLink: "도구 목록 ↗",
  composeLink: "콜라주 ↗",
  annotateLink: "주석 ↗",
  intro:
    "사진 한 장을 이어지는 2~4장의 캐러셀 이미지로 나눕니다. 모든 처리는 이 기기에서만 이루어집니다.",
  verticalMode: "세로로 나누기",
  verticalModeHelp: "위에서 아래 순서로 2~4장 생성",
  carouselMode: "캐러셀로 나누기",
  carouselModeHelp: "왼쪽에서 오른쪽으로 이어지는 이미지 생성",
  pieces: (count: number) => `${count}장`,
  photoUsage: "사진 사용 방식",
  useFull: "전체 이미지 사용",
  noCrop: "자르지 않음",
  matchRatio: "비율 맞추기",
  cropVertical: "위아래 자르기",
  aspectLabel: "이미지 한 장의 비율",
  aspectThreeFour: "3:4 (X에 적합한 세로 비율)",
  aspectFourFive: "4:5 (조금 더 넓게)",
  verticalPosition: "세로 위치",
  rotateHelp: "세로 사진을 회전한 뒤 나눌 수 있습니다",
  rotationNone: "회전 안 함",
  rotationLeft: "왼쪽으로 90°",
  rotationRight: "오른쪽으로 90°",
  rotationDescription: (rotation: "none" | "left" | "right") =>
    rotation === "right"
      ? "오른쪽으로 회전해도 원본 사진의 위쪽부터 1, 2, 3… 순서로 저장합니다."
      : rotation === "left"
        ? "원본 사진의 위쪽부터 1, 2, 3… 순서로 저장합니다."
        : "사진 방향은 변경되지 않습니다.",
  chooseFile: "파일 선택",
  orDrop: " 또는 드래그 앤 드롭",
  supportedFormats: "PNG, JPG 등",
  fullSplitHelp: (count: number) =>
    `사진 전체를 유지하고 같은 너비의 ${count}장으로 나눕니다.`,
  fixedSplitHelp: (count: number) =>
    `고정 비율로 이어지는 세로 이미지 ${count}장을 만듭니다.`,
  imageErrorTitle: "이미지를 불러올 수 없습니다",
  chooseAnother: "다른 사진 선택",
  portraitChoiceTitle: "세로 사진 사용 방식을 선택하세요",
  portraitChoiceHelp: (count: number) =>
    `이 사진을 가로 방향으로 ${count}장 나누면 각 이미지가 매우 좁아집니다. 사진을 회전하거나 고정 비율로 잘라 더 보기 좋은 결과를 만들 수 있습니다.`,
  rotateLeftAction: "왼쪽으로 90° 회전 후 나누기",
  rotateRightAction: "오른쪽으로 90° 회전 후 나누기",
  fixedCropAction: (aspect: string) => `${aspect} 비율로 잘라 나누기`,
  keepNarrowAction: "좁은 형태 그대로 나누기",
  resultsTitle: "분할 결과",
  carouselOrder: "1번부터 번호 순서대로 게시하세요.",
  verticalOrder: "위에서 아래 순서대로 게시하세요.",
  splitImageAlt: (index: number) => `분할 이미지 ${index}`,
  saveOne: (index: number) => `${index}번 이미지 저장 / 공유`,
  saveAll: (count: number) => `${count}장 모두 저장 / 공유`,
  iphoneSaveTitle: "iPhone 사진 앱에 저장하는 방법",
  iphoneStepOne: (count: number) =>
    `1. “${count}장 모두 저장 / 공유”를 탭합니다.`,
  iphoneStepTwo: "2. iOS 공유 시트가 열립니다.",
  iphoneStepThree: (count: number) =>
    `3. “이미지 저장” 또는 “이미지 ${count}장 저장”을 탭합니다.`,
  iphoneStepFour: (carousel: boolean) =>
    `4. X에 ${carousel ? "1번부터 번호 순서대로" : "위에서 아래 순서대로"} 추가합니다.`,
  iphoneSaveNote:
    "저장 항목이 보이지 않으면 공유 시트를 아래로 스크롤하세요. 이미지를 한 장씩 저장할 수도 있습니다.",
  privacy: "이미지는 이 브라우저에서만 처리되며 서버에 저장되지 않습니다.",
  errors: {
    "invalid-file": "이미지 파일을 선택하세요.",
    "read-failed": "파일을 읽을 수 없습니다. 다른 이미지를 선택해 주세요.",
    "process-failed":
      "브라우저에서 이 이미지를 처리할 수 없습니다. PNG 또는 JPG로 변환한 뒤 다시 시도해 주세요.",
    "decode-failed":
      "브라우저에서 이 이미지 형식을 읽을 수 없습니다. PNG 또는 JPG로 변환한 뒤 다시 시도해 주세요.",
  },
};

const zhHans = {
  ...en,
  languageLabel: "显示语言",
  toolsLink: "工具列表 ↗",
  composeLink: "拼图 ↗",
  annotateLink: "标注 ↗",
  intro:
    "将一张照片拆分为2至4张连续的轮播图片。所有处理都只在此设备上完成。",
  verticalMode: "纵向分段",
  verticalModeHelp: "从上到下生成2至4张图片",
  carouselMode: "拆分为轮播图",
  carouselModeHelp: "从左到右生成连续图片",
  pieces: (count: number) => `${count}张`,
  photoUsage: "照片使用方式",
  useFull: "使用完整照片",
  noCrop: "不裁剪",
  matchRatio: "统一宽高比",
  cropVertical: "裁剪上下部分",
  aspectLabel: "每张图片的宽高比",
  aspectThreeFour: "3:4（适合X的竖图）",
  aspectFourFive: "4:5（稍宽一些）",
  verticalPosition: "上下位置",
  rotateHelp: "可先将竖图旋转为横向再拆分",
  rotationNone: "不旋转",
  rotationLeft: "向左90°",
  rotationRight: "向右90°",
  rotationDescription: (rotation: "none" | "left" | "right") =>
    rotation === "right"
      ? "即使向右旋转，也会从原图顶部开始按1、2、3…的顺序保存。"
      : rotation === "left"
        ? "会从原图顶部开始按1、2、3…的顺序保存。"
        : "不会改变图片方向。",
  chooseFile: "选择文件",
  orDrop: " 或拖放到这里",
  supportedFormats: "PNG、JPG等",
  fullSplitHelp: (count: number) =>
    `保留完整照片，并拆分为${count}张等宽图片。`,
  fixedSplitHelp: (count: number) =>
    `按固定宽高比裁出${count}张连续竖图。`,
  imageErrorTitle: "无法加载此图片",
  chooseAnother: "选择其他照片",
  portraitChoiceTitle: "请选择竖图的处理方式",
  portraitChoiceHelp: (count: number) =>
    `如果将此照片横向拆分为${count}张，每张图片会非常窄。旋转照片或按固定宽高比裁剪，可获得更合适的效果。`,
  rotateLeftAction: "向左旋转90°后拆分",
  rotateRightAction: "向右旋转90°后拆分",
  fixedCropAction: (aspect: string) => `裁剪为${aspect}后拆分`,
  keepNarrowAction: "保持窄幅直接拆分",
  resultsTitle: "拆分结果",
  carouselOrder: "请从第1张开始按编号顺序发布。",
  verticalOrder: "请按从上到下的顺序发布。",
  splitImageAlt: (index: number) => `拆分图片 ${index}`,
  saveOne: (index: number) => `保存 / 分享第${index}张`,
  saveAll: (count: number) => `保存 / 分享全部${count}张`,
  iphoneSaveTitle: "如何将图片保存到iPhone照片应用",
  iphoneStepOne: (count: number) =>
    `1. 点击“保存 / 分享全部${count}张”。`,
  iphoneStepTwo: "2. iOS分享菜单将会打开。",
  iphoneStepThree: (count: number) =>
    `3. 点击“存储图像”或“存储${count}张图像”。`,
  iphoneStepFour: (carousel: boolean) =>
    `4. ${carousel ? "从第1张开始按编号顺序" : "按从上到下的顺序"}添加到X。`,
  iphoneSaveNote:
    "如果找不到保存选项，请在分享菜单中向下滚动。也可以逐张保存图片。",
  privacy: "图片仅在此浏览器中处理，不会保存到服务器。",
  errors: {
    "invalid-file": "请选择图片文件。",
    "read-failed": "无法读取此文件，请尝试其他图片。",
    "process-failed":
      "浏览器无法处理此图片。请先转换为PNG或JPG后重试。",
    "decode-failed":
      "浏览器无法读取此图片格式。请先转换为PNG或JPG后重试。",
  },
};

const zhHant = {
  ...en,
  languageLabel: "顯示語言",
  toolsLink: "工具列表 ↗",
  composeLink: "拼圖 ↗",
  annotateLink: "標註 ↗",
  intro:
    "將一張照片拆分為2至4張連續的輪播圖片。所有處理都只在此裝置上完成。",
  verticalMode: "直向分段",
  verticalModeHelp: "從上到下產生2至4張圖片",
  carouselMode: "拆分為輪播圖",
  carouselModeHelp: "從左到右產生連續圖片",
  pieces: (count: number) => `${count}張`,
  photoUsage: "照片使用方式",
  useFull: "使用完整照片",
  noCrop: "不裁切",
  matchRatio: "統一長寬比",
  cropVertical: "裁切上下部分",
  aspectLabel: "每張圖片的長寬比",
  aspectThreeFour: "3:4（適合X的直式圖片）",
  aspectFourFive: "4:5（稍寬一些）",
  verticalPosition: "上下位置",
  rotateHelp: "可先將直式照片旋轉為橫向再拆分",
  rotationNone: "不旋轉",
  rotationLeft: "向左90°",
  rotationRight: "向右90°",
  rotationDescription: (rotation: "none" | "left" | "right") =>
    rotation === "right"
      ? "即使向右旋轉，也會從原圖頂部開始依1、2、3…的順序儲存。"
      : rotation === "left"
        ? "會從原圖頂部開始依1、2、3…的順序儲存。"
        : "不會變更圖片方向。",
  chooseFile: "選擇檔案",
  orDrop: " 或拖放到這裡",
  supportedFormats: "PNG、JPG等",
  fullSplitHelp: (count: number) =>
    `保留完整照片，並拆分為${count}張等寬圖片。`,
  fixedSplitHelp: (count: number) =>
    `依固定長寬比裁出${count}張連續直式圖片。`,
  imageErrorTitle: "無法載入此圖片",
  chooseAnother: "選擇其他照片",
  portraitChoiceTitle: "請選擇直式照片的處理方式",
  portraitChoiceHelp: (count: number) =>
    `若將此照片橫向拆分為${count}張，每張圖片會非常窄。旋轉照片或依固定長寬比裁切，可獲得更合適的結果。`,
  rotateLeftAction: "向左旋轉90°後拆分",
  rotateRightAction: "向右旋轉90°後拆分",
  fixedCropAction: (aspect: string) => `裁切為${aspect}後拆分`,
  keepNarrowAction: "保留窄幅直接拆分",
  resultsTitle: "拆分結果",
  carouselOrder: "請從第1張開始依編號順序發佈。",
  verticalOrder: "請依從上到下的順序發佈。",
  splitImageAlt: (index: number) => `拆分圖片 ${index}`,
  saveOne: (index: number) => `儲存 / 分享第${index}張`,
  saveAll: (count: number) => `儲存 / 分享全部${count}張`,
  iphoneSaveTitle: "如何將圖片儲存到iPhone「照片」",
  iphoneStepOne: (count: number) =>
    `1. 點一下「儲存 / 分享全部${count}張」。`,
  iphoneStepTwo: "2. iOS分享選單將會開啟。",
  iphoneStepThree: (count: number) =>
    `3. 點一下「儲存影像」或「儲存${count}張影像」。`,
  iphoneStepFour: (carousel: boolean) =>
    `4. ${carousel ? "從第1張開始依編號順序" : "依從上到下的順序"}加入X。`,
  iphoneSaveNote:
    "若找不到儲存選項，請在分享選單中向下捲動。也可以逐張儲存圖片。",
  privacy: "圖片只會在此瀏覽器中處理，不會儲存到伺服器。",
  errors: {
    "invalid-file": "請選擇圖片檔案。",
    "read-failed": "無法讀取此檔案，請嘗試其他圖片。",
    "process-failed":
      "瀏覽器無法處理此圖片。請先轉換為PNG或JPG後再試一次。",
    "decode-failed":
      "瀏覽器無法讀取此圖片格式。請先轉換為PNG或JPG後再試一次。",
  },
};

export const translations = {
  ja,
  en,
  ko,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
};
