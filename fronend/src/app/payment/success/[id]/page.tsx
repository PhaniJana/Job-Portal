'use client'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

const PaymentVerification = () => {
    const { id } = useParams()
  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30'>
        <Card className='max-w-md flex items-center justify-center w-full p-8 text-center shadow-lg border-2'>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-blue-800">Payment Successful!</h2>
            <p className="mt-2 text-blue-600 dark:text-blue-400">Thank you for your payment.</p>
            <p className="mt-2 text-blue-600 dark:text-blue-400">Payment ID: {id}</p>
            <Link href={`/account`} className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Go to Account page
            </Link>
        </Card>

    </div>
  )
}

export default PaymentVerification