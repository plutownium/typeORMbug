import { Router, Request, Response } from "express";

class HealthController {
    public path = "/";
    public router = Router();

    constructor() {
        this.router.get("/", this.healthCheck);
    }

    public async healthCheck(req: Request, res: Response) {
        //
        return res.status(200).json({ message: "Working" });
    }
}

export default HealthController;
