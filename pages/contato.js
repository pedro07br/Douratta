import { useState } from 'react'
import Navbar from '../src/components/Navbar/Navbar'
import styles from '../src/components/Contato/Contato.module.css'

export default function Contato() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="marble">
      <Navbar />

      <div className={styles.hero}>
        <div className={styles.heroTag}>ATENDIMENTO</div>
        <h1 className={styles.heroTitle}>FALE CONOSCO</h1>
        <div className={styles.heroDivider} />
      </div>

      <div className={styles.layout}>
        <div>
          <div className={styles.infoTitle}>ENTRE EM CONTATO</div>
          <div className={styles.infoDivider} />
          <p className={styles.infoText}>
            Estamos aqui para ajudá-la a encontrar a joia perfeita. Entre em contato conosco por qualquer um dos canais abaixo.
          </p>

          {[
            { icon: '@', label: 'EMAIL',    value: 'contato@douratta.com' },
            { icon: '☎', label: 'TELEFONE', value: '(11) 99999-0000'      },
            { icon: '◎', label: 'ENDEREÇO', value: 'Rua das Joias, 100 · São Paulo, SP' },
            { icon: '◷', label: 'HORÁRIO',  value: 'Seg–Sex, 9h às 18h'   },
          ].map((item, i) => (
            <div key={i} className={styles.contactItem}>
              <div className={styles.contactIcon}>{item.icon}</div>
              <div>
                <div className={styles.contactLabel}>{item.label}</div>
                <div className={styles.contactValue}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.formCard}>
          {sent ? (
            <div className={styles.successMsg}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, letterSpacing: 3, color: '#1a1a1a', marginBottom: 8 }}>MENSAGEM ENVIADA</div>
              <div style={{ fontSize: 12, color: '#9a8a78', letterSpacing: 1 }}>Entraremos em contato em breve.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formTitle}>ENVIAR MENSAGEM</div>
              <div className={styles.formDivider} />
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>NOME</div>
                  <input className={styles.fieldInput} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ana Silva" required />
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>EMAIL</div>
                  <input className={styles.fieldInput} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ana@email.com" required />
                </div>
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>ASSUNTO</div>
                <input className={styles.fieldInput} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Como posso ajudá-la?" required />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>MENSAGEM</div>
                <textarea className={styles.fieldInput} rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Escreva sua mensagem..." required />
              </div>
              <button type="submit" className={styles.sendBtn}>ENVIAR MENSAGEM</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}