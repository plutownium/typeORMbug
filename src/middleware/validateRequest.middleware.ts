import express, { NextFunction, Request, Response } from "express";

import Joi, { ObjectSchema, ValidationError } from "joi";

function validateRequest(req: Request, next: NextFunction, schema: ObjectSchema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        console.log(error.details, "15rm"); // fixme - .replaceAll error underline
        const err = new Error(`Validation error: ${error.details.map(x => x.message.replaceAll('"', "")).join(", ")}`);
        // const err = new Error(`Validation error: ${error.details[0].message}`);
        err.name = "ValidationError";
        next(err);
    } else {
        req.body = value;
        next();
    }
}
export default validateRequest;
