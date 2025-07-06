import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    // サーバーAPIにユーザー情報を送信
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }),
                    });

                    if (!response.ok) {
                        // サーバーAPI呼び出しエラーをログに記録
                        // TODO: 本格的なログシステムに置き換える
                    }
                } catch {
                    // サーバーAPI呼び出しエラーをログに記録
                    // TODO: 本格的なログシステムに置き換える
                }
            }
            return true;
        },
        async session({ session }) {
            return session;
        },
    },
});

export { handler as GET, handler as POST };
