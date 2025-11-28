'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Building2,
  ArrowRight,
  ArrowUpRight,
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  Smartphone,
  TrendingUp,
  LineChart,
  Sparkles,
  Users,
  Handshake,
  Wallet,
  Briefcase,
  PiggyBank,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  return (
    <div className="min-h-screen bg-[#f8f5ff] dark:bg-[#060312] overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/50 to-indigo-200/20 dark:via-purple-900/20 dark:to-indigo-950/40" />
        <div className="absolute top-[-200px] right-[-200px] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-indigo-500/60 to-purple-600/40 blur-3xl dark:opacity-50" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-pink-500/60 to-purple-500/40 blur-3xl dark:opacity-50" />
      </div>

      <Header />

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Hero */}
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6 sm:space-y-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/70 text-purple-700 shadow-sm dark:bg-white/10 dark:text-purple-200">
                <Sparkles className="h-4 w-4" />
                Small Finance Bank
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Complete banking Solution in One Place.
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 max-w-2xl">
                Open savings/current accounts with zero balance, get instant loans, invest in FDs & mutual funds, or join as an agent. Your complete financial partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                    Get Started
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { label: 'Active accounts', value: '75,000+', sub: 'savings & current' },
                  { label: 'Zero balance', value: '₹0', sub: 'minimum balance' },
                  { label: 'Customer rating', value: '4.8/5', sub: 'from 75k+ users' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border-2 border-indigo-200/60 bg-white/90 p-4 text-left shadow-lg backdrop-blur dark:border-purple-500/40 dark:bg-gray-800/60"
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-3xl rounded-3xl" />
              <div className="relative rounded-[32px] border-2 border-indigo-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-purple-500/50 dark:bg-gray-800/70">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Welcome to NexBank</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">Your Financial Hub</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {[
                      {
                        icon: PiggyBank,
                        title: 'Savings Account',
                        value: 'Earn 4.5% interest',
                        accent: 'from-emerald-500/20 to-teal-500/20',
                      },
                      {
                        icon: Briefcase,
                        title: 'Current Account',
                        value: 'Zero balance required',
                        accent: 'from-indigo-500/20 to-purple-500/20',
                      },
                      {
                        icon: TrendingUp,
                        title: 'Personal Loans',
                        value: 'Up to ₹5 lakh instantly',
                        accent: 'from-amber-500/20 to-orange-500/20',
                      },
                      {
                        icon: ShieldCheck,
                        title: 'Investments',
                        value: 'FD, RD & mutual funds',
                        accent: 'from-purple-500/20 to-pink-500/20',
                      },
                    ].map(({ icon: Icon, title, value, accent }) => (
                      <div
                        key={title}
                        className="flex items-center gap-3 rounded-xl border border-indigo-100/80 bg-white/60 p-3 dark:border-purple-500/20 dark:bg-white/5"
                      >
                        <div className={`rounded-xl bg-gradient-to-br ${accent} p-2.5`}>
                          <Icon className="h-4 w-4 text-indigo-600 dark:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/register" className="block">
                    <Button className="w-full" size="lg">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Partner logos */}
          <div className="rounded-3xl border-2 border-indigo-200/60 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-purple-500/40 dark:bg-gray-800/60">
            <p className="text-sm uppercase tracking-[0.3em] text-center text-gray-600 dark:text-gray-300 mb-4">
              SERVING CUSTOMERS & AGENTS NATIONWIDE
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base font-semibold">
              {['2,000+ Agents', 'MSMEs', 'Self-Employed', 'Salaried', 'Rural Areas'].map((brand) => (
                <span key={brand} className="tracking-wider opacity-80">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Feature grid */}
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-300">Our Services</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Banking, lending, investments & agent network
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Open zero-balance accounts, get instant loans, invest smartly, or become our agent. Complete financial services under one roof.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Savings Account',
                  copy: 'Zero minimum balance. 4.5% interest. Free debit card. Unlimited ATM withdrawals. Open in 5 minutes.',
                  Icon: PiggyBank,
                },
                {
                  title: 'Current Account',
                  copy: 'Zero balance business account. Free transactions. Overdraft facility. Digital statements. Cheque book free.',
                  Icon: Briefcase,
                },
                {
                  title: 'Personal Loans',
                  copy: 'Quick personal loans from ₹10,000 to ₹5,00,000. Minimal documentation, instant approval.',
                  Icon: CreditCard,
                },
                {
                  title: 'Fixed Deposits',
                  copy: 'Earn up to 9.5% returns. Flexible tenures from 6 months to 10 years. Premature withdrawal allowed.',
                  Icon: ShieldCheck,
                },
                {
                  title: 'Mutual Funds',
                  copy: 'SIP starting from ₹500. Diversified portfolios. Expert fund management with high returns.',
                  Icon: LineChart,
                },
                {
                  title: 'Agent Network',
                  copy: 'Become our agent. Earn 0.5-2% commission on loans and 0.25% on investments. Work from anywhere.',
                  Icon: Users,
                },
              ].map(({ title, copy, Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border-2 border-indigo-200/60 bg-white/95 p-6 text-left shadow-xl backdrop-blur transition-transform hover:-translate-y-1 dark:border-purple-500/40 dark:bg-gray-800/70"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/20 p-3 text-indigo-600 dark:text-purple-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Benefits Section */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-300">Agent Program</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Earn unlimited income as our partner agent
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join our growing network of 2,000+ agents. Work flexible hours, earn attractive commissions, and grow your income.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Commission', value: '0.5-2%', desc: 'on every loan disbursed' },
                { label: 'Investment bonus', value: '0.25%', desc: 'on deposits & funds' },
                { label: 'Monthly potential', value: '₹50K-2L', desc: 'based on performance' },
                { label: 'Training', value: 'Free', desc: 'comprehensive support' },
              ].map((benefit) => (
                <div
                  key={benefit.label}
                  className="rounded-2xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center shadow-lg dark:border-emerald-500/40 dark:from-emerald-900/20 dark:to-teal-900/20"
                >
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{benefit.value}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{benefit.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{benefit.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-indigo-200/60 bg-white/95 p-6 dark:border-purple-500/40 dark:bg-gray-800/70">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to become a partner agent?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Zero investment. Work from home. Unlimited earning potential.
                  </p>
                </div>
                <Link href="/register">
                  <Button size="lg" className="whitespace-nowrap">
                    <Handshake className="mr-2 h-5 w-5" />
                    Join as Agent
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-[32px] border border-white/60 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center text-white shadow-2xl dark:border-white/10">
            <h3 className="text-3xl font-bold mb-3">Your complete financial partner</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              Open accounts, get loans, invest wisely, or become an agent. Join 75,000+ satisfied customers today.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg font-semibold">
                  <Wallet className="mr-2 h-5 w-5" />
                  Open Account
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-lg font-semibold text-white border-white/60 hover:bg-white/10">
                  <Handshake className="mr-2 h-5 w-5" />
                  Become an Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
