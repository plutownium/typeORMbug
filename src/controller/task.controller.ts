import express, { Router, Request, Response } from "express";
import { TaskDetails } from "../interface/TaskDetails.interface";
import TaskService from "../service/task.service";
import { handleErrorResponse } from "../util/errorResponseHandler";
import { handleResponse } from "../util/handleResponse";
import { isStringInteger } from "../validation/inputValidation";
import { createTaskSchema } from "../validation/taskSchemas";

class TaskController {
    public path = "/task";
    public router = express.Router();
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
        this.router.post("/new", createTaskSchema, this.createTask.bind(this));
        this.router.get("/all", this.getAllTasks.bind(this));
        this.router.put("/new/:taskid/user/:userid", this.addUserToTask.bind(this));
        this.router.put("/remove/user/:userid", this.removeUserFromTask.bind(this));
        this.router.get("/health", this.healthCheck);
    }

    public async createTask(req: Request, res: Response) {
        // **
        // title, one related committee, start date, end date, are required.
        // description, lead, users, status, are optional.
        // **
        try {
            const committeeId = req.body.committeeId;
            const { title, description, relatedCommitteeIds, leadId, memberIds, startDate, endDate, status } = req.body;
            // todo: what to do with the optional params? "if present, validation, if valid, fwd"
            console.log(title, startDate, "31rm");
            const validTaskDetails: TaskDetails = { ...req.body };
            validTaskDetails.committeeId = committeeId;
            console.log(validTaskDetails, "46rm");
            const newTaskDetails = await this.taskService.createTask(validTaskDetails, committeeId);
            return res.status(200).json({ newTaskDetails });
        } catch (error) {
            console.log(error);
            // todo: put this try/catch block in a decorator.
            return res.status(400).json({ error });
        }
    }

    public async getAllTasks(req: Request, res: Response) {
        const allTasks = await this.taskService.getAllTasks();
        return res.status(200).json({ allTasks });
    }

    public async addUserToTask(req: Request, res: Response) {
        try {
            const taskIdInput = req.query.taskid;
            const userIdInput = req.query.userid;
            const taskId = isStringInteger(taskIdInput);
            const userId = isStringInteger(userIdInput);
            const updatedTaskUsers = await this.taskService.addUserToTask(taskId, userId);
            return handleResponse(res, updatedTaskUsers);
        } catch (error) {
            console.log(error);
            return handleErrorResponse(res, error);
        }
    }

    public async removeUserFromTask(req: Request, res: Response) {
        try {
            const taskIdInput = req.query.taskid;
            const userIdInput = req.query.userid;
            const taskId = isStringInteger(taskIdInput);
            const userId = isStringInteger(userIdInput);
            const { removedMembers, updatedTaskMembers } = await this.taskService.removeMemberFromTask(taskId, userId);
            return res.status(200).json({ removedMembers, updatedTaskMembers });
        } catch (error) {
            console.log(error);
            return handleErrorResponse(res, error);
        }
    }

    public async deleteTask(req: Request, res: Response) {
        const taskIdInput = req.query.taskid;
        const taskId = isStringInteger(taskIdInput);
    }

    public healthCheck(req: Request, res: Response) {
        return res.status(200).json({ message: "Online" });
    }
}

export default TaskController;
