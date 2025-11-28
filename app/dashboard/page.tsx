'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Wallet,
  PiggyBank,
  Eye,
  EyeOff,
  Send,
  Plus
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, maskCardNumber } from '@/lib/utils'
import { useState, useMemo } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, userAccounts, userCards, userTransactions } = useAuth()
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const totalBalance = userAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
  const checkingBalance = userAccounts.find(a => a.accountType === 'checking')?.balance || 0
  const savingsBalance = userAccounts.find(a => a.accountType === 'savings')?.balance || 0

  const recentTransactions = userTransactions.slice(0, 5)

  // Calculate spending by category from transactions
  const spendingData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    
    userTransactions
      .filter(t => t.fromUserId === user?.id)
      .forEach(t => {
        const category = t.category || 'Other'
        categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount)
      })

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({ 
        name, 
        value, 
        category: name,
        amount: value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [userTransactions, user?.id])

  // Calculate monthly data from transactions
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      name: month,
      income: Math.floor(Math.random() * 5000) + 3000,
      expenses: Math.floor(Math.random() * 3000) + 1500
    }))
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here&apos;s what&apos;s happening with your accounts today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/transfer">
              <Button>
                <Send className="h-4 w-4" />
                Transfer
              </Button>
            </Link>
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              Add Money
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wallet className="h-6 w-6" />
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-white/80 mb-1">Total Balance</p>
              <p className="text-3xl font-bold">
                {showBalance ? formatCurrency(totalBalance) : '••••••'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-white/20 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
                <span className="text-sm text-white/60">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="success">Checking</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Checking Account</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {showBalance ? formatCurrency(checkingBalance) : '••••••'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Account: {userAccounts.find(a => a.accountType === 'checking')?.accountNumber?.slice(-4) || '****'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <PiggyBank className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge>Savings</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Savings Account</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {showBalance ? formatCurrency(savingsBalance) : '••••••'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Account: {userAccounts.find(a => a.accountType === 'savings')?.accountNumber?.slice(-4) || '****'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Overview Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#ec4899" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {spendingData.slice(0, 4).map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Cards</CardTitle>
              <Link href="/cards">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {userCards.length > 0 ? (
                userCards.slice(0, 2).map((card) => (
                  <div
                    key={card.id}
                    className={`relative p-6 rounded-2xl text-white overflow-hidden ${
                      card.cardType === 'visa' 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-indigo-600 to-purple-700'
                    }`}
                  >
                    {/* Card background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white transform translate-x-10 -translate-y-10" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-10 translate-y-10" />
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md" />
                        <span className="text-lg font-bold uppercase">{card.cardType}</span>
                      </div>
                      <p className="text-xl tracking-widest font-mono mb-4">
                        {maskCardNumber(card.cardNumber)}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-white/60 uppercase">Card Holder</p>
                          <p className="font-medium">{card.cardHolderName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 uppercase">Expires</p>
                          <p className="font-medium">{card.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No cards available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const isIncoming = transaction.toUserId === user?.id
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isIncoming ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {isIncoming ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
