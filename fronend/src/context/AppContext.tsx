"use client"
export const utils_service = 'http://localhost:3005'
export const auth_service = 'http://localhost:3001'
export const user_service = 'http://localhost:3002'
export const job_service = 'http://localhost:3003'
import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, use, useContext, useEffect, useState } from "react"
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
    useEffect(() => {
        if (token) {
            setLoading(true);
            fetchUserData();
        }
    }, [token])
    const logOutHandler = () => {
        Cookies.remove('token');
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully")
    }
    const value: AppContextType = {
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth,
        logOutHandler

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