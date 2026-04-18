'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import Link from 'next/dist/client/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ResetPage = () => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {token} = useParams();
    const router = useRouter()
    const {isAuth} = useAppData()

    useEffect(() => {
        if (isAuth) {
            router.push('/')
        }
    }, [isAuth, router])

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
    try {
        const {data} = await axios.post(`${auth_service}/api/auth/reset/${token}`, {password, token})
        toast.success(data.message)
        setPassword('')
        router.push('/login')
    } catch (error: unknown) {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.message || 'Something went wrong'
            : 'Something went wrong'
        toast.error(message)
    }  finally{
        setIsLoading(false)
    }      
    }
    if (isAuth) {
        return null
    }
  return (
    <div className='mt-20 md:mt-5 z-0'>
        <div className="md:w-1/3 border border-gray-400 rounded-lg p-8 flex flex-col w-full relative shadow-md m-auto">
        <h2 className='mb-1'><span className='text-3xl'>Reset Password</span></h2>
        
        <form onSubmit={submitHandler} className="flex flex-col justify-between mt-3">
            <div className="grid w-full max-w-sm items-center gap-1.5 ml-1">
                <Label htmlFor="password" className='text-lg mb-1'>New Password</Label>
                <Input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your new password' required className='mb-3' />
                <Button type='submit' disabled={isLoading} className='w-full'>{isLoading ? 'Resetting...' : 'Reset Password'}</Button>

            </div>
        </form>
        <Link href={'/login'} className='text-blue-500 hover:underline mt-3'>
            Go to Login Page 
        </Link>
        </div>
    </div>
  )
}

export default ResetPage
