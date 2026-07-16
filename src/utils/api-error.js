// We are utilizing the node Built code for this
// Use inheritance you can say

// As You seee extends mean we are utilinzing node Built in Error class

class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        // now utilize the error class So we can call Super
        //Which is calling a cinstructor of ur Parent class

       /**JavaScript has one absolute rule when you use inheritance (extends):
        * ❌ You cannot use the keyword this before you call super().
        * You can create regular, standalone variables before you call super(). */
       
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.errors = errors
        // stack is not always available --> so we work of if and else case
        // it optional thing
        if(stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError