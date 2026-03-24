import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Navbar from '../src/components/Navbar/Navbar'
import { useCart } from '../src/context/CartContext'
import styles from '../src/components/Checkout/Checkout.module.css'

export default function Confirmacao() {
  const router = useRouter()
  const { pedido } = router.query
  const { items, setIsOpen } = useCart()

  return (
    <div className="marble">
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 24, letterSpacing: 6, color: '#1a1a1a', marginBottom: 12 }}>
          PEDIDO CONFIRMADO
        </h1>
        <div style={{ width: 32, height: '0.5px', background: '#9a7c4f', margin: '16px auto' }} />
        <p style={{ fontSize: 13, color: '#9a8a78', letterSpacing: 1, marginBottom: 8 }}>
          Seu pedido #{String(pedido).padStart(3, '0')} foi recebido com sucesso!
        </p>
        <p style={{ fontSize: 12, color: '#9a8a78', letterSpacing: 1, marginBottom: 40 }}>
          Você receberá um e-mail com os detalhes do pedido em breve.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/perfil">
            <button style={{ height: 44, padding: '0 32px', background: 'transparent', color: '#9a7c4f', border: '0.5px solid #9a7c4f', fontSize: 11, letterSpacing: 3, cursor: 'pointer' }}>
              VER MEUS PEDIDOS
            </button>
          </Link>
          <Link href="/produtos">
            <button style={{ height: 44, padding: '0 32px', background: '#9a7c4f', color: 'white', border: 'none', fontSize: 11, letterSpacing: 3, cursor: 'pointer' }}>
              CONTINUAR COMPRANDO
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}