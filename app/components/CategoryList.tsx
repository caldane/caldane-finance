'use client'

import styles from './CategoryList.module.css'

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
    return <div className={styles.empty}>No categories yet</div>
  }

  return (
    <ul className={styles.categoryList}>
      <li>
        <button
          onClick={() => onSelect(null)}
          className={`${styles.allCategoriesButton} ${selectedCategory === null ? styles.selected : ''}`}
          type="button"
        >
          All Categories
        </button>
      </li>
      {categories.map((category) => (
        <li key={category.id}>
          <article
            className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.selected : ''}`}
          >
            <button
              onClick={() => onSelect(category.id)}
              className={styles.categoryButton}
              type="button"
            >
              <div className={styles.categoryName}>{category.name}</div>
              <div className={styles.categoryMeta}>
                <span>{category.type === 'PROFIT' ? '💰' : '💳'}</span>
                <span>{category.type.toLowerCase()}</span>
                <span>•</span>
                <span>{formatPeriod(category.reconciliationPeriod)}</span>
              </div>
              {category._count && (
                <small className={styles.categoryCount}>
                  {category._count.transactions} transaction{category._count.transactions !== 1 ? 's' : ''}
                </small>
              )}
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className={styles.deleteButton}
              type="button"
              aria-label="Delete category"
            >
              🗑️
            </button>
          </article>
        </li>
      ))}
    </ul>
  )
}
