'use client'
import { Card } from '@/components/ui/card';
import { Application } from '@/type'
import { Briefcase, CheckCircle2, Clock, DollarSign, EyeIcon, XCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
interface AppliedJobsProps {
    applications: Application[];
}
const AppliedJobs: React.FC<AppliedJobsProps> = ({ applications }) => {
    const GetStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hired':
                return { icon:CheckCircle2, text: 'Hired', color: ' text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-600',bg: 'bg-green-100 dark:bg-green-900/30' };
            case 'rejected':
                return { icon:XCircle, text: 'Rejected', color: ' text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-600',bg: 'bg-red-100 dark:bg-red-900/30' };
            default:
                return { icon:Clock, text: 'Applied', color: ' text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-600',bg: 'bg-blue-100 dark:bg-blue-900/30' };
        }
    }
  return (
    <div className='max-w-6xl mx-auto px-4 py-6'>
        <Card className='shadow-lg border-2 overflow-hidden'>
            <div className="bg-blue-600 text-white p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2 rounded-sm bg-blue-100 dark:bg-blue-900">
                        <Briefcase size={20} className='text-blue-600 dark:text-blue-100'/>
                    </div>
                </div>
                <h1 className="text-2xl font-bold">Your Applied Jobs</h1>
                <p className='text-sm font-bold'>{applications.length} applications</p>

            </div>

            <div className="p-6">
                {
                    applications && applications.length > 0 ? <div>
                        {
                            applications.map((app,index) => {
                                const StatusConfig = GetStatusConfig(app.status);
                                const StatusIcon = StatusConfig.icon;
                                return <div className="p-5 rounded-lg hover:border:blue-500 transition-all bg-background" key = {index}>
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semi-bold mb-3">
                                                {app.job_title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                                                        <DollarSign size={16} />
                                                            {app.job_salary ? `₹ ${app.job_salary}` : 'Salary not specified'}
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1.5 p-1.5 rounded-full border ${StatusConfig.bg} ${StatusConfig.border}`}>
                                                    <StatusIcon size={16} className={StatusConfig.color} />
                                                    <span className={`text-sm font-medium ${StatusConfig.color}`}>
                                                        {StatusConfig.text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/jobs/${app.job_id}`} className="shrink-0 flex items-center justify-between gap-2">
                                            <EyeIcon size={20} /> View Job
                                        </Link>
                                    </div>
                                </div>
                                
                            })
                        }

                    </div> : <>
                    <p>No Applications Yet</p></>
                }
            </div>
        </Card>
    </div>
  )
}

export default AppliedJobs