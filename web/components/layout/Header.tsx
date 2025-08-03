'use client'

import Image from 'next/image'

import { Button } from '../ui'

import { useAuth } from '@/hooks/use-auth'

type HeaderProps = {
  onLoginClick?: () => void
}

export const Header = ({ onLoginClick }: HeaderProps) => {
    const { session, isLoading, logout } = useAuth()

    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
                <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
                    <Image
                        alt="Parrot Logo"
                        height={40}
                        src="/assets/PNG/Square/snake.png"
                        width={40}
                    />
                    <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            English Card Battle
                    </h1>
                </div>

                {isLoading ? (
                    <p>読み込み中...</p>
                ) : session ? (
                    <>
                        <p>こんにちは、{session.user?.name}さん</p>
                        <Button onClick={logout} size="lg" variant="ghost">
              サインアウト
                        </Button>
                    </>
                ) : (
                    <Button onClick={onLoginClick} size="lg" variant="ghost">
            Login
                    </Button>
                )}
            </div>
        </header>
    )
} 
