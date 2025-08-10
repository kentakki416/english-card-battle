import MobileHeader from '../../components/layout/MobileHeader'
import Sidebar from '../../components/layout/Sidebar'

type LearnLayoutProps = {
  children: React.ReactNode
}

const LearnLayout = ({ children }: LearnLayoutProps) => {
  return (
    <>
    <MobileHeader />
    <Sidebar className="hidden lg:flex" />
    <main className="min-h-screen pt-[50px] lg:pl-[256px] lg:pt-0">
      <div className="min-h-screen bg-red-500">
        {children}
      </div>
    </main>
    </>
  )
}

export default LearnLayout
