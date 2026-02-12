import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategoryType, ReconciliationPeriod } from '@prisma/client'

// GET /api/categories - Get all categories for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, reconciliationPeriod } = body

    // Validation
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    if (!Object.values(CategoryType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid category type' },
        { status: 400 }
      )
    }

    // Validate reconciliation period based on category type
    if (type === CategoryType.DEFICIT) {
      // Deficit categories must have monthly reconciliation
      if (reconciliationPeriod && reconciliationPeriod !== ReconciliationPeriod.MONTHLY) {
        return NextResponse.json(
          { error: 'Deficit categories must have monthly reconciliation period' },
          { status: 400 }
        )
      }
    } else if (type === CategoryType.PROFIT) {
      // Profit categories must have a valid reconciliation period
      if (!reconciliationPeriod) {
        return NextResponse.json(
          { error: 'Reconciliation period is required for profit categories' },
          { status: 400 }
        )
      }
      if (!Object.values(ReconciliationPeriod).includes(reconciliationPeriod)) {
        return NextResponse.json(
          { error: 'Invalid reconciliation period' },
          { status: 400 }
        )
      }
    }

    // Set default reconciliation period for deficit categories
    const finalReconciliationPeriod = type === CategoryType.DEFICIT
      ? ReconciliationPeriod.MONTHLY
      : reconciliationPeriod

    const category = await prisma.category.create({
      data: {
        name,
        type,
        reconciliationPeriod: finalReconciliationPeriod,
        userId: session.user.id,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
