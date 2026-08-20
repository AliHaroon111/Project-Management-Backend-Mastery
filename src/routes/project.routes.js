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
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjecValidator(), validate, createProject) // we have "/" and the get request also running and the post also

    router
    .route("/:projectId")
    .get(validateProjecPermission(AvailableUserRole), getProjectById) // who should be able to get the project
    .put(
        validateProjecPermission([userRoleEnum.ADMIN, userRoleEnum.MEMBER]),
        createProjecValidator(),
        validate,
        updateProject
    )

export default router