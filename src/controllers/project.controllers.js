import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {projectMember} from "../models/projectmember.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import { userRoleEnum } from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";


const getProjects = asyncHandler( async (req, res) => {
    const projects = await projectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id) // mean I'm 100% sure this is a mongoose ObjID
            },
        },
        {
            $lookup: {
                from : "projects",
                localField: "project", // our schema have project field not projects
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmember",
                            localField: "_id",
                            foreignField: "project", 
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$projects"
        },
        {
           $project: {
                project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1
                },
                role: 1,
                _id: 0
           } 
        }
    ]);

    return res
        .status(200)
        .json( new ApiResponse(
            200,
            projects,
            "Projects fetched successfully"
        ))
});

const getProjectById = asyncHandler( async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            project,
            "Project fetched successfully"
        ));
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
                "Project created Successfully"
            )
        )
});

const updateProject = asyncHandler( async (req, res) => {
    const {name, description } = req.body
    const {projectId} = req.params

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        {new: true} // database to return the modified document 
    );
    
    if(!project){
        throw new ApiError(
            404,
            "Project not found"
        )
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project updated Successfully"
            )
        )
});

const deleteProject = asyncHandler( async (req, res) => {
    const {projectId} = req.params

    const project = await Project.findByIdAndDelete(projectId)
    if(!project){
        throw new ApiError(
            404,
            "Project not found"
        )
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project deleted Successfully"
            )
        )
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
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}