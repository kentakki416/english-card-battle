import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 850

/**
 * モバイルかどうかを判定する
 * @returns モバイルかどうか
 */
export const useIsMobile = () => {
  // モバイル判定の状態を管理（初期値はfalse）
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // MediaQueryListを作成（850px未満をモバイルと判定）
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1})px`)

    // 初期判定
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // ウィンドウサイズ変更時のイベントリスナーを設定して、ウィンドウがリサイズされるたびにモバイル判定を更新する
    mql.addEventListener("change", () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT))

    // メモリリークを防ぐために、コンポーネントがアンマウントされる際にイベントリスナーを削除
    return () => mql.removeEventListener("change", () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT))
  }, [])

  return isMobile
}
