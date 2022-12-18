import { Router, Request, Response } from "express";
import { Committee } from "../db/entity/Committee";
import { CommitteeDetails } from "../interface/CommitteeDetails.interface";
import CommitteeService from "../service/committee.service";
import { isStringInteger } from "../validation/inputValidation";
import { createCommitteeSchema, updateCommitteeSchema } from "../validation/committeeSchemas";
import { SmallError } from "../interface/SmallError.interface";
import { handleErrorResponse } from "../util/errorResponseHandler";
import { StandardErrors } from "../enum/StandardErrors.enum";
import { DeleteResult } from "typeorm";
import { handleResponse } from "../util/handleResponse";

class CommitteeController {
    public path = "/committee";
    public router = Router();
    private committeeService: CommitteeService;
    constructor(committeeService: CommitteeService) {
        this.committeeService = committeeService;
        this.router.post("/new", createCommitteeSchema, this.createCommittee.bind(this));
        this.router.get("/all", this.getAllCommittees.bind(this));
        this.router.get("/:committeeid", this.getCommitteeById.bind(this));
        this.router.put("/:committeeid", updateCommitteeSchema, this.updateCommitteeDetails.bind(this));
        this.router.delete("/all", this.deleteAllCommittees.bind(this));
        this.router.delete("/:committeeid", this.deleteCommitteeById.bind(this));
        this.router.get("/health", this.healthCheck.bind(this));
    }

    public async createCommittee(req: Request, res: Response) {
        const { title, description, headUserId } = req.body;
        const newCommittee = await this.committeeService.createCommittee(title, description, headUserId);
        return handleResponse(res, newCommittee);
    }

    public async getAllCommittees(req: Request, res: Response) {
        const allCommittees = await this.committeeService.getAllCommittees();
        console.log(allCommittees, "36rm");
        return handleResponse(res, allCommittees);
    }

    public async getCommitteeById(req: Request, res: Response) {
        try {
            const committeeIdInput = req.params.committeeid;
            const committeeId = isStringInteger(committeeIdInput);
            const committee = await this.committeeService.getCommitteeById(committeeId);
            return handleResponse(res, committee);
        } catch (error) {
            console.log(error);
            return handleErrorResponse(res, error);
        }
    }

    public async updateCommitteeDetails(req: Request, res: Response) {
        try {
            const committeeIdInput = req.params.committeeid;
            console.log(committeeIdInput, "42rm");
            const updatedDetails: CommitteeDetails = req.body;
            const committeeId = isStringInteger(committeeIdInput);
            const updatedCommittee = await this.committeeService.updateCommitteeDetails(committeeId, updatedDetails);
            console.log(updatedCommittee, "58rm");
            throw Error("pause");
            return handleResponse(res, updatedCommittee);
        } catch (error) {
            console.log(error);
            return handleErrorResponse(res, error);
        }
    }

    public async deleteCommitteeById(req: Request, res: Response) {
        try {
            const committeeIdInput = req.params.committeeid;
            console.log(committeeIdInput, "59rm");
            const committeeId = isStringInteger(committeeIdInput);
            const deleted = await this.committeeService.deleteCommitteeById(committeeId);
            return handleResponse(res, deleted);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    }

    public async deleteAllCommittees(req: Request, res: Response) {
        const deleted = await this.committeeService.deleteAllCommittees();
        return handleResponse(res, deleted);
    }

    public healthCheck(req: Request, res: Response) {
        console.log("agandd!");
        return res.status(200).json({ message: "Online" });
    }
}

export default CommitteeController;
