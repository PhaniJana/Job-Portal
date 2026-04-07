"use client"
import Loading from '@/components/loading';
import { useAppData, user_service } from '@/context/AppContext';
import { User } from '@/type'
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Info from '../components/info';
import Skills from '../components/skills';

const UserAccount = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user: currentUser } = useAppData();
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                toast.error("User ID not found in URL.");
                setLoading(false);
                return;
            }


            if (!token) {
                toast.error("Token not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data } = await axios.get<User>(`${user_service}/api/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(data);
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const message = axiosError.response?.data?.message || 'Failed to fetch user data';
                setUser(null);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [currentUser, id, token]);

    if (loading) return <Loading />


    if (!user) {
        return (
            <div className='max-w-3xl mx-auto px-4 py-10'>
                <p className='text-muted-foreground'>No user data available.</p>
            </div>
        )
    }

    return (
        <>
            {user && 
                <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={false} />
                    {
                        user.role === 'jobseeker' && <Skills user={user} isYourAccount={false} />   
                    }
                </div>
            }
        </>
    )
}

export default UserAccount
