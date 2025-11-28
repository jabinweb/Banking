import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      fromAccountId,
      toAccountId,
      amount,
      description,
      paymentMethod,
      type = 'payment'
    } = await request.json()

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Generate reference ID
    const referenceId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase()

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        fromAccountId: fromAccountId || null,
        toAccountId: toAccountId || null,
        type,
        amount,
        description,
        paymentMethod,
        referenceId,
        status: 'completed'
      }
    })

    // If it's a debit transaction, update account balance
    if (fromAccountId) {
      await prisma.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount
          }
        }
      })
    }

    // If it's a credit transaction, update account balance
    if (toAccountId) {
      await prisma.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount
          }
        }
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Payment Successful',
        message: `Your payment of ₹${amount} has been processed successfully.`,
        type: 'success'
      }
    })

    return NextResponse.json({
      message: 'Transaction successful',
      transaction,
      referenceId
    })
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        fromAccount: true,
        toAccount: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Fetch transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
