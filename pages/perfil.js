import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { deleteCookie, getCookie } from 'cookies-next'
import Navbar from '../src/components/Navbar/Navbar'
import styles from '../src/components/Profile/Profile.module.css'

export default function Perfil({ user: initialUser }) {
  const router = useRouter()
  const [panel, setPanel] = useState('dados')
  const [user, setUser] = useState(initialUser)
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [dadosForm, setDadosForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
  })

  const [senhaForm, setSenhaForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [newAddress, setNewAddress] = useState({
    label: 'PRINCIPAL',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    isMain: false,
  })

  const [showAddressForm, setShowAddressForm] = useState(false)

  useEffect(() => {
    if (panel === 'enderecos') fetchAddresses()
    if (panel === 'pedidos') fetchOrders()
  }, [panel])

  const fetchAddresses = async () => {
    const res = await fetch('/api/user/enderecos')
    const data = await res.json()
    setAddresses(data)
  }

  const fetchOrders = async () => {
    const res = await fetch('/api/user/pedidos')
    const data = await res.json()
    setOrders(data)
  }

  const notify = (msg, isError = false) => {
    if (isError) setError(msg)
    else setSuccess(msg)
    setTimeout(() => { setSuccess(''); setError('') }, 3000)
  }

  const handleDados = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/user/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosForm)
    })
    const data = await res.json()
    if (!res.ok) return notify(data.message, true)
    setUser(data)
    notify('Dados atualizados com sucesso!')
  }

  const handleSenha = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/user/senha', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(senhaForm)
    })
    const data = await res.json()
    if (!res.ok) return notify(data.message, true)
    setSenhaForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    notify('Senha atualizada com sucesso!')
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/user/enderecos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress)
    })
    if (!res.ok) return notify('Erro ao salvar endereço', true)
    setShowAddressForm(false)
    setNewAddress({ label: 'PRINCIPAL', street: '', number: '', complement: '', district: '', city: '', state: '', zipCode: '', isMain: false })
    fetchAddresses()
    notify('Endereço adicionado!')
  }

  const handleRemoveAddress = async (id) => {
    const res = await fetch('/api/user/enderecos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (!res.ok) return notify('Erro ao remover endereço', true)
    fetchAddresses()
  }

  const handleLogout = () => {
    deleteCookie('authorization')
    router.push('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'

  const statusLabel = {
    PENDING:   { label: 'PENDENTE',  style: styles.statusPending   },
    PAID:      { label: 'PAGO',      style: styles.statusPaid      },
    SHIPPED:   { label: 'ENVIADO',   style: styles.statusShipped   },
    DELIVERED: { label: 'ENTREGUE', style: styles.statusDelivered },
    CANCELLED: { label: 'CANCELADO', style: styles.statusCancelled },
  }

  return (
    <div className="marble">
      <Navbar />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>MINHA CONTA</h1>
        <p className={styles.heroSub}>BEM-VINDA DE VOLTA</p>
        <div className={styles.goldLine} />
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userEmail}>{user?.email}</div>

          {['dados', 'senha', 'enderecos', 'pedidos'].map(p => (
            <button
              key={p}
              className={`${styles.menuItem} ${panel === p ? styles.menuActive : ''}`}
              onClick={() => setPanel(p)}
            >
              {{ dados: 'DADOS PESSOAIS', senha: 'ALTERAR SENHA', enderecos: 'ENDEREÇOS', pedidos: 'HISTÓRICO DE PEDIDOS' }[p]}
            </button>
          ))}

          <div className={styles.menuDivider} />
          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            SAIR DA CONTA
          </button>
        </div>

        <div className={styles.content}>
          {success && <div className={styles.success}>{success}</div>}
          {error   && <div className={styles.error}>{error}</div>}

          {panel === 'dados' && (
            <form onSubmit={handleDados}>
              <div className={styles.sectionTitle}>DADOS PESSOAIS</div>
              <div className={styles.sectionDivider} />
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>NOME COMPLETO</div>
                  <input className={styles.fieldInput} value={dadosForm.name} onChange={e => setDadosForm({...dadosForm, name: e.target.value})} />
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>EMAIL</div>
                  <input className={styles.fieldInput} value={user?.email} disabled />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>TELEFONE</div>
                  <input className={styles.fieldInput} value={dadosForm.phone || ''} onChange={e => setDadosForm({...dadosForm, phone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>CPF</div>
                  <input className={styles.fieldInput} value={dadosForm.cpf || ''} onChange={e => setDadosForm({...dadosForm, cpf: e.target.value})} placeholder="000.000.000-00" />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn}>SALVAR ALTERAÇÕES</button>
            </form>
          )}

          {panel === 'senha' && (
            <form onSubmit={handleSenha}>
              <div className={styles.sectionTitle}>ALTERAR SENHA</div>
              <div className={styles.sectionDivider} />
              <div className={styles.field}>
                <div className={styles.fieldLabel}>SENHA ATUAL</div>
                <input className={styles.fieldInput} type="password" value={senhaForm.currentPassword} onChange={e => setSenhaForm({...senhaForm, currentPassword: e.target.value})} placeholder="••••••••" />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>NOVA SENHA</div>
                <input className={styles.fieldInput} type="password" value={senhaForm.newPassword} onChange={e => setSenhaForm({...senhaForm, newPassword: e.target.value})} placeholder="••••••••" />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>CONFIRMAR NOVA SENHA</div>
                <input className={styles.fieldInput} type="password" value={senhaForm.confirmPassword} onChange={e => setSenhaForm({...senhaForm, confirmPassword: e.target.value})} placeholder="••••••••" />
              </div>
              <button type="submit" className={styles.saveBtn}>ATUALIZAR SENHA</button>
            </form>
          )}

          {panel === 'enderecos' && (
            <div>
              <div className={styles.sectionTitle}>ENDEREÇOS</div>
              <div className={styles.sectionDivider} />
              {addresses.map(addr => (
                <div key={addr.id} className={styles.addressCard}>
                  <div>
                    <div className={styles.addressLabel}>{addr.label}</div>
                    <div className={styles.addressInfo}>
                      {addr.street}, {addr.number} {addr.complement && `— ${addr.complement}`}<br />
                      {addr.district} · {addr.city}, {addr.state}<br />
                      CEP {addr.zipCode}
                    </div>
                  </div>
                  <div className={styles.addressActions}>
                    <button className={styles.addrBtn} onClick={() => handleRemoveAddress(addr.id)}>REMOVER</button>
                  </div>
                </div>
              ))}

              {showAddressForm ? (
                <form onSubmit={handleAddAddress} className={styles.addressForm}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}><div className={styles.fieldLabel}>RUA</div><input className={styles.fieldInput} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required /></div>
                    <div className={styles.field}><div className={styles.fieldLabel}>NÚMERO</div><input className={styles.fieldInput} value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} required /></div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}><div className={styles.fieldLabel}>COMPLEMENTO</div><input className={styles.fieldInput} value={newAddress.complement} onChange={e => setNewAddress({...newAddress, complement: e.target.value})} /></div>
                    <div className={styles.field}><div className={styles.fieldLabel}>BAIRRO</div><input className={styles.fieldInput} value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} required /></div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}><div className={styles.fieldLabel}>CIDADE</div><input className={styles.fieldInput} value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required /></div>
                    <div className={styles.field}><div className={styles.fieldLabel}>ESTADO</div><input className={styles.fieldInput} value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required /></div>
                  </div>
                  <div className={styles.field}><div className={styles.fieldLabel}>CEP</div><input className={styles.fieldInput} value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} required /></div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button type="submit" className={styles.saveBtn}>SALVAR ENDEREÇO</button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setShowAddressForm(false)}>CANCELAR</button>
                  </div>
                </form>
              ) : (
                <button className={styles.addAddressBtn} onClick={() => setShowAddressForm(true)}>+ ADICIONAR ENDEREÇO</button>
              )}
            </div>
          )}

          {panel === 'pedidos' && (
            <div>
              <div className={styles.sectionTitle}>HISTÓRICO DE PEDIDOS</div>
              <div className={styles.sectionDivider} />
              {orders.length === 0 ? (
                <div className={styles.empty}>NENHUM PEDIDO ENCONTRADO</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className={styles.orderItem}>
                    <div>
                      <div className={styles.orderId}>#{String(order.id).padStart(3, '0')}</div>
                      <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      <div className={styles.orderCount}>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}</div>
                    </div>
                    <div className={styles.orderRight}>
                      <div className={styles.orderTotal}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                      </div>
                      <span className={`${styles.orderStatus} ${statusLabel[order.status]?.style}`}>
                        {statusLabel[order.status]?.label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const { getCookie } = await import('cookies-next')
  const { verifyToken } = await import('../services/auth')
  const prisma = (await import('../services/prisma')).default

  try {
    const token = getCookie('authorization', { req, res })
    if (!token) throw new Error('No token')

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, name: true, email: true, phone: true, cpf: true }
    })

    return { props: { user: JSON.parse(JSON.stringify(user)) } }
  } catch {
    return { redirect: { destination: '/login', permanent: false }, props: {} }
  }
}