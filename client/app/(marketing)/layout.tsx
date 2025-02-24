'use client';
import { useState } from 'react';
import { Footer } from './footer';
import { Header } from './header';
import LoginModal from './loginModal';

type Props = {
    children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(!showModal);
    return (
        <div className='min-h-screen flex flex-col'>
            <Header handleShowModal={handleShowModal}></Header>
            <main className='flex-1 flex flex-col items-center justify-center'>
                {children}
                {showModal && <LoginModal handleShowModal={handleShowModal} />}
            </main>
            <Footer></Footer>
        </div>
    );
};

export default MarketingLayout;
