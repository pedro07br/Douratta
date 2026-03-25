import { useState, useEffect } from 'react'
import styles from './Reviews.module.css'

const Stars = ({ rating, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          className={`${styles.star} ${s <= (hovered || rating) ? styles.starFilled : ''}`}
          onClick={() => interactive && onRate(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`)
    const data = await res.json()
    if (Array.isArray(data)) setReviews(data)
  }

  const average = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const handleSubmit = async () => {
    if (!rating) return setError('Selecione uma nota')
    if (!comment.trim()) return setError('Escreva um comentário')

    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccess(true)
      setRating(0)
      setComment('')
      fetchReviews()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>AVALIAÇÕES</div>
        <div className={styles.divider} />
      </div>

      {reviews.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.avgNumber}>{average}</div>
          <div>
            <Stars rating={Math.round(average)} />
            <div className={styles.avgCount}>{reviews.length} avaliação{reviews.length > 1 ? 'ões' : ''}</div>
          </div>
        </div>
      )}

      <div className={styles.formCard}>
        <div className={styles.formTitle}>DEIXE SUA AVALIAÇÃO</div>
        <Stars rating={rating} interactive onRate={setRating} />
        <textarea
          className={styles.textarea}
          placeholder="Conte sua experiência com este produto..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
        />
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Avaliação enviada com sucesso!</div>}
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
        </button>
      </div>

      <div className={styles.list}>
        {reviews.length === 0 ? (
          <div className={styles.empty}>NENHUMA AVALIAÇÃO AINDA. SEJA O PRIMEIRO!</div>
        ) : (
          reviews.map(r => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewAuthor}>{r.user?.name}</div>
                <div className={styles.reviewDate}>
                  {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className={styles.reviewComment}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}