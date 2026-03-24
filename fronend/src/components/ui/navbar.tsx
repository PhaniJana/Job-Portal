"use client"
import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from './button';
import { Briefcase, Home, Info, LogOutIcon, MenuIcon, User, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { ModeToggle } from './mode-toggle';
import { useAppData } from '@/context/AppContext';

const NavBar = () => {
    const [isopen, setIsopen] = useState(false);
    const toggleMenu=()=>{
        setIsopen(prev=>!prev);
    }
    
    const {isAuth,user,setIsAuth,setUser,loading,logOutHandler} = useAppData();
    console.log(user)
    return <nav className='z-50 stick top-0 bg-background/80 border-b backdrop:backdrop-blur-md shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
                <div className="flex items-center">
                    <Link href='/' className='flex items-center gap-1 group'>
                        <div className="text-2xl font-bold tracking-tight">
                            <span className='bg-linear-to-r from bg-blue-600 to-blue-800 bg-clip-text text-transparent'>Zaph</span>
                            <span className='text-red-500'>Hire</span>
                        </div>
                    </Link>
                </div>
                {/**  DESKTOP MENU */}
                <div className="hidden md:flex items-center space-x-1">
                    <Link href='/'>
                        <Button variant='ghost' className='flex gap-2 items-center'><Home size={16}/>Home</Button>
                    </Link>

                    <Link href='/jobs'>
                        <Button variant='ghost' className='flex gap-2 items-center'><Briefcase size={16}/>Jobs</Button>
                    </Link>

                    <Link href='/about'>
                        <Button variant='ghost' className='flex gap-2 items-center'><Info size={16}/>About</Button>
                    </Link>
                </div>
                {/**  RIGHT SIDE ACTIONS */}
                <div className="hidden md:flex items-center gap-3">
                    {
                        loading? " Loading..." : <>{
                        isAuth? <Popover>
                            <PopoverTrigger asChild>
                                <button className='flex items-center gap-2 hover:opacity-80 transition-colors'>
                                    <Avatar className='h-9 w-9 ring-2 ring-offset-2 ring-offset-background ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all'>
                                        <AvatarImage src={user?.profile_pic || ''} alt={user?.name || 'User'}/>
                                        <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600'>{user?.name?.charAt(0).toUpperCase() || 'G'}</AvatarFallback>
                                    </Avatar>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className='w-56 p-2' align='end'>
                                <div className='px-3 py-2 mb-2 border-b'>
                                    <p className='text-sm font-semibold'>{user?.name || 'John Doe'}</p>
                                    <p className='text-xs opacity-60 truncate'>{user?.email || 'john.doe@example.com'}</p>
                                </div>
                                <Link href='/account'><Button className='w-full justify-start gap-2' variant={'ghost'}><User size={16}/>Account</Button></Link>
                                <Button onClick={logOutHandler} className='w-full justify-start gap-2 mt-1' variant={'ghost'}><LogOutIcon size={16}/>Logout</Button>
                            </PopoverContent>
                        </Popover> :
                        <Link href={'/login'}><Button className='gap-2'><User size={16}/>Sign In</Button></Link>
                    }</>
                    }
                    <ModeToggle/>    
                </div>

                {/**  MOBILE MENU */}
                <div className="md:hidden flex items-center gap-2">
                    <ModeToggle/>
                    <button onClick={toggleMenu} className='p-2 rounded-lg hover:bg-accent transition-colors' aria-label='Toggle menu'>
                        {isopen? <X size={24}/>: <MenuIcon size={24}/>}
                    </button>
                </div>
            </div>
        </div>
        {/**  MOBILE MENU CONTENT */}
        {isopen && (
            <div className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${isopen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md">
                    {/**is auth */}
                    <Link href={'/'} onClick={toggleMenu}>
                        <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Home size={18}/>Home</Button>
                    </Link>
                    <Link href={'/jobs'} onClick={toggleMenu}>
                        <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Briefcase size={18}/>Jobs</Button>
                    </Link>
                    <Link href={'/about'} onClick={toggleMenu}>
                        <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Info size={18}/>About</Button>
                    </Link>
                    {
                        isAuth? (<>
                            <Link href={'/account'} onClick={toggleMenu}>
                                <Button variant='ghost' className='w-full justify-start gap-3 h-11'><User size={18}/>My Account</Button>
                            </Link>
                            <Button variant={'destructive'} className='w-full justify-start gap-3 h-11' onClick={logOutHandler}><LogOutIcon size={18}/>Logout</Button>

                        </>):(
                            <Link href={'/login'} onClick={toggleMenu}><Button className='w-full justify-start gap-3 h-11'><User size={18}/>Sign In</Button></Link>
                        )
                    }
                </div>
            </div>
        )}
    </nav>
}

export default NavBar