import { Router, Request, Response, NextFunction } from "express";
import { DeleteResult } from "typeorm";
import passport from "passport";
//
import { Member } from "../db/entity/Member";
import { SmallError } from "../interface/SmallError.interface";
import AuthService from "../service/auth.service";
import { isInteger, isStringInteger } from "../validation/inputValidation";

import { googleAuth, googleAuthCallback } from "../middleware/passport.middleware";
import { handleErrorResponse } from "../util/errorResponseHandler";
import { handleResponse } from "../util/handleResponse";
import { enabledTests } from "../config/serverConfig";
import { createTestAccountSchema, testAccountLoginSchema } from "../validation/testAccountSchema";
import { TestAccountLoginResponse } from "../interface/test/TestAccountLoginResponse.interface";
import { MemberDetails } from "../interface/MemberDetails.interface";
import { AccessToken } from "../interface/AccessToken.interface";

class AuthController {
    public path = "/auth";
    public router = Router();
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        // **
        // passport stuff
        // **
        // Redirect the user to the Google signin page<;
        this.router.get("/google", googleAuth);
        // Retrieve user data using the access token received;
        this.router.get("/google/callback", googleAuthCallback, this.grantAccessToken);
        // profile route after successful sign in;
        this.router.get("/profile", passport.authenticate("jwt", { session: false }), this.getProfile);
        // end passport stuff
        // **
        this.router.post("/email/signup", createTestAccountSchema, this.emailSignup.bind(this));
        this.router.post("/email/login", testAccountLoginSchema, this.emailLogin.bind(this));
        // this.router.post("/new", this.createUser.bind(this));
        this.router.get("/all", this.getAllUsers.bind(this));
        this.router.get("/:userid", this.getByUserId.bind(this));
        this.router.put("/:userid", this.changeRole.bind(this));
        this.router.delete("/all", this.deleteAll.bind(this));
        this.router.delete("/:userid", this.deleteMemberById.bind(this));
        this.router.get("/health", this.healthCheck);
    }

    // **
    // ** passport stuff
    public async grantAccessToken(req: Request, res: Response) {
        // https://www.makeuseof.com/nodejs-google-authentication/
        // "If you log in, you will receive the token."
        const user = req.user as MemberDetails; // todo: discover type of 'user' property
        const accessToken: AccessToken = await this.authService.grantToken(user);
        // todo: figure out where this response is sent - presumably to the frontend
        return handleResponse(res, accessToken);
    }
    public async getProfile(req: Request, res: Response) {
        // my hypothesis about what this endpoint is intended to do is
        // that it exchanges the jwt for profile info. Hence "/profile"
        res.send("Welcome");
        // this endpoint will remain in the codebase until either
        // (a) we figure out why we need it
        // (b) we're certain we don't need it
    }

    // **
    // ** end passport stuff

    public async emailSignup(req: Request, res: Response) {
        // endpoint is required for integration tests, since
        // integration tests have no way to log in via Google.
        if (!enabledTests) {
            return handleErrorResponse(res, "Must enable tests for this endpoint");
        }
        const { fakeGoogleId, displayName, email } = req.body;
        const account = await this.authService.emailSignup(fakeGoogleId, displayName, email);
        return handleResponse(res, account);
    }

    public async emailLogin(req: Request, res: Response) {
        if (!enabledTests) {
            return handleErrorResponse(res, "Must enable tests for this endpoint");
        }
        const { email } = req.body;
        const loginAttempt: AccessToken | SmallError = await this.authService.getLoginCredentialViaEmail(email);
        // todo: confirm this works with TestAccountLoginResponse
        return handleResponse(res, loginAttempt);
    }

    public async getAllUsers(req: Request, res: Response) {
        const allUsers: Member[] = await this.authService.getAllUsers();
        return handleResponse(res, allUsers);
    }

    public async getByUserId(req: Request, res: Response) {
        const userIdInput = req.params.userid;
        const userId = isStringInteger(userIdInput);
        const member = await this.authService.getMemberById(userId);
        return handleResponse(res, member);
    }

    public async changeRole(req: Request, res: Response) {
        const userIdInput = req.params.userid;
        const { newRole } = req.body;
        const userId = isStringInteger(userIdInput);
        const updated = await this.authService.changeRole(userId, newRole);

        return handleResponse(res, updated);
    }

    public async deleteMemberById(req: Request, res: Response) {
        const userIdInput = req.params.userid;
        console.log(userIdInput, "27rm");
        const userId = isStringInteger(userIdInput);
        const deleted = await this.authService.deleteMemberById(userId);

        return handleResponse(res, deleted);
    }

    public async deleteAll(req: Request, res: Response) {
        const deleted = await this.authService.deleteAll();
        return handleResponse(res, deleted);
    }

    public healthCheck(req: Request, res: Response) {
        //
        console.log("here, 98rm");
        console.log(res.getHeaders());
        return res.status(200).json({ message: "Online" });
    }
}

export default AuthController;
