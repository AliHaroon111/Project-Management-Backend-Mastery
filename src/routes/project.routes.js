import { Router } from "express"
import { 
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js"
import {
    createProjecValidator,
    addMembersToProjectValidator
 } from "../validators/index.js"
import { verifyJWT, validateProjecPermission } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)



export default router