import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import validateRequest from "../middleware/validateRequest.middleware";
import { CommitteeDetails } from "../interface/CommitteeDetails.interface";

function createCommitteeSchema(req: Request, res: Response, next: NextFunction) {
    const schema: ObjectSchema = Joi.object<CommitteeDetails>({
        title: Joi.string().required(),
        description: Joi.string(),
        headUserId: Joi.number(),
    });
    validateRequest(req, next, schema);
}

function updateCommitteeSchema(req: Request, res: Response, next: NextFunction) {
    const schema: ObjectSchema = Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        headUserId: Joi.number(),
        newLeadId: Joi.number(),
        newMemberIds: Joi.array().items(Joi.number()),
    });
    validateRequest(req, next, schema);
}

export { createCommitteeSchema, updateCommitteeSchema };
