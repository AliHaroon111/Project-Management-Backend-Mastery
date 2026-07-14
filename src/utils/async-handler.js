const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=> next())
    }
}

export default asyncHandler


// This below whole thing you can say ====> request and 
//  this whole function requestHandler --> i am calling it requestHandler

//(     (req,res, next) =>{

//     try {
    // const user = await getUserFromDB()
//         res.status(200).json(
//             new ApiResponse(200, {message: "Cool Server is running"})
//         )
//     } catch (error) {
//         next(err)
//     }
// }       )