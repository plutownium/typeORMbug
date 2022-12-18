import { NextFunction, Request, Response } from "express";
import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";
//
import MemberDAO from "../db/dao/member.dao";
import RefreshTokenDAO from "../db/dao/refreshToken.dao";
import { Member } from "../db/entity/Member";
import { Role } from "../enum/Role.enum";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { memberRepository, refreshTokenRepository } from "../db/data-source";
import { RefreshToken } from "../db/entity/RefreshToken";

dotenv.config({ path: "./.env" });

const secret: string = process.env.JWT_SECRET !== undefined ? process.env.JWT_SECRET : "Failed to load";
if (secret === "Failed to load") {
    throw new Error("JWT_SECRET not found in env file");
}

const userDAO = new MemberDAO(memberRepository);
const refreshTokenDAO = new RefreshTokenDAO(refreshTokenRepository);

function authorize(roles: Role[] = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === "string") {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({
            secret,
            algorithms: ["HS256"],
        }),

        // authorize based on user role
        async (request: RequestWithUser, res: Response, next: NextFunction) => {
            // Note for Jason Watmore: If you're reading this, it looks like, at some point, express-jwt's devs changed things.
            // see https://stackoverflow.com/questions/34775687/express-jwt-setting-user-object-to-req-user-doc-instead-of-just-req-user
            // I discovered this while googling "jwt secret express jwt req.user"
            const acctInfo = request.auth;
            if (acctInfo?.acctId === undefined) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            request.user = {
                acctId: acctInfo.acctId,
                role: "", // temp to satisfy ts
            };
            const account: Member | null = await userDAO.getMemberById(acctInfo.acctId);
            if (!account) return res.status(401).json({ message: "Unauthorized" });
            const refreshTokens: RefreshToken[] = await refreshTokenDAO.getAllRefreshTokensForAccount(account.userId);

            const validRoles = Object.values(Role);
            const acctRole: Role = account.role as Role;
            const rolesFoundOnRequest = roles.length;
            const validRolesIncludesAccountRole = validRoles.includes(acctRole);
            if (rolesFoundOnRequest && !validRolesIncludesAccountRole) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: "Unauthorized" });
            }

            // authentication and authorization successful
            request.user.role = account.role;
            request.user.ownsToken = (token: string) => !!refreshTokens.find((x: RefreshToken) => x.hexValue === token);
            next();
        },
    ];
}

export default authorize;
