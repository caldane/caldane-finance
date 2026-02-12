'use client'

import { useState } from 'react'
import styles from './CategoryForm.module.css'

interface CategoryFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryForm({ onClose, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'PROFIT' | 'DEFICIT'>('DEFICIT')
  const [reconciliationPeriod, setReconciliationPeriod] = useState('MONTHLY')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          reconciliationPeriod: type === 'DEFICIT' ? 'MONTHLY' : reconciliationPeriod,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Failed to create category')
      }
    } catch (error) {
      setError('Failed to create category')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="category-form-title">
        <h2 id="category-form-title" className={styles.title}>Add Category</h2>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="category-name" className={styles.label}>
              Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="e.g., Grocery, Paycheck"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category-type" className={styles.label}>
              Type
            </label>
            <select
              id="category-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'PROFIT' | 'DEFICIT')}
              className={styles.select}
            >
              <option value="DEFICIT">Deficit (Spending)</option>
              <option value="PROFIT">Profit (Income)</option>
            </select>
          </div>

          {type === 'PROFIT' && (
            <div className={styles.formGroup}>
              <label htmlFor="reconciliation-period" className={styles.label}>
                Reconciliation Period
              </label>
              <select
                id="reconciliation-period"
                value={reconciliationPeriod}
                onChange={(e) => setReconciliationPeriod(e.target.value)}
                className={styles.select}
              >
                <option value="BIWEEKLY">Bi-weekly</option>
                <option value="SEMIMONTHLY">Semi-monthly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONETIME">One-time</option>
              </select>
            </div>
          )}

          {type === 'DEFICIT' && (
            <p className={styles.note}>
              Deficit categories always have a monthly reconciliation period.
            </p>
          )}

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
