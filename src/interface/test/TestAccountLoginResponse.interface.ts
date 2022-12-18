import { Member } from "../../db/entity/Member";

export interface TestAccountLoginResponse {
    user: Member;
    accessToken: string;
}
