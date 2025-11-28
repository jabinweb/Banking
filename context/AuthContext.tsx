'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Account, Card, Transaction } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  userAccounts: Account[]
  userCards: Card[]
  userTransactions: Transaction[]
  allUsers: User[]
  allTransactions: Transaction[]
  toggleUserStatus: (userId: string) => void
  transferMoney: (fromAccountId: string, toAccountId: string, amount: number, description: string) => Promise<{ success: boolean; error?: string }>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'banking_session'
const TOKEN_KEY = 'banking_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allUsersState, setAllUsersState] = useState<User[]>([])
  const [allTransactionsState, setAllTransactionsState] = useState<Transaction[]>([])

  const refreshUserData = async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    const savedSession = localStorage.getItem(STORAGE_KEY)
    
    if (!token || !savedSession) return

    try {
      const sessionData = JSON.parse(savedSession)
      
      // Fetch user accounts
      const accountsRes = await fetch(`/api/accounts?userId=${sessionData.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (accountsRes.ok) {
        const data = await accountsRes.json()
        setAccounts(data.accounts || [])
      }

      // Fetch user transactions
      const transactionsRes = await fetch(`/api/transactions?userId=${sessionData.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (transactionsRes.ok) {
        const data = await transactionsRes.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  useEffect(() => {
    // Check localStorage for existing session
    const savedSession = localStorage.getItem(STORAGE_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (savedSession && token) {
      try {
        const sessionData = JSON.parse(savedSession)
        setUser(sessionData.user)
        refreshUserData()
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        password: '',
        name: data.user.name,
        phone: data.user.phone,
        address: '',
        role: data.user.role,
        status: 'active',
        createdAt: data.user.createdAt
      }

      setUser(userData)
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: data.user.id, user: userData }))
      
      await refreshUserData()
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' }
      }

      const newUser: User = {
        id: data.user.id,
        email: data.user.email,
        password: '',
        name: data.user.name,
        phone: data.user.phone,
        address: '',
        role: data.user.role,
        status: 'active',
        createdAt: data.user.createdAt
      }

      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: data.user.id, user: newUser }))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    setAccounts([])
    setCards([])
    setTransactions([])
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    
    const savedSession = localStorage.getItem(STORAGE_KEY)
    if (savedSession) {
      const sessionData = JSON.parse(savedSession)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...sessionData, user: updatedUser }))
    }
  }

  const toggleUserStatus = (userId: string) => {
    setAllUsersState(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
      }
      return u
    }))
  }

  const transferMoney = async (
    fromAccountId: string, 
    toAccountNumber: string, 
    amount: number, 
    description: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (!token || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          fromAccountId,
          amount,
          description,
          type: 'transfer'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Transfer failed' }
      }

      await refreshUserData()

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      userAccounts: accounts,
      userCards: cards,
      userTransactions: transactions,
      allUsers: allUsersState,
      allTransactions: allTransactionsState,
      toggleUserStatus,
      transferMoney,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
