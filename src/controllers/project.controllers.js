import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {projectMember} from "../models/projectmember.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import { userRoleEnum } from "../utils/constants.js";


const getProject = asyncHandler( async (req, res) => {
    // test
});

const getProjectById = asyncHandler( async (req, res) => {
    // test
});

const createProject = asyncHandler( async (req, res) => {
    const {name, description} = req.body

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });
    // we create a project - but this is our respnosibilty to create Admin for this project
    await projectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: userRoleEnum.ADMIN
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                project,
                "Project created successfuly"
            )
        )
});

const updateProject = asyncHandler( async (req, res) => {
    // test
});


const deleteProject = asyncHandler( async (req, res) => {
    // test
});


const addMembersToProject = asyncHandler( async (req, res) => {
    // test
});


const getProjectMembers = asyncHandler( async (req, res) => {
    // test
});


const updateMemberRole = asyncHandler( async (req, res) => {
    // test
});


const deleteMember = asyncHandler( async (req, res) => {
    // test
});


export {
    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}