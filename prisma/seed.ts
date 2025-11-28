import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '+919876543210',
      role: 'user',
      isVerified: true
    }
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bank.com' },
    update: {},
    create: {
      email: 'admin@bank.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      phone: '+919999999999',
      role: 'admin',
      isVerified: true
    }
  })

  console.log('✅ Users created:', { user1: user1.email, admin: admin.email })

  // Create profiles
  await prisma.profile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      fatherName: 'Robert Doe',
      motherName: 'Mary Doe',
      maritalStatus: 'Single',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      nomineeNames: 'Jane Doe',
      nomineeRelation: 'Sister',
      nomineePhone: '+919876543211'
    }
  })

  console.log('✅ Profiles created')

  // Create KYC records
  await prisma.kYC.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      status: 'approved',
      verifiedAt: new Date()
    }
  })

  console.log('✅ KYC records created')

  // Create bank accounts
  const savingsAccount = await prisma.account.upsert({
    where: { accountNumber: 'NXB1234567890001' },
    update: {},
    create: {
      userId: user1.id,
      accountNumber: 'NXB1234567890001',
      accountType: 'savings',
      balance: 50000,
      currency: 'INR',
      interestRate: 4.5,
      status: 'active'
    }
  })

  const currentAccount = await prisma.account.upsert({
    where: { accountNumber: 'NXB1234567890002' },
    update: {},
    create: {
      userId: user1.id,
      accountNumber: 'NXB1234567890002',
      accountType: 'current',
      balance: 100000,
      currency: 'INR',
      status: 'active'
    }
  })

  console.log('✅ Bank accounts created')

  // Create sample transactions
  const transactions = [
    {
      userId: user1.id,
      toAccountId: savingsAccount.id,
      type: 'credit',
      amount: 50000,
      description: 'Initial deposit',
      status: 'completed',
      referenceId: 'TXN' + Date.now() + '001'
    },
    {
      userId: user1.id,
      fromAccountId: savingsAccount.id,
      type: 'debit',
      amount: 5000,
      description: 'ATM Withdrawal',
      category: 'cash',
      status: 'completed',
      referenceId: 'TXN' + Date.now() + '002'
    },
    {
      userId: user1.id,
      fromAccountId: savingsAccount.id,
      type: 'debit',
      amount: 1500,
      description: 'Online Shopping',
      category: 'shopping',
      paymentMethod: 'card',
      status: 'completed',
      referenceId: 'TXN' + Date.now() + '003'
    },
    {
      userId: user1.id,
      toAccountId: savingsAccount.id,
      type: 'credit',
      amount: 25000,
      description: 'Salary Credit',
      status: 'completed',
      referenceId: 'TXN' + Date.now() + '004'
    }
  ]

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction })
  }

  console.log('✅ Sample transactions created')

  // Create cards
  await prisma.card.create({
    data: {
      userId: user1.id,
      cardNumber: '4532123456789012',
      cardType: 'debit',
      cardNetwork: 'visa',
      cvv: '123',
      expiryMonth: 12,
      expiryYear: 2028,
      cardholderName: 'JOHN DOE',
      status: 'active',
      isVirtual: false
    }
  })

  await prisma.card.create({
    data: {
      userId: user1.id,
      cardNumber: '5425123456789013',
      cardType: 'credit',
      cardNetwork: 'mastercard',
      cvv: '456',
      expiryMonth: 6,
      expiryYear: 2029,
      cardholderName: 'JOHN DOE',
      creditLimit: 100000,
      availableLimit: 85000,
      status: 'active',
      isVirtual: false
    }
  })

  console.log('✅ Cards created')

  // Create a loan
  await prisma.loan.create({
    data: {
      userId: user1.id,
      loanType: 'personal',
      loanAmount: 200000,
      interestRate: 12.5,
      tenure: 24,
      emi: 9500,
      outstandingAmount: 150000,
      paidAmount: 50000,
      status: 'active',
      applicationDate: new Date('2024-01-15'),
      approvalDate: new Date('2024-01-20')
    }
  })

  console.log('✅ Loan created')

  // Create investments
  await prisma.investment.create({
    data: {
      userId: user1.id,
      investmentType: 'fd',
      amount: 100000,
      interestRate: 7.5,
      maturityDate: new Date('2025-12-31'),
      currentValue: 107500,
      returns: 7500,
      status: 'active'
    }
  })

  await prisma.investment.create({
    data: {
      userId: user1.id,
      investmentType: 'mutual_fund',
      amount: 50000,
      currentValue: 58000,
      returns: 8000,
      status: 'active'
    }
  })

  console.log('✅ Investments created')

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Welcome to NexBank',
      message: 'Your account has been successfully activated!',
      type: 'success'
    }
  })

  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Transaction Alert',
      message: 'Your recent transaction of ₹1,500 was successful',
      type: 'info'
    }
  })

  console.log('✅ Notifications created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
