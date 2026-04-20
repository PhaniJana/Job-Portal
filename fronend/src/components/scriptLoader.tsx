"use client"
import { useEffect, useState } from "react";

type RazorpayOpenInstance = {
    open: () => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayOpenInstance;

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

const useRazorPay = () => {

    // ✅ initialize based on current value
    const [isLoaded, setIsLoaded] = useState(() => {
        if (typeof window !== "undefined" && window.Razorpay) return true;
        return false;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        // ✅ if already loaded → do nothing (no setState here)
        if (window.Razorpay) return;

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            setIsLoaded(true); // ✅ async → allowed
        };

        document.body.appendChild(script);

    }, []);

    return isLoaded;
};

export default useRazorPay;
