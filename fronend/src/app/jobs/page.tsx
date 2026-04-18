'use client'
import JobCard from '@/components/job-card'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { job_service } from '@/context/AppContext'
import { Job } from '@/type'
import axios from 'axios'
import { Briefcase, Filter } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const JobPage = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')

    useEffect(()=>{
        const fetchJobs = async () => {
            setLoading(true)
            try {
                const {data} = await axios.get(`${job_service}/api/job/all?title=${title}&location=${location}`)
                setJobs(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    },[title, location])

  return (
    <div className='min-h-screen bg-secondary/30'>
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Sections */}
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Explore <span className="text-red-500">Opportunities</span>
                        </h1>
                        <p className="text-base opacity-70">
                            {jobs.length} jobs available for you
                        </p>
                    </div>
                    <Button className='gap-2 h-11'><Filter size={18}/>Filters</Button>

                </div>
                {
                    loading ? <Loading/> :<>
                    {
                        jobs && jobs.length > 0 ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                            {
                                jobs.map((job,index)=>(
                                    <JobCard key={index} job={job}/>
                                ))
                            }
                        </div> : <div className='text-center py-16'>
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <Briefcase size={40} className="text-gray-400 dark:text-gray-500 opacity-40" />
                            </div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                No jobs found
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    }
                    </>
                }
            </div>
        </div>
        
    </div>
  )
}

export default JobPage
