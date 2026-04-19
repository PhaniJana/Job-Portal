'use client'
import JobCard from '@/components/job-card'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { job_service } from '@/context/AppContext'
import { Job } from '@/type'
import axios from 'axios'
import { Briefcase, Filter, MapPin, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'


const locations:string[]=['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow']
const JobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const ref = useRef<HTMLButtonElement>(null)
    const fetchJobs = useCallback(async () => {
            setLoading(true)
            try {
                const {data} = await axios.get(`${job_service}/api/job/all?title=${title}&location=${location}`)
                setJobs(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }, [title, location])

    useEffect(()=>{
        fetchJobs()
    },[title, location, fetchJobs])
    const ClickEvent = ()=> ref.current?.click()

    const clearFilters = () => {
        setTitle('')
        setLocation('')
        fetchJobs()
        ClickEvent()
    }

    const hasActiveFilters = title || location;
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
                    <Button className='gap-2 h-11' onClick={ClickEvent}><Filter size={18}/>Filters
                    {
                        hasActiveFilters && <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">Active</span>
                    }
                    </Button>
                    
                </div>
                {
                    hasActiveFilters && <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm opacity-70">Active Filters:</span>
                        {
                            title && <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                                <Search size={16} className="opacity-70"/>
                                {title}
                                <button onClick={()=>setTitle('') } className='hover:bg-blue-200 dark:bg-blue-800 rounded-full p-0.5'><X size={14}/></button>
                            </div>
                        }
                        {
                            location && <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                                <MapPin size={16} className="opacity-70"/>
                                {location}
                                <button onClick={()=>setLocation('') } className='hover:bg-blue-200 dark:bg-blue-800 rounded-full p-0.5'><X size={14}/></button>
                            </div>
                        }
                    </div>
                }
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={ref} className='hidden'></Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-125'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl flex items-center gap-2'>
                            <Filter className='text-blue-600'/>
                            Filter Jobs
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className='text-sm font-medium flex-center gap-2'><Search size={16}/> Search by Job Title</Label>
                        <Input id='title' type='text' placeholder='Enter job title' className='h-11' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className='text-sm font-medium flex-center gap-2'><MapPin size={16}/> Search by Location</Label>
                        <select
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-11 px-3 border-2 border-gray-300 rounded-md bg-transparent text-black dark:bg-background dark:text-white focus:outline-none focus:ring-2">
                            <option value="">Select location</option>
                            {
                                locations.map((loc, index) => (
                                <option key={index} value={loc} className="dark:bg-background dark:text-white">
                                    {loc}
                                </option>
                                ))
                            }
                            </select>
                    </div>
                    
                </div>
                <DialogFooter className='gap-2'>
                    <Button variant='outline' onClick={clearFilters} className='flex-1'>Clear Filters</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        
    </div>
  )
}

export default JobsPage
