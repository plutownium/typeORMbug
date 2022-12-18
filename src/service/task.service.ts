import CommitteeDAO from "../db/dao/committee.dao";
import TaskDAO from "../db/dao/task.dao";
import MemberDAO from "../db/dao/member.dao";
import { Committee } from "../db/entity/Committee";
import { Task } from "../db/entity/Task";
import { Member } from "../db/entity/Member";
import { SmallError } from "../interface/SmallError.interface";
import { TaskDetails } from "../interface/TaskDetails.interface";
import { smallErrorMaker } from "../util/smallError";
import { StandardErrors } from "../enum/StandardErrors.enum";

class TaskService {
    private taskDAO: TaskDAO;
    private committeeDAO: CommitteeDAO;
    private userDAO: MemberDAO;
    constructor(taskDAO: TaskDAO, committeeDAO: CommitteeDAO, userDAO: MemberDAO) {
        this.taskDAO = taskDAO;
        this.committeeDAO = committeeDAO;
        this.userDAO = userDAO;
    }

    public async createTask(taskDetails: TaskDetails, headCommitteeId: number): Promise<Task | SmallError> {
        const headCommittee = await this.committeeDAO.getCommitteeById(headCommitteeId);
        const noHeadCommiteeFound = headCommittee === null;
        if (noHeadCommiteeFound) {
            return smallErrorMaker(StandardErrors.noHeadCommitteeFound);
        }
        const committeeIdsToAdd = taskDetails.relatedCommitteeIds ? taskDetails.relatedCommitteeIds : [];
        const correspondingCommittees = await this.committeeDAO.getCommitteesByIds(committeeIdsToAdd);
        const noCommitteesFound = correspondingCommittees.length === 0;
        const relatedCommitteesWereSubmitted = taskDetails.relatedCommitteeIds && taskDetails.relatedCommitteeIds.length !== 0;
        if (relatedCommitteesWereSubmitted && noCommitteesFound) {
            return smallErrorMaker(StandardErrors.noCommitteesForTheseIds);
        }
        const projectLead: Member | null = taskDetails.leadId ? await this.userDAO.getMemberById(taskDetails.leadId) : null;
        const membersToAdd: Member[] | null = taskDetails.memberIds ? await this.userDAO.getMembersByIds(taskDetails.memberIds) : null;
        const update: Task = await this.taskDAO.createTask(headCommittee, taskDetails, correspondingCommittees, projectLead, membersToAdd);
        return update;
    }

    public async getAllTasks() {
        return await this.taskDAO.getAllTasks();
    }

    public async addUserToTask(taskId: number, userId: number): Promise<Task | SmallError> {
        const user = await this.userDAO.getMemberById(userId);
        const noUserFound = user === null;
        if (noUserFound) {
            return smallErrorMaker("No user found for this id");
        }
        const taskToUpdate = await this.taskDAO.getTaskById(taskId);
        const noTaskFound = taskToUpdate === null;
        if (noTaskFound) {
            return smallErrorMaker("No task found for this id");
        }
        return await this.taskDAO.addMemberToTask(taskToUpdate, user);
    }

    public async removeMemberFromTask(taskId: number, memberId: number) {
        const removedMembers = memberId;
        const updatedTaskMembers = await this.taskDAO.removeMemberFromTask(taskId, memberId);
        return { removedMembers, updatedTaskMembers };
    }
}

export default TaskService;
