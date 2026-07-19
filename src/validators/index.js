import { body } from "express-validator"; // also query use Based on need

const userRegisterValidator = () =>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .isEmpty()
            .withMessage("Username os required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({min:3})
            .withMessage("Username must be atleast 3 characters long"),
            body("password")
                .trim()
                .notEmpty()
                .withMessage("Password is required"),
            body("fullName")
                .optional()
                .trim(),
        
    ]
}

const userLoginValidator = () => {
    return [
        body('email')
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ];
}

export {
    userRegisterValidator, userLoginValidator
}