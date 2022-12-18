import { DeleteResult } from "typeorm";
import CommitteeDAO from "../db/dao/committee.dao";
import MemberDAO from "../db/dao/member.dao";
import { Committee } from "../db/entity/Committee";
import { Member } from "../db/entity/Member";
import { StandardErrors } from "../enum/StandardErrors.enum";
import { CommitteeDetails } from "../interface/CommitteeDetails.interface";
import { SmallError } from "../interface/SmallError.interface";
import { smallErrorMaker } from "../util/smallError";

class CommitteeService {
    private committeeDAO: CommitteeDAO;
    private userDAO: MemberDAO;
    constructor(committeeDAO: CommitteeDAO, userDAO: MemberDAO) {
        this.committeeDAO = committeeDAO;
        this.userDAO = userDAO;
    }

    public async createCommittee(title: string, description: string, headUserId: number): Promise<Committee | SmallError> {
        const userToBeHead: Member | null = await this.userDAO.getMemberById(headUserId);
        const userNotFound = userToBeHead === null;
        if (userNotFound) {
            return smallErrorMaker(StandardErrors.noUserForThisId);
        }
        const committeesUserIsHeadOf = await this.committeeDAO.getCommitteeByHead(userToBeHead);
        const userIsAlreadyAHead = committeesUserIsHeadOf !== null;
        if (userIsAlreadyAHead) {
            return smallErrorMaker(StandardErrors.cantBeHeadTwice);
        }
        // const all = await this.committeeDAO.getAllCommittees();
        // console.log(all);
        // console.log(headUserId);
        const newCommittee: Committee = await this.committeeDAO.createCommittee(title, description, userToBeHead);
        return newCommittee;
    }

    public async getAllCommittees(): Promise<Committee[]> {
        return await this.committeeDAO.getAllCommittees();
    }

    public async getCommitteeById(committeeId: number) {
        const committee = await this.committeeDAO.getCommitteeById(committeeId);
        const noCommitteeFound = committee === null;
        if (noCommitteeFound) {
            return smallErrorMaker(StandardErrors.noCommitteeForThisId);
        }
        return committee;
    }

    public async updateCommitteeDetails(committeeId: number, updateDetails: CommitteeDetails): Promise<Committee | SmallError> {
        //
        const correspondingCommittee: Committee | null = await this.committeeDAO.getCommitteeById(committeeId);
        const committeeNotFound = correspondingCommittee === null;
        if (committeeNotFound) {
            return smallErrorMaker(StandardErrors.noCommitteeForThisId);
        }
        const correspondingHead: Member | null = await this.userDAO.getMemberById(updateDetails.headUserId);
        const headNotFound = correspondingHead === null;
        if (headNotFound) {
            return smallErrorMaker("Head not found for this user id");
        }
        const leadsToAdd = updateDetails.leadIds ? await this.userDAO.getMembersByIds(updateDetails.leadIds) : null;
        const membersToAdd = updateDetails.memberIds ? await this.userDAO.getMembersByIds(updateDetails.memberIds) : null;
        const update: Committee = await this.committeeDAO.updateCommittee(
            correspondingCommittee,
            updateDetails,
            correspondingHead,
            leadsToAdd,
            membersToAdd,
        );
        return update;
    }

    public async updateCommitteeMembers(committeeId: number, memberIds: number[]): Promise<Committee | SmallError> {
        // you submit an array of member ids, and those are the new members of the committee.
        const users: Member[] = await this.userDAO.getMembersByIds(memberIds);
        const committee = await this.committeeDAO.getCommitteeById(committeeId);
        const committeeNotFound = committee === null;
        if (committeeNotFound) {
            return smallErrorMaker(StandardErrors.noCommitteeForThisId);
        }
        const updated: Committee = await this.committeeDAO.updateCommitteeMembers(committee, users);
        return updated;
    }

    public async deleteCommitteeById(committeeId: number): Promise<DeleteResult | SmallError> {
        const correspondingCommittee: Committee | null = await this.committeeDAO.getCommitteeById(committeeId);
        const committeeNotFound = correspondingCommittee === null;
        if (committeeNotFound) {
            return smallErrorMaker(StandardErrors.noCommitteeForThisId);
        }
        const deleted: DeleteResult = await this.committeeDAO.deleteByCommitteeId(committeeId);
        return deleted;
    }

    public async deleteAllCommittees(): Promise<DeleteResult> {
        const allCommittees = await this.committeeDAO.getAllCommittees();
        return await this.committeeDAO.deleteAllCommittees(allCommittees.map(committee => committee.committeeId));
    }
}

export default CommitteeService;
