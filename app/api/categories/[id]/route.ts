import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategoryType, ReconciliationPeriod } from '@prisma/client'

// GET /api/categories/[id] - Get a specific category
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

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update a category
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
    const { name, type, reconciliationPeriod } = body

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Validation
    if (type && !Object.values(CategoryType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid category type' },
        { status: 400 }
      )
    }

    const finalType = type || existingCategory.type

    // Validate reconciliation period based on category type
    if (finalType === CategoryType.DEFICIT) {
      // Deficit categories must have monthly reconciliation
      if (reconciliationPeriod && reconciliationPeriod !== ReconciliationPeriod.MONTHLY) {
        return NextResponse.json(
          { error: 'Deficit categories must have monthly reconciliation period' },
          { status: 400 }
        )
      }
    } else if (finalType === CategoryType.PROFIT) {
      // Profit categories must have a valid reconciliation period
      if (reconciliationPeriod && !Object.values(ReconciliationPeriod).includes(reconciliationPeriod)) {
        return NextResponse.json(
          { error: 'Invalid reconciliation period' },
          { status: 400 }
        )
      }
    }

    // Set default reconciliation period for deficit categories
    const finalReconciliationPeriod = finalType === CategoryType.DEFICIT
      ? ReconciliationPeriod.MONTHLY
      : (reconciliationPeriod || existingCategory.reconciliationPeriod)

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        reconciliationPeriod: finalReconciliationPeriod,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
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

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
