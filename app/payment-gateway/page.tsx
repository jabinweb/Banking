'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Smartphone, 
  ArrowRight, 
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Landmark
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

type PaymentMethod = 'account' | 'card' | 'upi' | 'wallet' | null

export default function PaymentGatewayPage() {
  const router = useRouter()
  const { user, userAccounts, userCards, refreshUserData } = useAuth()
  const { addToast } = useToast()
  
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [recipient, setRecipient] = useState('')
  const [transactionId, setTransactionId] = useState('')
  
  // Selected payment source
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [selectedCardId, setSelectedCardId] = useState('')
  const [selectedUpiId, setSelectedUpiId] = useState('')
  
  useEffect(() => {
    // Set default account if available
    if (userAccounts && userAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(userAccounts[0].id)
    }
  }, [userAccounts, selectedAccountId])

  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep('details')
  }

  const handleProcessPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount'
      })
      return
    }

    // Validate selected payment source
    if (paymentMethod === 'account' && !selectedAccountId) {
      addToast({
        type: 'error',
        title: 'No Account Selected',
        description: 'Please select an account to proceed'
      })
      return
    }

    if (paymentMethod === 'card' && !selectedCardId) {
      addToast({
        type: 'error',
        title: 'No Card Selected',
        description: 'Please select a card to proceed'
      })
      return
    }

    // Check balance
    if (paymentMethod === 'account') {
      const selectedAccount = userAccounts?.find(acc => acc.id === selectedAccountId)
      if (selectedAccount && selectedAccount.balance < parseFloat(amount)) {
        addToast({
          type: 'error',
          title: 'Insufficient Balance',
          description: `Your account balance is ₹${selectedAccount.balance}. Please select a different payment method.`
        })
        return
      }
    }

    setStep('processing')
    
    try {
      // Create transaction in database
      const response = await fetch('/api/payment-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || 'Payment Gateway Transaction',
          recipient,
          paymentMethod,
          accountId: paymentMethod === 'account' ? selectedAccountId : undefined,
          cardId: paymentMethod === 'card' ? selectedCardId : undefined,
          upiId: paymentMethod === 'upi' ? selectedUpiId : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      setTransactionId(data.transaction.referenceId)
      setStep('success')
      
      // Refresh user data to update balances
      await refreshUserData()
      
      addToast({
        type: 'success',
        title: 'Payment Successful',
        description: `₹${amount} paid successfully`
      })
    } catch (error: any) {
      setStep('details')
      addToast({
        type: 'error',
        title: 'Payment Failed',
        description: error.message || 'Something went wrong. Please try again.'
      })
    }
  }

  const resetPayment = () => {
    setStep('method')
    setPaymentMethod(null)
    setAmount('')
    setDescription('')
    setRecipient('')
    setTransactionId('')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Gateway</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Secure payment processing powered by NexBank
            </p>
          </div>
          {step !== 'method' && step !== 'success' && (
            <Button variant="outline" onClick={resetPayment}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {/* Step: Select Payment Method */}
        {step === 'method' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹) *
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-2xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient/Merchant *
                  </label>
                  <Input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g., Amazon, Netflix, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this payment for?"
                  />
                </div>
              </div>
            </Card>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bank Account */}
                <button
                  onClick={() => handleSelectMethod('account')}
                  disabled={!amount || parseFloat(amount) <= 0 || !recipient}
                  className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Landmark className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Bank Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userAccounts?.length || 0} account(s)
                  </p>
                </button>

                {/* Credit/Debit Card */}
                <button
                  onClick={() => handleSelectMethod('card')}
                  disabled={!amount || parseFloat(amount) <= 0 || !recipient || !userCards || userCards.length === 0}
                  className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <CreditCard className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Debit/Credit Card
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userCards?.length || 0} card(s)
                  </p>
                </button>

                {/* UPI */}
                <button
                  onClick={() => handleSelectMethod('upi')}
                  disabled={!amount || parseFloat(amount) <= 0 || !recipient}
                  className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Smartphone className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    UPI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instant Payment
                  </p>
                </button>

                {/* Wallet */}
                <button
                  onClick={() => handleSelectMethod('wallet')}
                  disabled={!amount || parseFloat(amount) <= 0 || !recipient}
                  className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Wallet className="w-10 h-10 text-amber-600 dark:text-amber-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    NexBank Wallet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Digital Wallet
                  </p>
                </button>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Secure Payment:</strong> All transactions are encrypted with 256-bit SSL security. Your payment information is never stored on our servers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step: Payment Details */}
        {step === 'details' && (
          <Card className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {paymentMethod === 'account' && 'Select Bank Account'}
                  {paymentMethod === 'card' && 'Select Card'}
                  {paymentMethod === 'upi' && 'Enter UPI ID'}
                  {paymentMethod === 'wallet' && 'NexBank Wallet'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay to: {recipient}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{amount}</p>
              </div>
            </div>

            {/* Bank Account Selection */}
            {paymentMethod === 'account' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Account *
                  </label>
                  <div className="space-y-3">
                    {userAccounts?.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => setSelectedAccountId(account.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAccountId === account.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {account.accountType.toUpperCase()} Account
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {account.accountNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{account.balance.toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Available
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Card Selection */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Card *
                  </label>
                  <div className="space-y-3">
                    {userCards?.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedCardId === card.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {card.cardType.toUpperCase()} Card
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                •••• •••• •••• {card.cardNumber.slice(-4)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {card.expiryDate}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Payment Form */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    UPI ID *
                  </label>
                  <Input
                    value={selectedUpiId}
                    onChange={(e) => setSelectedUpiId(e.target.value)}
                    placeholder="yourname@paytm"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Enter your UPI ID linked to your NexBank account
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Form */}
            {paymentMethod === 'wallet' && (
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">NexBank Wallet</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Digital Wallet</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹5,000
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fast and secure payments using your NexBank Wallet balance
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment is secured with end-to-end encryption
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleProcessPayment}
                disabled={
                  (paymentMethod === 'account' && !selectedAccountId) ||
                  (paymentMethod === 'card' && !selectedCardId) ||
                  (paymentMethod === 'upi' && !selectedUpiId)
                }
                className="flex-1"
              >
                Pay ₹{amount}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <Card className="p-12 max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6 animate-pulse">
              <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please wait while we securely process your payment...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </Card>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <Card className="p-8 max-w-md mx-auto text-center border-2 border-emerald-200 dark:border-emerald-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your payment of <strong>₹{amount}</strong> has been processed successfully.
            </p>
            
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 space-y-2 text-left mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Method:</span>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              {description && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Description:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{description}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push('/transactions')}>
                View Transaction History
              </Button>
              <Button variant="outline" onClick={resetPayment}>
                Make Another Payment
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
