import { User, Account, Card, Transaction, Notification } from '@/types'

export const users: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY 10001',
    avatar: '',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    phone: '+1 234 567 8901',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    avatar: '',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'user-3',
    email: 'admin@bank.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+1 234 567 8902',
    address: '789 Admin Blvd, Chicago, IL 60601',
    avatar: '',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'user-4',
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Johnson',
    phone: '+1 234 567 8903',
    address: '321 Pine St, Houston, TX 77001',
    avatar: '',
    role: 'user',
    status: 'blocked',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'user-5',
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Williams',
    phone: '+1 234 567 8904',
    address: '654 Elm St, Phoenix, AZ 85001',
    avatar: '',
    role: 'user',
    status: 'active',
    createdAt: '2024-04-05T10:00:00Z'
  }
]

export const accounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-1',
    accountNumber: '1234567890',
    accountType: 'checking',
    balance: 15420.50,
    currency: 'USD',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'acc-2',
    userId: 'user-1',
    accountNumber: '1234567891',
    accountType: 'savings',
    balance: 52340.00,
    currency: 'USD',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'acc-3',
    userId: 'user-2',
    accountNumber: '2345678901',
    accountType: 'checking',
    balance: 8750.25,
    currency: 'USD',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'acc-4',
    userId: 'user-2',
    accountNumber: '2345678902',
    accountType: 'savings',
    balance: 25000.00,
    currency: 'USD',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'acc-5',
    userId: 'user-4',
    accountNumber: '4567890123',
    accountType: 'checking',
    balance: 3200.00,
    currency: 'USD',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'acc-6',
    userId: 'user-5',
    accountNumber: '5678901234',
    accountType: 'checking',
    balance: 12500.75,
    currency: 'USD',
    createdAt: '2024-04-05T10:00:00Z'
  }
]

export const cards: Card[] = [
  {
    id: 'card-1',
    userId: 'user-1',
    accountId: 'acc-1',
    cardNumber: '4532015112830366',
    cardType: 'visa',
    expiryDate: '12/27',
    cvv: '123',
    cardHolderName: 'JOHN DOE',
    status: 'active',
    limit: 10000,
    spent: 2340
  },
  {
    id: 'card-2',
    userId: 'user-1',
    accountId: 'acc-2',
    cardNumber: '5425233430109903',
    cardType: 'mastercard',
    expiryDate: '08/26',
    cvv: '456',
    cardHolderName: 'JOHN DOE',
    status: 'active',
    limit: 15000,
    spent: 5200
  },
  {
    id: 'card-3',
    userId: 'user-2',
    accountId: 'acc-3',
    cardNumber: '4916338506082832',
    cardType: 'visa',
    expiryDate: '03/28',
    cvv: '789',
    cardHolderName: 'JANE SMITH',
    status: 'active',
    limit: 8000,
    spent: 1500
  }
]

