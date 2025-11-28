import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      userId,
      accountType,
      personalInfo,
      contactInfo,
      kycInfo,
      nomineeInfo
    } = data

    // Create profile
    await prisma.profile.create({
      data: {
        userId,
        dateOfBirth: personalInfo.dob ? new Date(personalInfo.dob) : null,
        gender: personalInfo.gender,
        fatherName: personalInfo.fatherName,
        motherName: personalInfo.motherName,
        maritalStatus: personalInfo.maritalStatus,
        address: contactInfo.address,
        city: contactInfo.city,
        state: contactInfo.state,
        pincode: contactInfo.pincode,
        nomineeNames: nomineeInfo?.name,
        nomineeRelation: nomineeInfo?.relation,
        nomineePhone: nomineeInfo?.phone
      }
    })

    // Create KYC record
    await prisma.kYC.create({
      data: {
        userId,
        aadhaarNumber: kycInfo.aadhaar,
        panNumber: kycInfo.pan,
        status: 'pending'
      }
    })

    // Generate account number
    const accountNumber = 'NXB' + Date.now() + Math.floor(Math.random() * 10000)

    // Create bank account
    const account = await prisma.account.create({
      data: {
        userId,
        accountNumber,
        accountType: accountType.toLowerCase(),
        balance: 0,
        interestRate: accountType === 'savings' ? 4.5 : null,
        status: 'active'
      }
    })

    return NextResponse.json({
      message: 'Account application submitted successfully',
      accountNumber: account.accountNumber
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
