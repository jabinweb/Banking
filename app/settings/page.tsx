'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Moon, Sun, Bell, Shield, Lock, Eye, Smartphone, Monitor } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { addToast } = useToast()

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

  const handleSettingChange = (setting: string) => {
    addToast({
      type: 'success',
      title: 'Settings Updated',
      description: `${setting} has been updated.`
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : theme === 'system' ? <Monitor className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className={`h-6 w-6 ${theme === 'light' ? 'text-amber-500' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button
                  onClick={() => {
                    if (theme !== 'system') toggleTheme();
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Monitor className={`h-6 w-6 ${theme === 'system' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {theme === 'system' 
                  ? 'Automatically adapts to your device\'s theme settings'
                  : theme === 'dark'
                  ? 'Dark theme is active'
                  : 'Light theme is active'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch defaultChecked onCheckedChange={() => handleSettingChange('Push notifications')} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <Switch defaultChecked onCheckedChange={() => handleSettingChange('Email notifications')} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transaction Alerts</Label>
                <p className="text-sm text-gray-500">Get notified for every transaction</p>
              </div>
              <Switch defaultChecked onCheckedChange={() => handleSettingChange('Transaction alerts')} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Balance Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when balance is low</p>
              </div>
              <Switch defaultChecked onCheckedChange={() => handleSettingChange('Low balance alerts')} />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                <Smartphone className="h-4 w-4 mr-2" />
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Change Password</Label>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Activity</Label>
                <p className="text-sm text-gray-500">View recent login sessions</p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
              </div>
              <Switch onCheckedChange={() => handleSettingChange('Profile visibility')} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Transaction History</Label>
                <p className="text-sm text-gray-500">Allow others to see your transactions</p>
              </div>
              <Switch onCheckedChange={() => handleSettingChange('Transaction visibility')} />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Delete Account</Label>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