export const transactions: Transaction[] = [
  {
    id: 'txn-1',
    fromAccountId: 'acc-1',
    toAccountId: 'acc-3',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    amount: 500,
    type: 'transfer',
    status: 'completed',
    description: 'Monthly rent payment',
    category: 'Housing',
    createdAt: '2024-11-28T09:30:00Z'
  },
  {
    id: 'txn-2',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 85.50,
    type: 'payment',
    status: 'completed',
    description: 'Grocery shopping at Whole Foods',
    category: 'Food & Dining',
    createdAt: '2024-11-27T14:20:00Z'
  },
  {
    id: 'txn-3',
    fromAccountId: '',
    toAccountId: 'acc-1',
    fromUserId: '',
    toUserId: 'user-1',
    amount: 3500,
    type: 'deposit',
    status: 'completed',
    description: 'Salary deposit',
    category: 'Income',
    createdAt: '2024-11-25T08:00:00Z'
  },
  {
    id: 'txn-4',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 120,
    type: 'payment',
    status: 'completed',
    description: 'Electric bill payment',
    category: 'Utilities',
    createdAt: '2024-11-24T16:45:00Z'
  },
  {
    id: 'txn-5',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 45.99,
    type: 'payment',
    status: 'completed',
    description: 'Netflix subscription',
    category: 'Entertainment',
    createdAt: '2024-11-23T12:00:00Z'
  },
  {
    id: 'txn-6',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 250,
    type: 'withdrawal',
    status: 'completed',
    description: 'ATM withdrawal',
    category: 'Cash',
    createdAt: '2024-11-22T10:30:00Z'
  },
  {
    id: 'txn-7',
    fromAccountId: 'acc-3',
    toAccountId: 'acc-1',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    amount: 150,
    type: 'transfer',
    status: 'completed',
    description: 'Payment for dinner',
    category: 'Food & Dining',
    createdAt: '2024-11-21T19:15:00Z'
  },
  {
    id: 'txn-8',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 65,
    type: 'payment',
    status: 'completed',
    description: 'Gas station',
    category: 'Transportation',
    createdAt: '2024-11-20T08:45:00Z'
  },
  {
    id: 'txn-9',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 89.99,
    type: 'payment',
    status: 'completed',
    description: 'Amazon purchase',
    category: 'Shopping',
    createdAt: '2024-11-19T15:30:00Z'
  },
  {
    id: 'txn-10',
    fromAccountId: 'acc-1',
    toAccountId: 'acc-6',
    fromUserId: 'user-1',
    toUserId: 'user-5',
    amount: 200,
    type: 'transfer',
    status: 'pending',
    description: 'Gift for birthday',
    category: 'Gifts',
    createdAt: '2024-11-28T11:00:00Z'
  },
  {
    id: 'txn-11',
    fromAccountId: '',
    toAccountId: 'acc-1',
    fromUserId: '',
    toUserId: 'user-1',
    amount: 500,
    type: 'deposit',
    status: 'completed',
    description: 'Freelance payment',
    category: 'Income',
    createdAt: '2024-11-18T09:00:00Z'
  },
  {
    id: 'txn-12',
    fromAccountId: 'acc-1',
    toAccountId: '',
    fromUserId: 'user-1',
    toUserId: '',
    amount: 35.50,
    type: 'payment',
    status: 'completed',
    description: 'Pharmacy',
    category: 'Healthcare',
    createdAt: '2024-11-17T14:00:00Z'
  }
]

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Transfer Successful',
    message: 'Your transfer of $500 to Jane Smith was successful.',
    type: 'success',
    read: false,
    createdAt: '2024-11-28T09:30:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Low Balance Alert',
    message: 'Your checking account balance is below $5,000.',
    type: 'warning',
    read: false,
    createdAt: '2024-11-27T10:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Payment Received',
    message: 'You received $150 from Jane Smith.',
    type: 'info',
    read: true,
    createdAt: '2024-11-21T19:15:00Z'
  }
]

export const spendingData = [
  { category: 'Housing', amount: 1500, color: '#6366f1' },
  { category: 'Food & Dining', amount: 650, color: '#8b5cf6' },
  { category: 'Transportation', amount: 320, color: '#a855f7' },
  { category: 'Utilities', amount: 280, color: '#d946ef' },
  { category: 'Entertainment', amount: 180, color: '#ec4899' },
  { category: 'Shopping', amount: 420, color: '#f43f5e' },
  { category: 'Healthcare', amount: 150, color: '#f97316' },
]

export const monthlyData = [
  { month: 'Jun', income: 4200, expenses: 3100 },
  { month: 'Jul', income: 4500, expenses: 3400 },
  { month: 'Aug', income: 4100, expenses: 2900 },
  { month: 'Sep', income: 4800, expenses: 3600 },
  { month: 'Oct', income: 4300, expenses: 3200 },
  { month: 'Nov', income: 5000, expenses: 3500 },
]
