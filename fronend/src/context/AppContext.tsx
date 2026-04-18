"use client"
export const utils_service = 'http://localhost:3005'
export const auth_service = 'http://localhost:3001'
export const user_service = 'http://localhost:3002'
export const job_service = 'http://localhost:3003'
import { AppContextType, Application, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"
import axios from "axios"
const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider:React.FC<AppProviderProps> = ({children})=>{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const token = Cookies.get('token');

    const fetchUserData = async () => {
        try {
            const {data} = await axios.get<User>(`${user_service}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(data);
            setIsAuth(true);
        } catch (error) {
            console.log(error)
            setIsAuth(false)
        } finally {
            setLoading(false);
        }
    }

    const [applications, setApplications] = useState<Application[]>([])

    const fetchApplications = async () => {
        try {
            const {data} = await axios.get<Application[]>(`${user_service}/api/user/application/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(data);
        } catch (error) {
            console.log(error)
        } 
    }
    useEffect(() => {
        if (token) {
            setLoading(true);
            fetchUserData();
            fetchApplications();

        }
    }, [])

    const updateProfilePic =  async (formData: FormData) => {
        setLoading(true)
        try {
            const {data} = await axios.put(`${user_service}/api/user/update/pic`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                }
            });
            fetchUserData();
            toast.success(data.message || "Profile picture updated successfully")
        } catch (error ) {
            console.log(error);
            toast.error("Failed to update profile picture")
        }
        finally {
            setLoading(false);
        }
    }

    const updateResume =  async (formData: FormData) => {
        setLoading(true)
        try {
            const {data} = await axios.put(`${user_service}/api/user/update/resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                }
            });
            fetchUserData();
            toast.success(data.message || "Resume updated successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to update resume")
        }
        finally {
            setLoading(false);
        }
    }

    const updateProfile = async (name:string,phoneNumber:string,bio:string)=>{
        setBtnLoading(true);
        try {
            const {data} = await axios.put(`${user_service}/api/user/update/profile`, {
                name,
                phoneNumber,
                bio
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchUserData();
            toast.success(data.message || "Profile updated successfully")
        } catch (error ) {
            console.log(error)
            toast.error("Failed to update profile")
        }
        finally {
            setBtnLoading(false);
        }

    }

    const AddSkill = async (skillName: string)=>{
        setBtnLoading(true);
        try {
            const {data} = await axios.post(`${user_service}/api/user/skill/add`, {skillName}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUserData();
            toast.success(data.message || "Skill added successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to add skill")
        }
        finally{
            setBtnLoading(false);
        }
    }

    const removeSkill = async (skillName: string)=>{
        setBtnLoading(true);
        try {
            const {data} = await axios.delete(`${user_service}/api/user/skill/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { skillName }
            });
            fetchUserData();
            toast.success(data.message || "Skill removed successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove skill")
        }
        finally{
            setBtnLoading(false);
        }
    }

    const logOutHandler = () => {
        Cookies.remove('token');
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully")
    }

    const applyJob = async(job_id: number) => {
        setBtnLoading(true);
        try {
            const {data} = await axios.post(
                `${user_service}/api/user/apply`,
                { jobId: job_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(data.message || "Applied for job successfully")
            fetchApplications();
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to apply for job")
            } else {
                toast.error("Failed to apply for job")
            }
        } finally{
            setBtnLoading(false);
        }
    }

    const value: AppContextType = {
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth,
        logOutHandler,
        updateProfilePic,
        updateResume,
        updateProfile,
        AddSkill,
        removeSkill,
        applyJob,
        applications,
        fetchApplications
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <Toaster/>
        </AppContext.Provider>
    );
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppData must be used within an AppProvider")
    }
    return context;
}
