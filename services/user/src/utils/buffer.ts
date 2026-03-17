import DataURIParser from "datauri/parser.js";
import path from "path";
import ErrorHandler from "./ErrorHandler.js";


export const createBuffer=(file:any)=>{
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname);
    const buffer = parser.format(extName,file.buffer);
    if(!buffer || !buffer.content){
        throw new ErrorHandler(500,'Error in creating buffer')
    }
    return buffer

}