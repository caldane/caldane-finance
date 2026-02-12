'use client'

import styles from './TransactionList.module.css'

interface Transaction {
  id: string
  amount: number
  description: string | null
  date: string
  category: {
    id: string
    name: string
    type: string
  }
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: () => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDelete()
      } else {
        alert('Failed to delete transaction')
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatAmount = (amount: number, type: string) => {
    const formatted = Math.abs(amount).toFixed(2)
    return type === 'PROFIT' ? `+$${formatted}` : `-$${formatted}`
  }

  if (transactions.length === 0) {
    return <section className={styles.empty}>No transactions yet</section>
  }

  return (
    <section className={styles.transactionSection}>
      <ul className={styles.transactionList}>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <article className={styles.transactionItem}>
              <header className={styles.transactionContent}>
                <span className={styles.transactionHeader}>
                  <span className={styles.categoryName}>
                    {transaction.category.name}
                  </span>
                  <span 
                    className={`${styles.amount} ${
                      transaction.category.type === 'PROFIT'
                        ? styles.amountProfit
                        : styles.amountDeficit
                    }`}
                  >
                    {formatAmount(transaction.amount, transaction.category.type)}
                  </span>
                </span>
                {transaction.description && (
                  <p className={styles.description}>{transaction.description}</p>
                )}
                <time className={styles.date} dateTime={transaction.date}>
                  {formatDate(transaction.date)}
                </time>
              </header>
              <button
                onClick={() => handleDelete(transaction.id)}
                className={styles.deleteButton}
                type="button"
                aria-label="Delete transaction"
              >
                🗑️
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
