import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "../../../lib/utils"
import MoonIcon from "../../icons/header/MoonIcon"
import SunIcon from "../../icons/header/SunIcon"


const THEMES = [
  {
    name: "light",
    Icon: SunIcon,
  },
  {
    name: "dark",
    Icon: MoonIcon
  }
]

const ThemeToggleSwitch = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="group rounded-full bg-gray-3 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {theme === "light" ? "dark" : "light"} mode
      </span>

      <span aria-hidden className="relative flex gap-2.5">
        {/* Indicator */}
        <span className="absolute size-[38px] rounded-full border border-gray-200 bg-white transition-all dark:translate-x-[48px] dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3" />

        {THEMES.map(({ name, Icon }) => (
          <span
            key={name}
            className={cn(
              "relative grid size-[38px] place-items-center rounded-full",
              name === "dark" && "dark:text-white"
            )}
           >
            <Icon />
          </span>
        ))}
      </span>
    </button>
  )
}

export default ThemeToggleSwitch
