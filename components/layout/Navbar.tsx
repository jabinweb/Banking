'use client'

import { Menu, Bell, Sun, Moon, Monitor, Search } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5 text-amber-500" />
      case 'dark':
        return <Moon className="h-5 w-5 text-indigo-400" />
      case 'system':
        return <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 bg-gray-100/50 dark:bg-gray-800/50 border-0"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl relative group"
            title={`Current: ${theme} mode - Click to cycle`}
          >
            {getThemeIcon()}
            <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
            </span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="rounded-xl relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Administrator' : 'Personal Account'}
              </p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
