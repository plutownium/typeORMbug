import { DeleteResult, In, Repository, QueryFailedError } from "typeorm";
import { StandardErrors } from "../../enum/StandardErrors.enum";
import { CommitteeDetails } from "../../interface/CommitteeDetails.interface";
import { SmallError } from "../../interface/SmallError.interface";
import { smallErrorMaker } from "../../util/smallError";
//
import { Committee } from "../entity/Committee";
import { Member } from "../entity/Member";

class CommitteeDAO {
    private committeeRepository: Repository<Committee>;
    constructor(committeeRepository: Repository<Committee>) {
        this.committeeRepository = committeeRepository;
    }

    public async createCommittee(title: string, description: string, head: Member): Promise<Committee> {
        try {
            const committee = new Committee();
            committee.title = title;
            committee.description = description;
            committee.head = head;
            await this.committeeRepository.save(committee);
            return committee;
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error && error.name === "QueryFailedError") {
                const queryFailedError = error as QueryFailedError;
                const errorDetail = queryFailedError.driverError.detail;
                if (errorDetail.includes("headUserId")) {
                    console.log(errorDetail);
                }
                if (error.message.includes("duplicate key")) {
                    console.log(title, description, head, "created a duplicate");
                }
            }
            throw error;
        }
    }

    public async getCommitteeByHead(head: Member): Promise<Committee | null> {
        return await this.committeeRepository.findOne({ where: { head } });
    }

    public async getCommitteesByIds(committeeIds: number[]): Promise<Committee[]> {
        return await this.committeeRepository.find({ where: { committeeId: In(committeeIds) } });
    }

    public async getCommitteeById(committeeId: number): Promise<Committee | null> {
        return await this.committeeRepository.findOne({ where: { committeeId: committeeId } });
    }

    public async getAllCommittees(): Promise<Committee[]> {
        return await this.committeeRepository.find({});
    }

    public async getCommitteeByTitle(title: string): Promise<Committee | null> {
        return await this.committeeRepository.findOne({ where: { title } });
    }

    public async updateCommittee(
        committeeToUpdate: Committee,
        updateDetails: CommitteeDetails,
        correspondingHead: Member,
        leadsToAdd?: Member[] | null,
        membersToAdd?: Member[] | null,
    ) {
        try {
            committeeToUpdate.title = updateDetails.title;
            committeeToUpdate.description = updateDetails.description;
            committeeToUpdate.head = correspondingHead;
            if (leadsToAdd) {
                // .leads can be undefined
                if (committeeToUpdate.leads) {
                    const newLeadsArr = [...committeeToUpdate.leads, ...leadsToAdd];
                    committeeToUpdate.leads = newLeadsArr;
                } else {
                    committeeToUpdate.leads = leadsToAdd;
                }
            }
            if (membersToAdd) {
                // .members can be undefined
                if (committeeToUpdate.members) {
                    const newMembersArr = [...committeeToUpdate.members, ...membersToAdd];
                    committeeToUpdate.members = newMembersArr;
                } else {
                    committeeToUpdate.members = membersToAdd;
                }
            }
            await this.committeeRepository.save(committeeToUpdate);
            return committeeToUpdate;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async updateCommitteeMembers(committee: Committee, newMembers: Member[]): Promise<Committee> {
        committee.members = newMembers;
        return await this.committeeRepository.save(committee);
    }

    public async deleteByCommitteeId(committeeId: number): Promise<DeleteResult> {
        return await this.committeeRepository.delete(committeeId);
    }

    public async deleteAllCommittees(committeeIds?: number[]): Promise<DeleteResult> {
        if (committeeIds) {
            return await this.committeeRepository.delete(committeeIds);
        }
        // if no arg given, delete ALL the entries.
        const allCommitteeIds = await (await this.committeeRepository.find({ where: {} })).map(committee => committee.committeeId);
        return await this.committeeRepository.delete(allCommitteeIds);
    }
}

export default CommitteeDAO;
