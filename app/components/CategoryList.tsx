'use client'

interface Category {
  id: string
  name: string
  type: string
  reconciliationPeriod: string
  _count?: {
    transactions: number
  }
}

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string | null
  onSelect: (categoryId: string | null) => void
  onDelete: () => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelect,
  onDelete,
}: CategoryListProps) {
  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated transactions will be deleted.')) {
      return
    }

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDelete()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const formatPeriod = (period: string) => {
    return period.toLowerCase().replace(/_/g, '-')
  }

  if (categories.length === 0) {
    return <div className="text-center py-8 text-gray-500">No categories yet</div>
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-4 py-2 rounded-md ${
          selectedCategory === null
            ? 'bg-blue-100 text-blue-900'
            : 'hover:bg-gray-100'
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <div
          key={category.id}
          className={`flex items-center justify-between px-4 py-2 rounded-md ${
            selectedCategory === category.id
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-gray-100'
          }`}
        >
          <button
            onClick={() => onSelect(category.id)}
            className="flex-1 text-left"
          >
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-gray-600">
              {category.type === 'PROFIT' ? '💰' : '💳'} {category.type.toLowerCase()} • {formatPeriod(category.reconciliationPeriod)}
            </div>
            {category._count && (
              <div className="text-xs text-gray-500">
                {category._count.transactions} transaction{category._count.transactions !== 1 ? 's' : ''}
              </div>
            )}
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}
