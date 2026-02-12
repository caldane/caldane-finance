'use client'

import { useState } from 'react'
import styles from './TransactionForm.module.css'

interface Category {
  id: string
  name: string
  type: string
}

interface TransactionFormProps {
  categories: Category[]
  onClose: () => void
  onSuccess: () => void
}

export default function TransactionForm({ categories, onClose, onSuccess }: TransactionFormProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [categoryId, setCategoryId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || undefined,
          date,
          categoryId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Failed to create transaction')
      }
    } catch (error) {
      setError('Failed to create transaction')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="transaction-form-title">
        <h2 id="transaction-form-title" className={styles.title}>Add Transaction</h2>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="transaction-category" className={styles.label}>
              Category
            </label>
            <select
              id="transaction-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.type === 'PROFIT' ? 'Income' : 'Spending'})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="transaction-amount" className={styles.label}>
              Amount
            </label>
            <input
              id="transaction-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className={styles.input}
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="transaction-description" className={styles.label}>
              Description (Optional)
            </label>
            <input
              id="transaction-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              placeholder="e.g., Weekly grocery shopping"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="transaction-date" className={styles.label}>
              Date
            </label>
            <input
              id="transaction-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`${styles.button} ${styles.submitButton}`}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
