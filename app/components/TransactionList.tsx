'use client'

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
    return <div className="text-center py-8 text-gray-500">No transactions yet</div>
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {transaction.category.name}
              </span>
              <span className={`text-sm ${
                transaction.category.type === 'PROFIT'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {formatAmount(transaction.amount, transaction.category.type)}
              </span>
            </div>
            {transaction.description && (
              <div className="text-sm text-gray-600">{transaction.description}</div>
            )}
            <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
          </div>
          <button
            onClick={() => handleDelete(transaction.id)}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}
