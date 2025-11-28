'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight, ArrowLeft, CheckCircle2, User, Building2, CreditCard, FileCheck } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type AccountType = 'savings' | 'current' | null

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Type
    accountType: null as AccountType,
    
    // Step 2: Personal Information
    fullName: user?.name || '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    
    // Step 3: Contact Information
    email: user?.email || '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Step 4: Identity Verification
    aadhaarNumber: '',
    panNumber: '',
    
    // Step 5: Nominee Details
    nomineeName: '',
    nomineeRelation: '',
    nomineeDOB: '',
    nomineeAddress: '',
    
    // Step 6: Terms
    agreedToTerms: false,
  })

  const handleNext = () => {
    if (step < 6) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // In a real app, submit to backend
    console.log('Account application submitted:', formData)
    router.push('/onboarding/success')
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
            s < step ? 'bg-emerald-500 text-white' :
            s === step ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' :
            'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
          {s < 6 && (
            <div className={`w-12 sm:w-16 h-1 mx-1 ${
              s < step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f5ff] dark:bg-[#060312] overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/50 to-indigo-200/20 dark:via-purple-900/20 dark:to-indigo-950/40" />
        <div className="absolute top-[-200px] right-[-200px] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-indigo-500/60 to-purple-600/40 blur-3xl dark:opacity-50" />
      </div>

      <Header />

      <main className="relative z-10 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Open Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete the following steps to open your {formData.accountType || ''} account
            </p>
          </div>

          {renderStepIndicator()}

          <Card className="p-6 sm:p-8 border-2 border-indigo-200/60 bg-white/95 backdrop-blur dark:border-purple-500/40 dark:bg-gray-800/70">
            {/* Step 1: Choose Account Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Account Type</h2>
                  <p className="text-gray-600 dark:text-gray-300">Select the type of account you want to open</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => updateFormData('accountType', 'savings')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                      formData.accountType === 'savings'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    <User className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Savings Account</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>✓ 4.5% interest per annum</li>
                      <li>✓ Zero minimum balance</li>
                      <li>✓ Free debit card</li>
                      <li>✓ Unlimited ATM withdrawals</li>
                    </ul>
                  </button>

                  <button
                    onClick={() => updateFormData('accountType', 'current')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                      formData.accountType === 'current'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <Building2 className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Current Account</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>✓ For businesses & professionals</li>
                      <li>✓ Zero balance requirement</li>
                      <li>✓ Unlimited transactions</li>
                      <li>✓ Overdraft facility available</li>
                    </ul>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h2>
                  <p className="text-gray-600 dark:text-gray-300">Tell us about yourself</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth *</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Father's Name *</label>
                    <Input
                      value={formData.fatherName}
                      onChange={(e) => updateFormData('fatherName', e.target.value)}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mother's Name *</label>
                    <Input
                      value={formData.motherName}
                      onChange={(e) => updateFormData('motherName', e.target.value)}
                      placeholder="Enter mother's name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h2>
                  <p className="text-gray-600 dark:text-gray-300">How can we reach you?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alternate Phone</label>
                    <Input
                      value={formData.alternatePhone}
                      onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State *</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PIN Code *</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => updateFormData('pincode', e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Identity Verification */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Identity Verification</h2>
                  <p className="text-gray-600 dark:text-gray-300">Verify your identity with government documents</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Aadhaar Card</h3>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Aadhaar Number *</label>
                        <Input
                          value={formData.aadhaarNumber}
                          onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                          placeholder="XXXX XXXX XXXX"
                          maxLength={12}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PAN Card</h3>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">PAN Number *</label>
                        <Input
                          value={formData.panNumber}
                          onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Note:</strong> These documents are required as per RBI guidelines. Your information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Nominee Details */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nominee Details</h2>
                  <p className="text-gray-600 dark:text-gray-300">Add a nominee for your account (optional but recommended)</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nominee Name</label>
                    <Input
                      value={formData.nomineeName}
                      onChange={(e) => updateFormData('nomineeName', e.target.value)}
                      placeholder="Enter nominee name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Relationship</label>
                    <select
                      value={formData.nomineeRelation}
                      onChange={(e) => updateFormData('nomineeRelation', e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nominee Date of Birth</label>
                    <Input
                      type="date"
                      value={formData.nomineeDOB}
                      onChange={(e) => updateFormData('nomineeDOB', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nominee Address</label>
                    <Input
                      value={formData.nomineeAddress}
                      onChange={(e) => updateFormData('nomineeAddress', e.target.value)}
                      placeholder="Enter nominee address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Terms & Conditions */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Confirm</h2>
                  <p className="text-gray-600 dark:text-gray-300">Please review your information and accept the terms</p>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 max-h-96 overflow-y-auto">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Type</h3>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">{formData.accountType} Account</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                    <p className="text-gray-600 dark:text-gray-300">{formData.fullName}</p>
                    <p className="text-gray-600 dark:text-gray-300">{formData.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                    <p className="text-gray-600 dark:text-gray-300">{formData.email}</p>
                    <p className="text-gray-600 dark:text-gray-300">{formData.phone}</p>
                    <p className="text-gray-600 dark:text-gray-300">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the <button className="text-indigo-600 hover:underline">Terms and Conditions</button> and <button className="text-indigo-600 hover:underline">Privacy Policy</button>. I confirm that all information provided is accurate.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < 6 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.accountType) ||
                    (step === 2 && (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.fatherName || !formData.motherName)) ||
                    (step === 3 && (!formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode)) ||
                    (step === 4 && (!formData.aadhaarNumber || !formData.panNumber))
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreedToTerms}
                >
                  Submit Application
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
