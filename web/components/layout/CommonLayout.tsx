'use client'

import { useState } from 'react'


import { LoginModal } from '../auth'

import { Header, Footer } from './index'

import { useGoogleAuth } from '@/hooks/use-google-auth'

type CommonLayoutProps = {
  children: React.ReactNode
}

export const CommonLayout = ({ children }: CommonLayoutProps) => {
    const [showModal, setShowModal] = useState(false)
  
    // Google認証後のAPI呼び出しを専用フックで処理
    useGoogleAuth()
  
    const handleOpenModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    return (
        <div className="flex min-h-screen flex-col">
            <Header onLoginClick={handleOpenModal} />
            {children}
            <Footer />
            {showModal && <LoginModal onClose={handleCloseModal} />}
        </div>
    )
} 
