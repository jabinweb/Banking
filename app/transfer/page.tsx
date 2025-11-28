'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowRight, Loader2, Search, User, Building2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

export default function TransferPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, userAccounts, transferMoney } = useAuth()
  const { addToast } = useToast()
  
  const [selectedAccount, setSelectedAccount] = useState('')
  const [recipientAccount, setRecipientAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (userAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(userAccounts[0].id)
    }
  }, [userAccounts, selectedAccount])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const selectedAccountData = userAccounts.find(a => a.id === selectedAccount)

  const validateTransfer = () => {
    if (!selectedAccount) {
      addToast({ type: 'error', title: 'Error', description: 'Please select a source account' })
      return false
    }
    if (!recipientAccount) {
      addToast({ type: 'error', title: 'Error', description: 'Please enter recipient account number' })
      return false
    }
    if (recipientAccount.length < 10) {
      addToast({ type: 'error', title: 'Error', description: 'Account number must be at least 10 digits' })
      return false
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast({ type: 'error', title: 'Error', description: 'Please enter a valid amount' })
      return false
    }
    if (selectedAccountData && parseFloat(amount) > selectedAccountData.balance) {
      addToast({ type: 'error', title: 'Insufficient Balance', description: 'You do not have enough funds' })
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (validateTransfer()) {
      setStep(2)
    }
  }

  const handleTransfer = async () => {
    setIsTransferring(true)

    const result = await transferMoney(
      selectedAccount,
      recipientAccount,
      parseFloat(amount),
      description || 'Transfer'
    )

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Transfer Successful!',
        description: `${formatCurrency(parseFloat(amount))} has been sent successfully.`
      })
      setStep(3)
    } else {
      addToast({
        type: 'error',
        title: 'Transfer Failed',
        description: result.error
      })
    }

    setIsTransferring(false)
  }

  const resetForm = () => {
    setRecipientAccount('')
    setAmount('')
    setDescription('')
    setStep(1)
  }

  // Quick select recipients - will be fetched from API in future
  const quickRecipients: any[] = []

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transfer Money</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Send money to other accounts securely
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 rounded-full ${
                  step > s ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient and amount details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Account */}
              <div className="space-y-2">
                <Label>From Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {userAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{account.accountType}</span>
                          <span className="text-gray-500">•••• {account.accountNumber.slice(-4)}</span>
                          <span className="font-medium">{formatCurrency(account.balance)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAccountData && (
                  <p className="text-sm text-gray-500">
                    Available: {formatCurrency(selectedAccountData.balance)}
                  </p>
                )}
              </div>

              {/* Quick Recipients */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 gap-3">
                  {quickRecipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => {
                        // In real app, we'd look up their account number
                        const recipientAccount = recipient.id === 'user-2' ? '2345678901' : 
                                                 recipient.id === 'user-5' ? '5678901234' : ''
                        setRecipientAccount(recipientAccount)
                      }}
                      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-center"
                    >
                      <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium mb-2">
                        {recipient.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {recipient.name.split(' ')[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Account */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Account Number</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="recipient"
                    placeholder="Enter 10-digit account number"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 text-lg font-medium"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What's this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button onClick={handleContinue} className="w-full">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Transfer</CardTitle>
              <CardDescription>Please review the details before confirming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">From</span>
                  <span className="font-medium">
                    {selectedAccountData?.accountType} •••• {selectedAccountData?.accountNumber.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To</span>
                  <span className="font-medium">•••• {recipientAccount.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                {description && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Description</span>
                    <span className="font-medium">{description}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Please verify the recipient details. Transfers cannot be reversed once confirmed.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleTransfer} disabled={isTransferring} className="flex-1">
                  {isTransferring ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Confirm Transfer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Transfer Successful!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {formatCurrency(parseFloat(amount))} has been sent to account ending in {recipientAccount.slice(-4)}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={resetForm}>
                  New Transfer
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
