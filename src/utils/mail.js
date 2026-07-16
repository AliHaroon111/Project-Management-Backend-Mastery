import Mailgen from "mailgen";
import nodemailer from "nodemailer";

/**
 * First learn about how to create/generate Email(efficiently)
 * Then move to send Email
 */

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS
    }
})

const sendEmail = async (options) => {
    //mailgen require Default Branding (Docs)
    const mailGenerator = new Mailgen({
        theme: 'default',
        product : {
            name: "Task Manager",
            link: "https://tasjmanagerlink.com"
        }
    });

    const emailTextual = mailGenerator.generatePlaintext(options.MailgenContent) // we provide MailgenContent in options
    const emailHTML = mailGenerator.generate(options.MailgenContent)

    const mail = {
        from:"aliharoon0111@gmail.com",
        to: options.email,
        subject : options.subject,
        text: emailTextual,
        html: emailHTML
    };

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed siliently ,(this might happen because of credential) make sure that you have provided your MAILTRAP credential in the .env file");
        console.error("Error",error)
    }
}

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
     forgotPasswordMailgenContent,
     sendEmail
    };