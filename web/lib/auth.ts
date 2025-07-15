import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, account }: any) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
              token.accessToken = account.access_token
            }
            return token
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async session({ session, token }: any) {
            // Send properties to the client, like an access_token from a provider.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (session as any).accessToken = (token as any).accessToken
            return session
          }
    }
} 
