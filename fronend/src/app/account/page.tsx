"use client"
import Loading from '@/components/loading';
import { useAppData } from '@/context/AppContext'
import Info from './components/info';
import Skills from './components/skills';
import Company from './components/company';
import Link from 'next/link';

const Account = () => {
    const { isAuth, user, loading } = useAppData();

    if (loading) return <Loading />

    if (!isAuth || !user) {
        return (
            <div className='max-w-3xl mx-auto px-4 py-10'>
                <h1 className='text-2xl font-semibold'>Account</h1>
                <p className='mt-3 text-muted-foreground'>Please log in to view your account details.</p>
                <Link href={'/login'} className='text-blue-500 hover:underline mt-3 inline-block'>
                    Go to Login Page 
                </Link>
            </div>
        )
    }

    return (
        <>
            {user && 
                <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={true} />
                    {
                        user.role === 'jobseeker' && <Skills user={user} isYourAccount={true} />
                    }
                    {
                        user.role === 'recruiter' && (<Company />)
                    }
                </div>
            }
        </>
    )
}

export default Account
