"use client"

import Image from "next/image"

import { Button } from "../ui"

import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  onLoginClick?: () => void
}

export const Header = ({ onLoginClick }: HeaderProps) => {
    const { session, isLoading, logout } = useAuth()

    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image
                        alt="Parrot Logo"
                        height={40}
                        src="/assets/PNG/Square/snake.png"
                        width={40}
                    />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
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
