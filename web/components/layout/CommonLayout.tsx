'use client'

import { useState } from 'react'

import { LoginModal } from '../auth'

import { Header, Footer } from './index'

interface CommonLayoutProps {
  children: React.ReactNode
}

export const CommonLayout = ({ children }: CommonLayoutProps) => {
  const [showModal, setShowModal] = useState(false)
  
  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={handleOpenModal} />
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
        {showModal && <LoginModal onClose={handleCloseModal} />}
      </main>
      <Footer />
    </div>
  )
} 
