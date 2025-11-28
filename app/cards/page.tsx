'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, Unlock, Plus, Eye, EyeOff, Wifi } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, maskCardNumber } from '@/lib/utils'

export default function CardsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, userCards } = useAuth()
  const { addToast } = useToast()
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

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

  const toggleDetails = (cardId: string) => {
    setShowDetails(prev => ({ ...prev, [cardId]: !prev[cardId] }))
  }

  const handleBlockCard = (cardId: string) => {
    addToast({
      type: 'info',
      title: 'Card Action',
      description: 'This feature will be available soon.'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cards</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your debit and credit cards
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Request New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userCards.length > 0 ? (
            userCards.map((card) => (
              <div key={card.id} className="space-y-4">
                {/* Card Visual */}
                <div
                  className={`relative p-6 rounded-2xl text-white overflow-hidden aspect-[1.6/1] ${
                    card.cardType === 'visa' 
                      ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
                      : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
                  }`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 transform translate-x-20 -translate-y-20" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 transform -translate-x-20 translate-y-20" />
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white/5 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <div className="relative h-full flex flex-col justify-between">
                    {/* Top row */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center">
                          <div className="w-8 h-5 rounded-sm border border-yellow-500/50" />
                        </div>
                        <Wifi className="h-6 w-6 transform rotate-90" />
                      </div>
                      <Badge 
                        className={`${card.status === 'active' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'} border-0`}
                      >
                        {card.status}
                      </Badge>
                    </div>

                    {/* Card number */}
                    <div className="text-center">
                      <p className="text-2xl tracking-[0.2em] font-mono">
                        {showDetails[card.id] 
                          ? card.cardNumber.match(/.{1,4}/g)?.join(' ')
                          : maskCardNumber(card.cardNumber)
                        }
                      </p>
                    </div>

                    {/* Bottom row */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-white/60 uppercase mb-1">Card Holder</p>
                        <p className="font-medium tracking-wide">{card.cardHolderName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60 uppercase mb-1">Expires</p>
                        <p className="font-medium">{card.expiryDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60 uppercase mb-1">CVV</p>
                        <p className="font-medium">{showDetails[card.id] ? card.cvv : '•••'}</p>
                      </div>
                      <span className="text-2xl font-bold uppercase tracking-wider">
                        {card.cardType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Card Details</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleDetails(card.id)}
                      >
                        {showDetails[card.id] ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Card Limit</span>
                        <span className="font-medium">{formatCurrency(card.limit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount Spent</span>
                        <span className="font-medium text-red-600">{formatCurrency(card.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Available</span>
                        <span className="font-medium text-green-600">{formatCurrency(card.limit - card.spent)}</span>
                      </div>
                      
                      {/* Spending Progress */}
                      <div className="pt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                            style={{ width: `${(card.spent / card.limit) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {((card.spent / card.limit) * 100).toFixed(1)}% of limit used
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBlockCard(card.id)}>
                        {card.status === 'active' ? (
                          <>
                            <Lock className="h-4 w-4" />
                            Block Card
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4" />
                            Unblock Card
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <CreditCard className="h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <Card className="lg:col-span-2">
              <CardContent className="py-12 text-center">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Cards Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don&apos;t have any cards yet. Request a new card to get started.
                </p>
                <Button>
                  <Plus className="h-4 w-4" />
                  Request New Card
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
