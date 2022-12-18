import { DeleteResult, In, Repository, QueryFailedError } from "typeorm";

import { Committee } from "../entity/Committee";
import { Member } from "../entity/Member";

class CommitteeDAO {
    private committeeRepository: Repository<Committee>;
    constructor(committeeRepository: Repository<Committee>) {
        this.committeeRepository = committeeRepository;
    }

    public async createCommittee(title: string,  head: Member): Promise<Committee> {
        try {
            const committee = new Committee();
            committee.title = title;
            committee.head = head;
            await this.committeeRepository.save(committee);
            return committee;
        } catch (error: unknown) {
            console.log(error);
          
            throw error;
        }
    }

  
}

export default CommitteeDAO;
