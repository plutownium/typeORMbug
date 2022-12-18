import { Repository } from "typeorm";
//
import { RefreshToken } from "../entity/RefreshToken";
import { Member } from "../entity/Member";

class RefreshTokenDAO {
    private refreshTokenRepository: Repository<RefreshToken>;
    constructor(refreshTokenRepository: Repository<RefreshToken>) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    public createRefreshToken = async (user: Member, hexValue: string, expires: Date, createdByIp: string) => {
        // const refreshToken = new RefreshToken();
        // refreshToken.hexValue = hexValue;
        // refreshToken.isActive = true;
        // refreshToken.createdByIp = createdByIp;
        // refreshToken.user = user;
        // await this.refreshTokenRepository.save(refreshToken);
        // return refreshToken;
    };

    public getRefreshTokenById = (tokenId: number) => {
        //
    };

    public getRefreshTokenByTokenString = (tokenString: string) => {
        //
    };

    public getAllRefreshTokensForAccount = (userId: number): RefreshToken[] => {
        return []; // fixme: silence errs temporarily
    };
}

export default RefreshTokenDAO;
