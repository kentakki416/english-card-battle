import { cva } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { useSidebarContext } from "./SidebarProvider"

const menuItemBaseStyles = cva(
  // 1. ベースクラス（常に適用される）
  "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200 dark:text-dark-6",
  {
    // 2. バリアント定義
    variants: {
      isActive: {
        // isActiveがtrueの場合のスタイル
        true: "bg-[rgba(87,80,241,0.07)] text-primary hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white",
        // isActiveがfalseの場合のスタイル
        false:
          "hover:bg-gray-100 hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
      },
    },
    // 3. デフォルトのバリアント
    defaultVariants: {
      isActive: false,
    },
  },
)

const MenuItem = (
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) => {
  const { toggleSidebar, isMobile } = useSidebarContext()

  if (props.as === "link") {
    return (
      <Link
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            className: "relative block py-2",
          }),
          props.className,
        )}
        href={props.href}
        // Close sidebar on clicking link if it's mobile
        onClick={() => isMobile && toggleSidebar()}
      >
        {props.children}
      </Link>
    )
  }

  return (
    <button
      aria-expanded={props.isActive}
      className={menuItemBaseStyles({
        isActive: props.isActive,
        className: "flex w-full items-center gap-3 py-3",
      })}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
export default MenuItem
