'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import CategoryList from './CategoryList'
import TransactionList from './TransactionList'
import CategoryForm from './CategoryForm'
import TransactionForm from './TransactionForm'

export default function Dashboard() {
  const { data: session } = useSession()
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Caldane Finance</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{session?.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={handleCategorySelect}
                  onDelete={handleCategoryDeleted}
                />
              )}
            </div>
          </div>

          {/* Transactions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Transactions
                  {selectedCategory && ' - Filtered'}
                </h2>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Transaction
                </button>
              </div>
              <TransactionList
                transactions={transactions}
                onDelete={handleTransactionDeleted}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
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
