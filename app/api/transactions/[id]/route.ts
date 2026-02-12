import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { amount, description, date, categoryId } = body

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Validation
    if (amount !== undefined && (typeof amount !== 'number' || amount === 0)) {
      return NextResponse.json(
        { error: 'Amount must be a non-zero number' },
        { status: 400 }
      )
    }

    // If categoryId is being updated, verify it belongs to user
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: session.user.id,
        },
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    await prisma.transaction.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
