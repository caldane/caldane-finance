'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import CategoryList from './CategoryList'
import TransactionList from './TransactionList'
import CategoryForm from './CategoryForm'
import TransactionForm from './TransactionForm'
import styles from './Dashboard.module.css'

interface Category {
  id: string
  name: string
  type: string
  reconciliationPeriod: string
  _count?: {
    transactions: number
  }
}

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

export default function Dashboard() {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchTransactions()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (categoryId?: string) => {
    try {
      const url = categoryId
        ? `/api/transactions?categoryId=${categoryId}`
        : '/api/transactions'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      fetchTransactions(categoryId)
    } else {
      fetchTransactions()
    }
  }

  const handleCategoryCreated = () => {
    fetchCategories()
    setShowCategoryForm(false)
  }

  const handleCategoryDeleted = () => {
    fetchCategories()
    fetchTransactions()
  }

  const handleTransactionCreated = () => {
    fetchTransactions(selectedCategory || undefined)
    setShowTransactionForm(false)
  }

  const handleTransactionDeleted = () => {
    fetchTransactions(selectedCategory || undefined)
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Caldane Finance</h1>
          <nav className={styles.userInfo}>
            <span className={styles.userEmail}>{session?.user?.email}</span>
            <button
              onClick={() => signOut()}
              className={styles.signOutButton}
              type="button"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Categories</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className={`${styles.addButton} ${styles.addCategoryButton}`}
                type="button"
              >
                Add Category
              </button>
            </div>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
                onDelete={handleCategoryDeleted}
              />
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Transactions
                {selectedCategory && ' - Filtered'}
              </h2>
              <button
                onClick={() => setShowTransactionForm(true)}
                className={`${styles.addButton} ${styles.addTransactionButton}`}
                type="button"
              >
                Add Transaction
              </button>
            </div>
            <TransactionList
              transactions={transactions}
              onDelete={handleTransactionDeleted}
            />
          </section>
        </div>
      </main>

      {showCategoryForm && (
        <CategoryForm
          onClose={() => setShowCategoryForm(false)}
          onSuccess={handleCategoryCreated}
        />
      )}
      {showTransactionForm && (
        <TransactionForm
          categories={categories}
          onClose={() => setShowTransactionForm(false)}
          onSuccess={handleTransactionCreated}
        />
      )}
    </div>
  )
}
