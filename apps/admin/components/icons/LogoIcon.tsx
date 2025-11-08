import Image from 'next/image'

import darkLogo from '../../public/logos/dark.svg'
import logo from '../../public/logos/main.svg'

const LogoIcon = () => {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Image
        alt="EnglishCardBattle Admin Logo"
        className="dark:hidden"
        fill
        quality={100}
        role="presentation"
        src={logo}
      />
      <Image
        alt="EnglishCardBattle Admin Logo"
        className="hidden dark:block"
        fill
        quality={100}
        role="presentation"
        src={darkLogo}
      />
    </div>
  )
}

export default LogoIcon
