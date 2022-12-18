import { Repository } from "typeorm";
import { Task } from "../entity/Task";
import { Member } from "../entity/Member";
import MemberDAO from "./member.dao";
import { TaskDetails } from "../interface/TaskDetails.interface";
import { Committee } from "../entity/Committee";

class TaskDAO {
    private taskRepository: Repository<Task>;
    private memberDAO: MemberDAO;
    private memberRepository: Repository<Member>;
    constructor(taskRepository: Repository<Task>, memberDAO: MemberDAO, memberRepository: Repository<Member>) {
        this.taskRepository = taskRepository;
        this.memberDAO = memberDAO;
        this.memberRepository = memberRepository;
    }

    public async createTask(
        headCommittee: Committee,
        title: string,
        relatedCommittees: Committee[],
        projectLead: Member | null,
        membersToAdd: Member[] | null,
    ): Promise<Task> {
        try {
            const task = new Task();
            task.ownedBy = headCommittee;
            task.title = title;
            task.relatedCommittees = relatedCommittees;
            if (projectLead) {
                task.leads = [projectLead];
            }
            if (membersToAdd) {
                task.members = [...membersToAdd];
            }
            console.log(task, "36rm");
            await this.taskRepository.save(task);
            return task;
        } catch (error: unknown) {
            
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
            throw "Fail"
        }
        if (task.members === null || task.members === undefined) {
            throw "Fail"
        }
        const currentUsers = task.members ? [...task.members] : [];
        const updated = currentUsers.filter(user => user.userId !== memberId);
        task.members = updated;
        await this.taskRepository.save(task);
        return task;
    }
}

export default TaskDAO;
