import { Card } from '@/components/ui/card'
import { AccountProps } from '@/type'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import {  Camera, Edit, FileText, Mail, NotepadText, Phone, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppData } from '@/context/AppContext'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const Info : React.FC<AccountProps> = ({ user, isYourAccount }) => {
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const [name,setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const {updateProfilePic, updateResume,btnLoading,updateProfile} = useAppData();
  const HandleClick = ()=>{
    inputRef.current?.click();
  }
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData);
    }
  }
  const EditHandleClick = ()=>{
    editRef.current?.click();
    setName(user?.name || "");
    setPhoneNumber(user?.phone_number || "");
    setBio(user?.bio || "");
  }

  const updateProfileHandler = ()=>{
    updateProfile(name, phoneNumber, bio);
  }

  const HandleResumeClick = ()=>{
    resumeRef.current?.click();
  }

  const changeResume = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(file) {
      if(file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      updateResume(formData);
    }
  }
  const profilePic = user?.profile_pic || "/default_user.jpg";
  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <Card className='overflow-hidden shadow-lg border-2'>
        <div className="h-32 bg-blue-500 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-background">
                <Image
                  src={profilePic}
                  width={128}
                  height={128}
                  alt="Profile Picture"
                  className='w-full h-full object-cover'
                />
              </div>
              {/*Edit option for profile picture */}
              {
                isYourAccount && <>
                <Button variant={'secondary'} size={'icon'} onClick={HandleClick} className='absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg'>
                  <Camera size={16} /> 
                </Button>
                <input type="file" className='hidden' accept='image/*' ref={inputRef} onChange={changeHandler}/>
                </>

              }
            </div>          
          </div>
        </div>
        {/* Main Content */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className='text-3xl font-bold'>{user?.name}</h1>
                {/* Edit button for user */}
                {isYourAccount && (
                  <Button variant={'ghost'} size={'icon'} onClick={EditHandleClick} className='h-8 w-8'>
                    <Edit size={18}/>
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* user bio details can go here */}
          {user.role==='jobseeker' && user.bio && <div className='mt-6 p-4 rounded-lg border'>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-70">
                <FileText size={16}/>
                <span>About</span>
              </div>
              <p className='text-base leading-6'>{user.bio}</p>
            </div>}
            <div className="mt-8">
              <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Mail size={20} className='text-blue-600' />
                <span>Contact Information</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Mail size={18} className='text-blue-600' />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className='text-xs opacity-70 font-medium'>Email</p>
                    <p className='text-xs truncate'>{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Phone size={18} className='text-blue-600' />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className='text-xs opacity-70 font-medium'>Phone</p>
                    <p className='text-xs truncate'>{user?.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
            {/**Resume Section*/}
            {user.role === 'jobseeker' && user.resume && <div className="mt-8">
              <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <NotepadText size={20} className='text-blue-600' />
                <span>Resume</span>
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <NotepadText size={20} className='text-red-600' />
                </div>
                <div className="flex-1">
                  <p className='text-sm font-medium'>Resume Document</p>
                  <Link href={user.resume} target="_blank" className='text-sm text-blue-600 hover:underline truncate block'>View Resume PDF</Link> 
                </div>
                {/* Edit Resume Button */}
                {
                  isYourAccount && <>
                  <Button variant={'outline'} size={'sm'} onClick={HandleResumeClick} className='gap-2'>
                    Update
                  </Button>
                  <input type="file" className='hidden' accept='application/pdf' ref={resumeRef} onChange={changeResume}/>
                  </>
                }
              </div>
              </div>}
        </div>
      </Card>
      {/* Dialog Box for Edit */}
      <Dialog>
        <DialogTrigger asChild>
          <Button ref = {editRef} variant={'outline'}  className='hidden'>
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-125 '>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className='text-sm font-medium flex items-center gap-2'>
                <UserIcon size={16}/> Full Name
              </Label>
              <Input id="name" value={name} className='h-11' onChange={(e)=>setName(e.target.value)} placeholder='Enter your full name' />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone" className='text-sm font-medium flex items-center gap-2'>
                <Phone size={16}/> Phone Number
              </Label>
              <Input id="phone" value={phoneNumber} className='h-11' onChange={(e)=>setPhoneNumber(e.target.value)} placeholder='Enter your phone number' />
            </div>
            {
              user.role === 'jobseeker' && <div className="space-y-2">
              <Label htmlFor="bio" className='text-sm font-medium flex items-center gap-2'>
                <FileText size={16}/> Bio
              </Label>
              <Input id="bio" value={bio} className='h-11' onChange={(e)=>setBio(e.target.value)} placeholder='Enter a short bio about yourself' />
              </div>
            }
            <DialogFooter>
              <Button disabled={btnLoading} onClick={updateProfileHandler} className='w-full h-11'>
                {btnLoading ? "Updating..." : "Update Profile"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Info
