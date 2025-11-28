'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Home, CreditCard, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function OnboardingSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Confetti or celebration animation could be added here
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f5ff] dark:bg-[#060312] overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/50 to-indigo-200/20 dark:via-purple-900/20 dark:to-indigo-950/40" />
        <div className="absolute top-[-200px] right-[-200px] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-indigo-500/60 to-purple-600/40 blur-3xl dark:opacity-50" />
      </div>

      <Header />

      <main className="relative z-10 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-12 text-center border-2 border-emerald-200/60 bg-white/95 backdrop-blur dark:border-emerald-500/40 dark:bg-gray-800/70">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully!
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Thank you for choosing NexBank. Your account application has been received and is being processed.
            </p>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 mb-8">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">What happens next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Verification (24-48 hours)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Our team will verify your documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Account Activation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">You'll receive account credentials via email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Debit Card Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Card will be delivered within 7 working days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <Home className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Go to Dashboard</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Track Application</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Explore Services</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push('/dashboard')} size="lg">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} size="lg">
                Back to Home
              </Button>
            </div>

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Application Reference ID: <span className="font-mono font-semibold">NXB{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
