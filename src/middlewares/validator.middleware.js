import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";


export const validate = (req, res, next) => {
    const errors = validationResult(req) // where are those Validation results?
    if(errors.isEmpty()){
        return next()
    }
    const extractedErrors = [] //By default, validationResult(req) returns a complex internal object. Calling .array() extracts the raw data and gives you an array of objects. ===> But here we are extracting 
    errors.array().map((err) => extractedErrors.push(
        { 
            [err.path]: err.msg // pushing these selective to extractedErrors array

        }));
        throw new ApiError(422,"Recieved data is not valid", extractedErrors)
}