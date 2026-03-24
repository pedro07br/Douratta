import '../styles/globals.css'
import Script from 'next/script'
import { CartProvider } from '../src/context/CartContext'
import CartSidebar from '../src/components/CartSidebar/CartSidebar'
import Footer from '../src/components/Footer/Footer'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <Footer />
      <CartSidebar />
      <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"/>
      <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"/>
    </CartProvider>
  )
}