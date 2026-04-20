'use client'
import useRazorPay from '@/components/scriptLoader'
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import axios from 'axios'
import { payment_service, useAppData } from '@/context/AppContext'
import Loading from '@/components/loading'
import { Card } from '@/components/ui/card'
import { CheckCircle, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

type RazorpayResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const Subscription = () => {
    const razorPayLoaded = useRazorPay()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const token = Cookies.get('token')
    const {setUser} = useAppData()

    const handleSubscribe = async()=>{
        if (!token) {
            toast.error('Please log in to continue.');
            return;
        }

        if (!razorPayLoaded || typeof window === 'undefined' || !window.Razorpay) {
            toast.error('Razorpay SDK failed to load. Please refresh and try again.');
            return;
        }

        setLoading(true)
        try {
            const { data } = await axios.post(`${payment_service}/api/payments/checkout`,{},{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });

            const order = data?.order;
            if (!order?.id || !order?.amount) {
                throw new Error('Invalid payment order response');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency ?? 'INR',
                name: 'Zaph Hire',
                description: 'Finding the right talent, made easy.',
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    setLoading(true)
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    try {
                        const { data } = await axios.post(`${payment_service}/api/payments/verify`, {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        toast.success('Subscription successful!');
                        setUser(data.user)
                        router.push(`/payment/success/${order.id}`)
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        toast.error('Payment verification failed. Please try again.');
                    } finally {
                        setLoading(false)
                    }
                },
                theme: {
                    color: '#F37254'
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Subscription failed:', error);
            toast.error('Subscription failed. Please try again.');            
        } finally {
            setLoading(false)
        }
    }
    if(loading) return <Loading />
  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30' >
        <Card className='max-w-md w-full p-8 text-center shadow-lg border-2'>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900">
                <Crown className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Go Premium</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Unlock exclusive features and boost your job search with our premium subscription.</p>
            <div className="mb-6">
                <p className="text-5xl font-bold text-blue-600">₹ 119</p>
                <p className="text-sm opacity-75 mt-1">Per Month</p>                  
            </div>
            <div className="space-y-3 mb-8 text-left">
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 mt-1 shringk-0" />
                    <p className="text-gray-600 dark:text-gray-400">Access to all premium features</p>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 mt-1 shringk-0" />
                    <p className="text-gray-600 dark:text-gray-400">Priority customer support</p>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 mt-1 shringk-0" />
                    <p className="text-gray-600 dark:text-gray-400">Enhanced job matching algorithm</p>
                </div>
            </div>
            <Button disabled={loading} onClick={handleSubscribe} className='w-full' size='lg'><Crown size={20} /> Subscribe Now</Button>
        </Card>
        
    </div>
  )
}

export default Subscription
