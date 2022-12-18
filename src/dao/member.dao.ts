import { In, Repository, DeleteResult } from "typeorm";
import { Role } from "../enum/Role.enum";
//
import { Member } from "../entity/Member";

class MemberDAO {
    private memberRepository: Repository<Member>;
    constructor(memberRepository: Repository<Member>) {
        this.memberRepository = memberRepository;
    }

    public async createUser( displayName: string, ): Promise<Member> {
        try {
            const user = new Member();
            user.displayName = displayName;
            await this.memberRepository.save(user);
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }



    public async getAllUsers(): Promise<Member[]> {
        return await this.memberRepository.find({
     
        });
    }

    public async getMemberById(userId: number): Promise<Member | null> {
        return await this.memberRepository.findOneBy({ userId });
    }

    public async getMembersByIds(userIds: number[]): Promise<Member[]> {
        return await this.memberRepository.find({ where: { userId: In(userIds) } });
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
