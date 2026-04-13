'use client'
import { auth_service, useAppData } from '@/context/AppContext';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Label } from '@/components/ui/label';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/loading';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const {isAuth,setUser,loading,setIsAuth} = useAppData();
  if(isAuth) return redirect("/")
  if(loading) return <Loading/>
  const SubmitHandler = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setBtnLoading(true);
    try {
      const {data} = await axios.post(`${auth_service}/api/auth/login`,{email,password});
      toast.success(data.message);
      Cookies.set("token",data.token);
      setUser(data.UserObject);
      setIsAuth(true);
    } catch (error: unknown) {
        let message = "Something went wrong While logging in. Please try again.";

        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }

        toast.error(message);
        setIsAuth(false);
      }
    finally{
      setBtnLoading(false);
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">Welcome Back to ZaphHire</h1>
        <p className="text-sm opacity-70 p-8">Please enter your credentials to access your account.</p>
        <div className="border border-grey-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={SubmitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className='text-sm font-medium'>Email Address</Label>
              <div className="relative">
                <Mail className="icon-style"/>
                <Input type='email' id='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='johndoe@example.com' className='input-style h-11 pl-10' required/>
              </div>
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className='text-sm font-medium'>Password</Label>
              <div className="relative">
                <Lock className="icon-style"/>
                <Input type='password' id='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='••••••••' className='input-style h-11 pl-10' required/>
              </div>
              
            </div>
            <div className="flex items-center justify-end">
              <Link href="/forgot" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button disabled={btnLoading} type='submit' className='w-full'>{btnLoading ? "Logging in..." : "Login"}
              <ArrowRight size={18} className='ml-2 h-4 w-4' />
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Do not have an account? <Link href="/register" className="text-blue-500 font-medium hover:underline transition-all">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
