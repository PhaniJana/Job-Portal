import DatauriParser from "datauri/parser.js";
import path from "path";
import ErrorHandler from "./errorHandler.js";

const getBuffer=(file:any)=>{
    const parser=new DatauriParser();
    const extName=path.extname(file.originalname).toString();
    const result= parser.format(extName,file.buffer);
    if(!result ||!result.content){
        throw new ErrorHandler('Failed to convert file to buffer',500);
    }
    return result.content;
}

export default getBuffer;