import { Repository } from "typeorm";
import { TaskDetails } from "../../interface/TaskDetails.interface";
import { Committee } from "../entity/Committee";
import { Task } from "../entity/Task";
import { Member } from "../entity/Member";
import { StandardErrors } from "../../enum/StandardErrors.enum";
import MemberDAO from "./member.dao";

class TaskDAO {
    private taskRepository: Repository<Task>;
    constructor(taskRepository: Repository<Task>, memberDAO: MemberDAO, memberRepository: Repository<Member>) {
        this.taskRepository = taskRepository;
    }

    public async createTask(
        headCommittee: Committee,
        taskDetails: TaskDetails,
        relatedCommittees: Committee[] | null,
        projectLead: Member | null,
        membersToAdd: Member[] | null,
    ): Promise<Task> {
        try {
            const task = new Task();
            task.title = taskDetails.title;
            task.startDate = taskDetails.startDate;
            task.endDate = taskDetails.endDate;
            task.ownedBy = headCommittee;
            if (projectLead) {
                task.leads = [projectLead];
            }
            if (membersToAdd) {
                task.members = [...membersToAdd];
            }
            if (relatedCommittees) {
                task.relatedCommittees = relatedCommittees;
            }
            console.log(task, "36rm");
            await this.taskRepository.save(task);
            return task;
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "QueryFailedError") {
                // console.log(error);
                if (error.message.includes("null value in column")) {
                    console.log(headCommittee, taskDetails, relatedCommittees, projectLead, "had a null value");
                }
                if (error.message.includes("duplicate key")) {
                    console.log(headCommittee, taskDetails, relatedCommittees, projectLead, "created a duplicate");
                }
            }
            throw error;
        }
    }

    public async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find({});
    }

    public async getTaskById(taskId: number): Promise<Task | null> {
        return await this.taskRepository.findOne({ where: { taskId } });
    }

    public async addMemberToTask(task: Task, user: Member): Promise<Task> {
        let currentUsers: Member[] = [];
        if (task.members !== null && task.members !== undefined) {
            currentUsers = [...task.members, user];
        } else {
            currentUsers = [user];
        }
        task.members = currentUsers;
        await this.taskRepository.save(task);
        return task;
    }

    public async addMembersToTask(task: Task, members: Member[]): Promise<Task> {
        const currentMembers = task.members || [];
        const withAdded = [...currentMembers, members].flat();
        task.members = withAdded;
        await this.taskRepository.save(task);
        return task;
    }

    public async removeMemberFromTask(taskId: number, memberId: number): Promise<Task> {
        const task: Task | null = await this.taskRepository.findOne({ where: { taskId } });
        if (task === null) {
            throw new Error(StandardErrors.noTaskForThisId);
        }
        if (task.members === null || task.members === undefined) {
            throw new Error(StandardErrors.noMemberToRemove);
        }
        const currentUsers = task.members ? [...task.members] : [];
        const updated = currentUsers.filter(user => user.userId !== memberId);
        task.members = updated;
        await this.taskRepository.save(task);
        return task;
    }
}

export default TaskDAO;
