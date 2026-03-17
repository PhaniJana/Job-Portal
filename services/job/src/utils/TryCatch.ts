import { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "./ErrorHandler.js";


export const TryCatch = (fn:(req:Request,res:Response,next:NextFunction)=>Promise<any>):RequestHandler=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error:any) {
        if(error instanceof ErrorHandler){
                return res.status(error.statusCode).json({message:error.message});
        }
        else{
            res.status(500).json({message:error.message || 'Internal Server Error'});
        }
    }
}