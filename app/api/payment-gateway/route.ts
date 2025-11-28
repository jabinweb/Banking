import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { 
      amount, 
      description, 
      recipient,
      paymentMethod, 
      accountId, 
      cardId, 
      upiId 
    } = await req.json()

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient is required' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Get user from session (simplified - in production use proper JWT verification)
    const sessionData = req.cookies.get('banking_session')?.value
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionData)
    const userId = session.userId

    let sourceAccount = null

    // Validate and process based on payment method
    if (paymentMethod === 'account') {
      if (!accountId) {
        return NextResponse.json(
          { error: 'Account ID is required' },
          { status: 400 }
        )
      }

      // Get account and check balance
      sourceAccount = await prisma.account.findFirst({
        where: {
          id: accountId,
          userId: userId,
          status: 'active'
        }
      })

      if (!sourceAccount) {
        return NextResponse.json(
          { error: 'Account not found or inactive' },
          { status: 404 }
        )
      }

      if (parseFloat(sourceAccount.balance.toString()) < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        )
      }

      // Deduct amount from account
      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount
          }
        }
      })
    } else if (paymentMethod === 'card') {
      if (!cardId) {
        return NextResponse.json(
          { error: 'Card ID is required' },
          { status: 400 }
        )
      }

      // Verify card belongs to user and is active
      const card = await prisma.card.findFirst({
        where: {
          id: cardId,
          userId: userId,
          status: 'active'
        }
      })

      if (!card) {
        return NextResponse.json(
          { error: 'Card not found or inactive' },
          { status: 404 }
        )
      }

      // For credit cards, check available limit
      if (card.cardType === 'credit' && card.availableLimit) {
        if (parseFloat(card.availableLimit.toString()) < amount) {
          return NextResponse.json(
            { error: 'Insufficient credit limit' },
            { status: 400 }
          )
        }

        // Reduce available limit
        await prisma.card.update({
          where: { id: cardId },
          data: {
            availableLimit: {
              decrement: amount
            }
          }
        })
      } else if (card.cardType === 'debit') {
        // For debit cards, find linked account and deduct
        const userAccounts = await prisma.account.findFirst({
          where: {
            userId: userId,
            status: 'active'
          },
          orderBy: {
            balance: 'desc'
          }
        })

        if (!userAccounts || parseFloat(userAccounts.balance.toString()) < amount) {
          return NextResponse.json(
            { error: 'Insufficient balance in linked account' },
            { status: 400 }
          )
        }

        sourceAccount = userAccounts
        await prisma.account.update({
          where: { id: userAccounts.id },
          data: {
            balance: {
              decrement: amount
            }
          }
        })
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        return NextResponse.json(
          { error: 'UPI ID is required' },
          { status: 400 }
        )
      }

      // Find user's primary account for UPI payment
      const userAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          status: 'active'
        },
        orderBy: {
          balance: 'desc'
        }
      })

      if (!userAccount) {
        return NextResponse.json(
          { error: 'No active account found' },
          { status: 404 }
        )
      }

      if (parseFloat(userAccount.balance.toString()) < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        )
      }

      sourceAccount = userAccount
      await prisma.account.update({
        where: { id: userAccount.id },
        data: {
          balance: {
            decrement: amount
          }
        }
      })
    } else if (paymentMethod === 'wallet') {
      // Wallet payment - simulate with primary account
      const userAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          status: 'active'
        },
        orderBy: {
          balance: 'desc'
        }
      })

      if (!userAccount) {
        return NextResponse.json(
          { error: 'No active account found' },
          { status: 404 }
        )
      }

      // Simplified wallet check - assume ₹5000 wallet balance
      if (amount > 5000) {
        return NextResponse.json(
          { error: 'Insufficient wallet balance' },
          { status: 400 }
        )
      }

      sourceAccount = userAccount
    }

    // Generate transaction reference
    const referenceId = 'PG' + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase()

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId,
        fromAccountId: sourceAccount?.id || null,
        type: 'payment',
        amount: amount,
        description: description || `Payment to ${recipient}`,
        category: 'payment',
        status: 'completed',
        paymentMethod: paymentMethod,
        referenceId: referenceId
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: userId,
        title: 'Payment Successful',
        message: `You paid ₹${amount.toLocaleString('en-IN')} to ${recipient} via ${paymentMethod}`,
        type: 'success'
      }
    })

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        referenceId: transaction.referenceId,
        amount: transaction.amount,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    })

  } catch (error: any) {
    console.error('Payment gateway error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
