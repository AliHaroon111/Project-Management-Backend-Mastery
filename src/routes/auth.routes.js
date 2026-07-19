import { Router } from "express"
import { login, registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator } from "../validators/index.js"

const router = Router();

// userRegisterValidator() ---> this will process the errors -- validate collects error and complete the proccess
router.route("/register").post(userRegisterValidator(), validate, registerUser)
router.route("/login").post(login)

export default router