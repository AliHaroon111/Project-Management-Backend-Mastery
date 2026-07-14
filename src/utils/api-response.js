class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export default ApiResponse

// This is the Object This way we use it later

// const response = new ApiResponse(200, { name: "John" }, "Fetched successfully");
// console.log(response)