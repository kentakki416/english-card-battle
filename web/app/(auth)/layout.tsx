import { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md">
            {children}
        </div>
    </div>
)

export default AuthLayout 
