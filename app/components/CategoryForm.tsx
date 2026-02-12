'use client'

import { useState } from 'react'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Category</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Grocery, Paycheck"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'PROFIT' | 'DEFICIT')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DEFICIT">Deficit (Spending)</option>
              <option value="PROFIT">Profit (Income)</option>
            </select>
          </div>

          {type === 'PROFIT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reconciliation Period
              </label>
              <select
                value={reconciliationPeriod}
                onChange={(e) => setReconciliationPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="text-sm text-gray-600 italic">
              Deficit categories always have a monthly reconciliation period.
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
