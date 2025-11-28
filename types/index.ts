export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  address: string
  avatar?: string
  role: 'user' | 'admin'
  status: 'active' | 'blocked'
  createdAt: string
}

export interface Account {
  id: string
  userId: string
  accountNumber: string
  accountType: 'checking' | 'savings'
  balance: number
  currency: string
  createdAt: string
}

export interface Card {
  id: string
  userId: string
  accountId: string
  cardNumber: string
  cardType: 'visa' | 'mastercard'
  expiryDate: string
  cvv: string
  cardHolderName: string
  status: 'active' | 'blocked' | 'expired'
  limit: number
  spent: number
}

export interface Transaction {
  id: string
  fromAccountId: string
  toAccountId: string
  fromUserId: string
  toUserId: string
  amount: number
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment'
  status: 'pending' | 'completed' | 'failed'
  description: string
  category: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface SpendingData {
  category: string
  amount: number
  color: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
}
