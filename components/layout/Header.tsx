'use client'

import { Building2, Menu, X, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="relative z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              NexBank
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Current: ${theme} mode`}
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="h-5 w-5 text-indigo-400" />
              ) : (
                <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <Link href="/login">
              <Button variant="outline" size="md" className="sm:text-base">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="md" className="sm:text-base">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex flex-col gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {theme === 'light' ? (
                  <><Sun className="h-5 w-5 text-amber-500" /> <span>Light Mode</span></>
                ) : theme === 'dark' ? (
                  <><Moon className="h-5 w-5 text-indigo-400" /> <span>Dark Mode</span></>
                ) : (
                  <><Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" /> <span>System Mode</span></>
                )}
              </button>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
