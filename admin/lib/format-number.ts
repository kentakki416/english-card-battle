/**
 * 数値を短縮形式（コンパクト形式）でフォーマットします
 * 
 * 大きな数値を読みやすい短縮形式に変換します。
 * 例: 1000 → "1K", 1500000 → "1.5M", 2000000000 → "2B"
 * 
 * @param value - フォーマットする数値
 * @returns 短縮形式でフォーマットされた文字列
 * 
 * @example
 * ```typescript
 * compactFormat(1000)     // "1K"
 * compactFormat(1500000)  // "1.5M"
 * compactFormat(2000000000) // "2B"
 * compactFormat(500)      // "500"
 * ```
 */
export const compactFormat = (value: number) => {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  })

  return formatter.format(value)
}

/**
 * 数値を標準的な小数点2桁形式でフォーマットします
 * 
 * 数値を常に小数点以下2桁で表示し、千の位区切り（カンマ）を追加します。
 * 例: 1234.567 → "1,234.57", 1000 → "1,000.00"
 * 
 * @param value - フォーマットする数値
 * @returns 標準形式でフォーマットされた文字列
 * 
 * @example
 * ```typescript
 * standardFormat(1234.567) // "1,234.57"
 * standardFormat(1000)     // "1,000.00"
 * standardFormat(123.4)    // "123.40"
 * standardFormat(0)        // "0.00"
 * ```
 */
export const standardFormat = (value: number) => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
