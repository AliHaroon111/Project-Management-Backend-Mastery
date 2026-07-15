import Mailgen from "mailgen";

/**
 * First learn about how to create/generate Email(efficiently)
 * Then move to send Email
 */

// Step 1 : Generating the email content
const emailVerificationMailgenContent = (username, verificationUrl) =>{
    return {
        body : {
            name: username,
            intro: "Welcome to the Jungle Welcome2026! (Mean Our App🤪) we'are excited to have you on board.",
            action : {
                instructions : 'To verify you email Please clock on the following button',
                button:{
                    color: "#22BC66",
                    text: "Verify you email",
                    link: verificationUrl
                }
            },
            outro: "Need help, or have questions? Just reply to this email, We'd love to help."
    }
}
}

// same as above - // generating email
const forgotPasswordMailgenContent = (username,passwordResetUrl) =>{
    return{

        body:{
            name:username,
            intro:"we got a request to reset the password of your account.",
        },
        action:{
            Instructions:"To reset your password click on the following button or link",
            button:{
                color:'#22BC66', //optional
                text : "Reset Password",
                link : passwordResetUrl

            },
        },
        // outro start after the actions
        outro : "Need help, or have question just reply to this email, we'd love to help."
    }
}

export {
    emailVerificationMailgenContent,
     forgotPasswordMailgenContent
    };