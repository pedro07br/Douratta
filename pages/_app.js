import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'
import { CartProvider } from '../src/context/CartContext'
import CartSidebar from '../src/components/CartSidebar/CartSidebar'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      <CartSidebar />
      <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"/>
      <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"/>
    </CartProvider>
  )
}