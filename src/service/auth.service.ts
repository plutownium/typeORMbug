import jwt from "jsonwebtoken";
import { DeleteResult } from "typeorm";
import { textChangeRangeIsUnchanged } from "typescript";
//
import MemberDAO from "../db/dao/member.dao";
import { Member } from "../db/entity/Member";
import { Role } from "../enum/Role.enum";
import { StandardErrors } from "../enum/StandardErrors.enum";
import { AccessToken } from "../interface/AccessToken.interface";
import { SmallError } from "../interface/SmallError.interface";
import { MemberDetails } from "../interface/MemberDetails.interface";
import AccountUtil from "../util/accountUtil";
import { smallErrorMaker } from "../util/smallError";

class AuthService {
    private userDAO: MemberDAO;
    private accountUtil: AccountUtil;
    constructor(userDAO: MemberDAO, accountUtil: AccountUtil) {
        //
        this.userDAO = userDAO;
        this.accountUtil = accountUtil;
    }

    public async emailSignup(fakeGoogleId: string, displayName: string, email: string): Promise<Member> {
        //
        return await this.userDAO.createUser(fakeGoogleId, displayName, email);
    }

    public async createUser(googleId: number | string, displayName: string, email: string, role?: Role): Promise<Member | SmallError> {
        //
        const userAlreadyExists = await this.userDAO.getMemberByEmail(email);
        if (userAlreadyExists) {
            return smallErrorMaker(StandardErrors.duplicateEmail);
        }
        const googleIdString = typeof googleId === "string" ? googleId : googleId.toString();
        const googleIdIsTaken = await this.userDAO.getMemberByGoogleId(googleIdString);
        if (googleIdIsTaken) {
            return smallErrorMaker(StandardErrors.duplicateGoogleId);
        }
        return await this.userDAO.createUser(googleIdString, displayName, email, role);
    }

    public async grantToken(user: MemberDetails): Promise<AccessToken> {
        const tokenOrError = this.accountUtil.signJwt(user);
        const accessToken = {
            accessToken: tokenOrError,
        };
        return accessToken;
    }

    public async getLoginCredentialViaEmail(email: string): Promise<AccessToken | SmallError> {
        const user = await this.userDAO.getMemberByEmail(email);
        const noUserFound = user === null;
        if (noUserFound) {
            return smallErrorMaker(StandardErrors.noUserForThisEmail);
        }
        const accessToken: string = await this.accountUtil.signJwt(user);
        return { accessToken: accessToken };
    }

    public async getAllUsers(): Promise<Member[]> {
        return this.userDAO.getAllUsers();
    }

    public async getMemberById(memberId: number): Promise<Member | SmallError> {
        const user = await this.userDAO.getMemberById(memberId);
        const noUserFound = user === null;
        if (noUserFound) {
            return smallErrorMaker(StandardErrors.noUserForThisEmail);
        }
        return user;
    }

    public async changeRole(userId: number, newRole: Role): Promise<Member | SmallError> {
        const user = await this.userDAO.getMemberById(userId);
        const noUserFound = user === null;
        if (noUserFound) {
            return smallErrorMaker(StandardErrors.noUserForThisId);
        }
        const updated = await this.userDAO.updateRole(user, newRole);
        return updated;
    }

    public async deleteMemberById(userId: number): Promise<DeleteResult | SmallError> {
        const user = await this.userDAO.getMemberById(userId);
        const noUserFound = user === null;
        if (noUserFound) {
            return smallErrorMaker(StandardErrors.noUserForThisId);
        }
        return await this.userDAO.deleteMemberById(userId);
    }

    public async deleteAll(): Promise<DeleteResult> {
        return await this.userDAO.deleteAll();
    }
}

export default AuthService;
