import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import validateRequest from "../middleware/validateRequest.middleware";
import { TestAccountSignup } from "../interface/test/TestAccountSignup.interface";
import { TestAccountLogin } from "../interface/test/TestAccountLogin.interface";

function createTestAccountSchema(req: Request, res: Response, next: NextFunction) {
    const schema: ObjectSchema = Joi.object<TestAccountSignup>({
        fakeGoogleId: Joi.string(),
        displayName: Joi.string(),
        email: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function testAccountLoginSchema(req: Request, res: Response, next: NextFunction) {
    const schema: ObjectSchema = Joi.object<TestAccountLogin>({
        email: Joi.string(),
    });
    validateRequest(req, next, schema);
}

export { createTestAccountSchema, testAccountLoginSchema };
