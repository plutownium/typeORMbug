import { In, Repository, DeleteResult } from "typeorm";
import { Role } from "../enum/Role.enum";
//
import { Member } from "../entity/Member";

class MemberDAO {
    private memberRepository: Repository<Member>;
    constructor(memberRepository: Repository<Member>) {
        this.memberRepository = memberRepository;
    }

    public async createUser(googleIdString: string, displayName: string, email: string, specifiedRole?: Role): Promise<Member> {
        try {
            const user = new Member();
            user.googleId = googleIdString;
            user.displayName = displayName;
            user.email = email;
            user.role = specifiedRole ? specifiedRole : Role.NewUser;
            await this.memberRepository.save(user);
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async getMemberByGoogleId(googleIdString: string): Promise<Member | null> {
        return await this.memberRepository.findOne({ where: { googleId: googleIdString } });
    }

    public async getMemberByEmail(email: string): Promise<Member | null> {
        return await this.memberRepository.findOne({ where: { email } });
    }

    public async getAllUsers(): Promise<Member[]> {
        return await this.memberRepository.find({
            relations: {
            },
        });
    }

    public async getMemberById(userId: number): Promise<Member | null> {
        return await this.memberRepository.findOneBy({ userId });
    }

    public async getMembersByIds(userIds: number[]): Promise<Member[]> {
        return await this.memberRepository.find({ where: { userId: In(userIds) } });
    }

    public async updateRole(user: Member, newRole: Role) {
        user.role = newRole;
        await this.memberRepository.save(user);
        return user;
    }

    public async deleteMemberById(userId: number): Promise<DeleteResult> {
        return await this.memberRepository.delete(userId);
    }

    public async deleteAll(): Promise<DeleteResult> {
        try {
            console.log("Deleting all rows in user repository");
            const x = await this.memberRepository.delete({});
            console.log(x);
            return x;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default MemberDAO;
