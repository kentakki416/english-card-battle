import Image from "next/image"

import darkLogo from "../../public/logos/dark.svg"
import logo from "../../public/logos/main.svg"

const LogoIcon = () => {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="EnglishCardBattle Admin Logo"
        role="presentation"
        quality={100}
      />
      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="EnglishCardBattle Admin Logo"
        role="presentation"
        quality={100}
      />
    </div>
  )
}

export default LogoIcon
