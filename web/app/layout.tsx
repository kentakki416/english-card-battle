import { Nunito } from 'next/font/google';

import './globals.css';
import NextAuthProvider from './providers';

import type { Metadata } from 'next';

const font = Nunito({
    subsets: ['latin'],
    variable: '--font-nunito',
    weight: ['200', '300', '400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: 'English Card Battle',
    description: '楽しく英語を学ぼう！',
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <NextAuthProvider>
            <html lang='ja'>
                <body className={`${font.variable} antialiased`}>
                    {children}
                </body>
            </html>
        </NextAuthProvider>
    );
};

export default RootLayout;
