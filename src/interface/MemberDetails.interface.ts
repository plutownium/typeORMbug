import { Role } from "../enum/Role.enum";

export interface MemberDetails {
    userId: number;
    googleId: string;
    displayName: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
