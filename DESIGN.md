# デザインガイドライン（トンマナ憲法）

このドキュメントはAIによるコード生成時に必ず参照される制約です。
「Microsoftっぽいテンプレ感」を排除し、Apple / Nuevo.Tokyo 的な削ぎ落としたデザインを維持します。

---

## 1. レイアウト（グリッド／余白／幅）

| 項目 | 値 | 備考 |
|------|-----|------|
| 最大幅 | `1120px` | `max-w-5xl` 相当 |
| グリッド | 12カラム | 必要に応じて |
| 左右padding | `24px`（モバイル`16px`） | |
| セクション間余白 | `96px` 以上 | `py-24` 相当 |
| スペーシング | `8/16/24/32/48/64/96/128` のみ | これ以外禁止 |

---

## 2. タイポグラフィ

```
フォント:
- 本文: Geist Sans（すでに読み込み済み）
- コード/ラベル: Geist Mono

ウェイト:
- Regular (400) / Medium (500) / Semibold (600) の3段階のみ

タイポスケール（Tailwind換算）:
- H1: text-4xl (36px) / leading-tight
- H2: text-2xl (24px) / leading-snug
- H3: text-xl (20px) / leading-snug
- Body: text-base (16px) / leading-relaxed
- Small: text-sm (14px) / leading-relaxed

行長: max-w-prose（約65文字）
```

---

## 3. カラーパレット

```css
/* CSS変数として定義 */
:root {
  --bg: #FFFFFF;
  --bg-subtle: #FAFAFA;      /* 控えめな背景差分が必要な時のみ */
  --text: #111111;
  --text-muted: #666666;
  --border: #E5E5E5;
  --accent: #111111;         /* リンク・CTAはダークで統一 */
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0A0A0A;
    --bg-subtle: #141414;
    --text: #EDEDED;
    --text-muted: #888888;
    --border: #2A2A2A;
    --accent: #EDEDED;
  }
}
```

### 禁止
- グラデーション背景
- 青・緑・赤などの多色アクセント（警告以外）
- `bg-gray-50` + 白カードの構図

---

## 4. 形状（角丸・影・線）

| 項目 | ルール |
|------|--------|
| 角丸 | `rounded-none`（0px）を基本。必要なら `rounded`（4px）のみ |
| 影 | **禁止**（`shadow-*` 使用不可） |
| 区切り | `border border-[var(--border)]` のみ（1pxヘアライン） |
| カードUI | **禁止**。セクションと余白で構成する |

---

## 5. コンポーネント規約

### ボタン
```tsx
// Primary: 塗りつぶし
<button className="bg-[var(--text)] text-[var(--bg)] px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity">
  ラベル
</button>

// Secondary: 枠線のみ
<button className="border border-[var(--border)] text-[var(--text)] px-6 py-3 text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors">
  ラベル
</button>
```

### リンク
```tsx
<a className="text-[var(--text)] underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--text)]">
  リンクテキスト
</a>
```

### 入力・ドロップエリア
```tsx
// 角丸なし、影なし、ボーダーのみ
<div className="border border-dashed border-[var(--border)] p-16 text-center">
  ...
</div>
```

---

## 6. 絶対禁止リスト（AIがやりがち）

- [ ] `rounded-lg` や `rounded-xl`（大きい角丸）
- [ ] `shadow-sm`, `shadow-md` など（影全般）
- [ ] `bg-gray-50` + 白カードの構図
- [ ] `bg-blue-*`, `bg-green-*` などの色付き背景
- [ ] グラデーションボタン
- [ ] アイコン3個以上の横並び
- [ ] 1画面に複数のCTAボタン

---

## 7. セルフチェックリスト（生成後に確認）

1. **整列**: 要素の左端・右端が揃っているか
2. **余白**: セクション間が `py-24`（96px）以上あるか
3. **文字サイズ**: 5種類以内に収まっているか
4. **階層**: 見出し→本文→注釈の差が明確か
5. **行間**: 本文が `leading-relaxed` か
6. **色数**: アクセント1色（黒）だけか
7. **影**: 一切使っていないか
8. **角丸**: 0px か 4px で統一されているか
9. **カード**: 「箱に入れる」UIになっていないか
10. **CTA**: 1画面に主ボタン1個か

---

## 8. Tailwind設定メモ

```js
// tailwind.config.js に追加推奨
theme: {
  extend: {
    colors: {
      background: 'var(--bg)',
      foreground: 'var(--text)',
      muted: 'var(--text-muted)',
      border: 'var(--border)',
    },
    maxWidth: {
      'content': '1120px',
    },
    spacing: {
      '18': '4.5rem',  // 72px
      '30': '7.5rem',  // 120px
    }
  }
}
```

---

## 参考

- Apple: 余白のゆとり、階層の明確さ、写真を主役に
- [Nuevo.Tokyo](https://www.nuevo.tokyo): グリッド厳密、モノスペース、Reductionist Design
