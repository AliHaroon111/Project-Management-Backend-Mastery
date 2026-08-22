import {Project} from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { subTask } from "../models/subtask.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";


const getTasks = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"Project not found")
    }
    
    const tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName") // for example in task if i want to go into the User So i use ' populate '
    return res
        .status(201)
        .json(
            new ApiResponse(201, tasks, "Task fetched successfully")
        )
});

const createTask = asyncHandler(async (req, res) => {
    const {title, description, assignedTo, status} = req.body
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"Project not found")
    }
    const files = req.files || []

    const attachments = files.map((file) => {
        return {
            url : `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const Task = await Task.create({
        title,
        description,
        project: new mongoose.Type.ObjectId(projectId),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, task, "Task created successfully")
        )
});

const getTaskById = asyncHandler(async (req, res) => {
    //Test
});

const updateTask = asyncHandler(async (req, res) => {
    //Test
});

const deleteTask = asyncHandler(async (req, res) => {
    //Test
});

const createSubTask = asyncHandler(async (req, res) => {
    //Test
});

const updateSubTask = asyncHandler(async (req, res) => {
    //Test
});

const deleteSubTask = asyncHandler(async (req, res) => {
    //Test
});


export { 
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
}