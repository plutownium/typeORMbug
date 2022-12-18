import jwt from "jsonwebtoken";
import crypto from "crypto";
// import bcrypt from "bcrypt";
import dotenv from "dotenv";

import RefreshTokenDAO from "../db/dao/refreshToken.dao";
import { Member } from "../db/entity/Member";
import { MemberDetails } from "../interface/MemberDetails.interface";

dotenv.config({ path: "./.env" });

const JWT_SECRET: string = process.env.JWT_SECRET !== undefined ? process.env.JWT_SECRET : "Failed to load";
if (JWT_SECRET === "Failed to loda") {
    throw new Error("secret not found in env file");
}

class AccountUtil {
    constructor(refreshTokenDAO?: RefreshTokenDAO) {
    }

    public signJwt(user: Member | MemberDetails): string {
        return jwt.sign({ sub: user.userId, userId: user.userId }, JWT_SECRET, { expiresIn: "15m" });
        // jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" }, (err, token: string | undefined) => {
        //     if (err) {
        //         console.log(err, "31rm");
        //         tokenOrError = null;
        //         // return null;
        //         // return res.json({
        //         //     accessToken: null,
        //         // });
        //     }
        //     console.log(token, "37rm");
        //     // return token;
        //     return token;
        //     // res.json({
        //     //     token,
        //     // });
        // });
        // return tokenOrError;
    }

    // delete if still here in mid january
    // **
    // public randomTokenString() {
    //     return crypto.randomBytes(40).toString("hex");
    // }

    // public hash(password: string) {
    //     return bcrypt.hashSync(password, 10);
    // }

    // public async getRefreshTokenByTokenString(tokenString: string): Promise<RefreshToken> {
    //     const refreshToken = await this.refreshTokenDAO.getRefreshTokenByTokenString(tokenString);
    //     // fixme: .populate("account"); does what? see line 64         const { account } = refreshToken;
    //     if (!refreshToken || !refreshToken.isActive) throw new Error("Invalid token");
    //     return refreshToken;
    // }

    // public generateJwtToken(account: IAccount) {
    //     // create a jwt token containing the account id that expires in 15 minutes
    //     return jwt.sign({ sub: account.acctId, acctId: account.acctId }, secret, { expiresIn: "15m" });
    // }

    // public async generateRefreshToken(account: IAccount, ipAddress: string): Promise<RefreshToken> {
    //     // create a refresh token that expires in 7 days
    //     const accountId = account.acctId;
    //     const token = this.randomTokenString();
    //     const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    //     const createdByIp = ipAddress;
    //     return await this.refreshTokenDAO.createRefreshToken(accountId, token, expires, createdByIp);
    // }
}
export default AccountUtil;
