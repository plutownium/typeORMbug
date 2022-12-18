import express, { Router, Request, Response } from "express";
import OnboardingService from "../service/onboarding.service";
import TaskService from "../service/task.service";
import ProjectService from "../service/task.service";
import { handleErrorResponse } from "../util/errorResponseHandler";

class OnboardingController {
    public path = "/onboarding";
    public router = express.Router();
    private onboardingService: OnboardingService;

    constructor(onboardingService: OnboardingService) {
        this.onboardingService = onboardingService;
        this.router.post("/new", this.createStep);
        this.router.get("/all", this.getAllSteps);
        this.router.put("/:id", this.updateStep);
        this.router.delete("/:id", this.deleteStep);
    }

    public async createStep(req: Request, res: Response) {
        const pdfURL = req.body.pdfURL;
        const noPdfUrlAdded = pdfURL === undefined;
        const pdfUrlWasntString = typeof pdfURL !== "string";
        const pdfUrlWasEmptyString = pdfURL.length === 0;
        if (noPdfUrlAdded || pdfUrlWasEmptyString || pdfUrlWasntString) {
            return handleErrorResponse(res, "pdfURL required");
        }
        const stored = await this.onboardingService.storePdfUrl(pdfURL);
        return res.status(200).json({ message: stored });
    }

    public async getAllSteps(req: Request, res: Response) {
        const allSteps = await this.onboardingService.getAllSteps();
        return res.status(200).json({ steps: allSteps });
    }

    public async updateStep(req: Request, res: Response) {
        const stepIdInput = req.query.id;
        const undefinedInput = stepIdInput === undefined;
        const nonStringInput = typeof stepIdInput !== "string";
        if (undefinedInput || nonStringInput) {
            return handleErrorResponse(res, "Query id must be defined and a string integer");
        }
        const stepId = parseInt(stepIdInput, 10);
        if (isNaN(stepId)) {
            return handleErrorResponse(res, "Query id must be a string integer");
        }
        // const stepDetails // todo: figure out what details the step will have!
        const updatedStep = await this.onboardingService.updateStep(stepId);
        return res.status(200).json({ updatedStep });
    }

    public async deleteStep(req: Request, res: Response) {
        const stepIdInput = req.query.id;
        const undefinedInput = stepIdInput === undefined;
        const nonStringInput = typeof stepIdInput !== "string";
        if (undefinedInput || nonStringInput) {
            return handleErrorResponse(res, "Query id must be defined and a string integer");
        }
        const stepId = parseInt(stepIdInput, 10);
        if (isNaN(stepId)) {
            return handleErrorResponse(res, "Query id must be a string integer");
        }
        const deletedStep = await this.onboardingService.deleteStep(stepId);
        return res.status(200).json({ deletedStep });
    }
}

export default OnboardingController;
