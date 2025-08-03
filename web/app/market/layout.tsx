import Footer from './Footer'
import Header from './Header'

type MarketLayoutProps = {
  children: React.ReactNode
}

const MarketLayout = ({ children }: MarketLayoutProps) => {
  return (

    <div className="flex min-h-screen flex-col">
      <Header />
        <main className="flex flex-1 flex-col items-center justify-center">
          {children}
        </main>
      <Footer />
    </div>
  )
}

export default MarketLayout
