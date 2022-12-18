import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import validateRequest from "../middleware/validateRequest.middleware";
import { TaskDetails } from "../interface/TaskDetails.interface";

function createTaskSchema(req: Request, res: Response, next: NextFunction) {
    const schema: ObjectSchema = Joi.object<TaskDetails>({
        title: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        committeeId: Joi.number(),
        relatedCommitteeIds: Joi.array().items(Joi.number()).required(),
        description: Joi.string().optional(),
        status: Joi.string().optional(),
        leadId: Joi.number().optional(),
        memberIds: Joi.array().items(Joi.number()).optional(),
    });
    validateRequest(req, next, schema);
}

export { createTaskSchema };
