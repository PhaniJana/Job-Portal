'use client'
import { auth_service, useAppData } from '@/context/AppContext';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Label } from '@/components/ui/label';
import { ArrowRight, Briefcase, File, Lock, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/loading';
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const {isAuth,setUser,loading,setIsAuth} = useAppData();
  if(isAuth) return redirect("/")
  if(loading) return <Loading/>
  const SubmitHandler = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setBtnLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone_number', phoneNumber);
    formData.append('role', role);
    if(role==='jobseeker'){
      formData.append('bio', bio);
      if(resume){
        formData.append('file', resume);
      }
    }
    try {
      const {data} = await axios.post(`${auth_service}/api/auth/register`, formData, );
      toast.success(data.message);
      Cookies.set("token",data.token,{ expires: 7 ,secure:true,path:'/'});
      setUser(data.UserObject);
      setIsAuth(true);
    } catch (error: unknown) {
        let message = "Something went wrong While registering. Please try again.";

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
        <h1 className="text-4xl font-bold text-center">Create Your ZaphHire Account</h1>
        <p className="text-sm opacity-70 p-8">Please enter your details to get started.</p>
        <div className="border border-grey-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={SubmitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className='text-sm font-medium'>i want to be a...</Label>
              <div className="relative">
                <Briefcase className="icon-style"/>
                <select id="role" value={role} onChange={(e)=>setRole(e.target.value)} className='w-full h-11 pl-10 pr-4 border-2 border-grey-300 rounded-md bg-background' required>
                  <option value="">Select Role</option>
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Employer</option>
                </select>
              </div>
              
            </div>
            {
              role && <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <Label htmlFor="name" className='text-sm font-medium'>Full Name</Label>
              <div className="relative">
                <User className="icon-style"/>
                <Input type='text' id='name' value={name} onChange={(e)=>setName(e.target.value)} placeholder='John Doe' className='input-style h-11 pl-10' required/>
              </div>
              
            </div>

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
            <div className="space-y-2">
              <Label htmlFor="phone" className='text-sm font-medium'>Phone Number</Label>
              <div className="relative">
                <Phone className="icon-style"/>
                <Input type='text' id='phone' value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} placeholder='123-456-7890' className='input-style h-11 pl-10' required/>
              </div>
              
            </div>
            {role==='jobseeker' && <div className="space-y-5 pt-4 border-t border-gray-400">
                <div className="space-y-2">
              <Label htmlFor="resume" className='text-sm font-medium'>Resume (PDF)</Label>
              <div className="relative">
                <File className="icon-style"/>
                <Input type='file' id='resume' accept='application/pdf' onChange={e=>{
                  if(e.target.files && e.target.files[0]){
                    setResume(e.target.files[0]);
                  }
                }} className='input-style h-11 cursor-pointer pl-11 ' required/>
              </div>
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className='text-sm font-medium'>Bio</Label>
              <div className="relative">
                <User className="icon-style"/>
                <Input type='text' id='bio' value={bio} onChange={(e)=>setBio(e.target.value)} placeholder='Tell us about yourself...' className='input-style h-11 pl-10' required/>
              </div>
              
            </div>
              </div>}                 
            <Button disabled={btnLoading} type='submit' className='w-full'>{btnLoading ? "Creating account..." : "Create Account"}
              <ArrowRight size={18} className='ml-2 h-4 w-4' />
            </Button>
              </div>
            }
            


            
          </form>
          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Already have an account? <Link href="/login" className="text-blue-500 font-medium hover:underline transition-all">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
